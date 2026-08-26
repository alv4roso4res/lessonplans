import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface LessonPlanRequest {
  tema: string;
  ano_escolar: string;
  disciplina: string;
}

// origens autorizadas a chamar a função pelo navegador. Sobrescreva com
// `supabase secrets set ALLOWED_ORIGINS="https://a.com,https://b.com"`
// para incluir domínios de preview da Vercel.
const DEFAULT_ORIGINS = "https://lessonplans.vercel.app,http://localhost:5173";

const ALLOWED_ORIGINS = new Set(
  (Deno.env.get("ALLOWED_ORIGINS") ?? DEFAULT_ORIGINS)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

// limites de entrada: o prompt é montado aqui, então o cliente só envia campos curtos
const FIELD_MAX_LENGTH = 120;
const MAX_BODY_BYTES = 4_000;

// caracteres de controle (inclui quebras de linha) — escrito via string para
// não deixar bytes de controle literais no fonte. O casamento com controles é
// justamente o objetivo aqui, daí o disable.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001F\\u007F]", "g");

const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.5-flash-lite";

function buildCorsHeaders(req: Request): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };

  // origem não autorizada: omite o header (nunca ecoa "null", que é burlável
  // por iframe sandbox) e o navegador bloqueia a resposta
  const origin = req.headers.get("Origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function fail(status: number, message: string, headers: Record<string, string>) {
  return new Response(JSON.stringify({ error: message }), { status, headers });
}

/**
 * Normaliza um campo vindo do cliente antes de interpolá-lo no prompt:
 * só string, dentro do limite, sem caracteres de controle e sem aspas —
 * que permitiriam escapar da delimitação do campo (prompt injection).
 */
function normalizeField(value: unknown): string | null {
  if (typeof value !== "string" || value.length > MAX_BODY_BYTES) return null;

  const cleaned = value
    .replace(CONTROL_CHARS, " ")
    .replace(/["`]/g, "'")
    .trim();

  if (!cleaned || cleaned.length > FIELD_MAX_LENGTH) return null;

  return cleaned;
}

// shape exigido do modelo. Mantenha em sincronia com LessonPlanContent /
// RUBRICA_NIVEIS (src/types/gemini.ts) e com o exemplo do prompt abaixo.
const LESSON_PLAN_SCHEMA = {
  type: "object",
  properties: {
    introducao_ludica: { type: "string" },
    objetivo_bncc: { type: "string" },
    passo_a_passo: { type: "string" },
    rubrica_avaliacao: {
      type: "object",
      properties: {
        "Excelente": { type: "string" },
        "Bom": { type: "string" },
        "Em Desenvolvimento": { type: "string" },
      },
      required: ["Excelente", "Bom", "Em Desenvolvimento"],
    },
  },
  required: ["introducao_ludica", "objetivo_bncc", "passo_a_passo", "rubrica_avaliacao"],
  propertyOrdering: ["introducao_ludica", "objetivo_bncc", "passo_a_passo", "rubrica_avaliacao"],
};

function buildLessonPlanPrompt({ tema, ano_escolar, disciplina }: LessonPlanRequest): string {
  return `Você é um especialista em pedagogia e na BNCC. Crie um plano de aula para a disciplina "${disciplina}", destinado ao "${ano_escolar}", com o tema "${tema}". Sua resposta DEVE ser um objeto JSON, sem nenhum texto ou formatação adicional fora dele. O JSON deve ter EXATAMENTE a seguinte estrutura: {"introducao_ludica": "Uma introdução criativa e curta para o tema.", "objetivo_bncc": "Um objetivo de aprendizagem claro, incluindo o código da habilidade da BNCC (ex: EF03CI02).", "passo_a_passo": "Um roteiro detalhado da atividade em formato de texto simples. Não use asteriscos (*) e nem hashtags (#), separe os tópicos em números, um por linha, escapando a quebra de linha como \\n dentro da string JSON (exemplo: 1) Inicio\\n2) Passo a passo). Nunca escreva uma quebra de linha literal dentro de uma string do JSON", "rubrica_avaliacao": {"Excelente": "Descrição para o critério 'Excelente'.", "Bom": "Descrição para o critério 'Bom'.", "Em Desenvolvimento": "Descrição para o critério 'Em Desenvolvimento'."}}`;
}

Deno.serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  const jsonHeaders = { "Content-Type": "application/json", ...corsHeaders };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return fail(405, "Método não permitido.", jsonHeaders);
  }

  const contentLength = Number(req.headers.get("Content-Length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return fail(413, "Requisição muito grande.", jsonHeaders);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

  if (!supabaseUrl || !supabaseAnonKey || !geminiApiKey) {
    console.error("Edge function mal configurada: variáveis de ambiente ausentes.");
    return fail(500, "Serviço indisponível no momento.", jsonHeaders);
  }

  // 1. Autenticação. `verify_jwt` sozinho não basta: a anon key é um JWT válido
  //    e está publicada no bundle do frontend. getUser() só resolve para um
  //    usuário real, então a anon key sozinha é rejeitada aqui.
  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!jwt) {
    return fail(401, "Não autorizado.", jsonHeaders);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
  if (authError || !user) {
    console.error("Chamada não autenticada:", authError?.message ?? "sem usuário no token");
    return fail(401, "Não autorizado.", jsonHeaders);
  }

  try {
    // 2. Validação da entrada. O prompt é montado aqui — o cliente nunca
    //    controla o texto enviado ao modelo.
    let payload: Partial<LessonPlanRequest>;
    try {
      payload = await req.json();
    } catch {
      return fail(400, "Corpo da requisição inválido.", jsonHeaders);
    }

    const tema = normalizeField(payload?.tema);
    const ano_escolar = normalizeField(payload?.ano_escolar);
    const disciplina = normalizeField(payload?.disciplina);

    if (!tema || !ano_escolar || !disciplina) {
      return fail(
        400,
        `Informe tema, ano escolar e disciplina (até ${FIELD_MAX_LENGTH} caracteres cada).`,
        jsonHeaders,
      );
    }

    const prompt = buildLessonPlanPrompt({ tema, ano_escolar, disciplina });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            // saída estruturada: a API passa a garantir JSON sintaticamente
            // válido (com as quebras de linha já escapadas). Sem isto o modelo
            // devolvia, de vez em quando, quebras de linha cruas dentro de
            // `passo_a_passo` e o JSON.parse do cliente estourava.
            responseMimeType: "application/json",
            responseSchema: LESSON_PLAN_SCHEMA,
          }
        }),
      }
    );

    const data = await response.json();

    // erro real da Gemini API (chave inválida, cota estourada, etc.) fica no
    // log da função; o cliente recebe mensagem genérica
    if (!response.ok || data.error) {
      console.error('Gemini API error:', JSON.stringify(data.error ?? data));
      return fail(502, 'A IA não conseguiu responder agora. Tente novamente.', jsonHeaders);
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    // resposta sem texto (vazia ou bloqueada) não pode virar 200
    if (!aiResponse) {
      console.error('Gemini sem texto na resposta:', JSON.stringify(data));
      return fail(502, 'A IA não retornou texto (resposta vazia ou bloqueada).', jsonHeaders);
    }

    console.log(`plano gerado | user=${user.id} | tokens=${data.usageMetadata?.totalTokenCount ?? '?'}`);

    return new Response(
      JSON.stringify({
        text: aiResponse,
        usage: data.usageMetadata
      }),
      { headers: jsonHeaders }
    );

  } catch (error) {
    console.error('Erro inesperado na edge function:', error);
    return fail(500, 'Erro ao processar a requisição.', jsonHeaders);
  }
});
