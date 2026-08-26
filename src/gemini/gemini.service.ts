import { LESSON_PLAN_FIELD_MAX_LENGTH, isLessonPlanContent } from "../types/gemini";
import type { GeminiResponse, LessonPlanContent, LessonPlanRequest } from "../types/gemini";
import { supabase } from "../services/supabase";
import { FunctionsHttpError } from "@supabase/supabase-js";

// normalização de conveniência: a validação que vale é a da edge function,
// que é quem monta o prompt (supabase/functions/gemini/index.ts)
function normalizeRequest(params: LessonPlanRequest): LessonPlanRequest {
    const entries = Object.entries(params) as [keyof LessonPlanRequest, string][];
    const normalized = {} as LessonPlanRequest;

    for (const [field, value] of entries) {
        const trimmed = (value ?? "").trim();

        if (!trimmed || trimmed.length > LESSON_PLAN_FIELD_MAX_LENGTH) {
            throw new Error(
                `Preencha tema, ano escolar e disciplina com até ${LESSON_PLAN_FIELD_MAX_LENGTH} caracteres.`
            );
        }

        normalized[field] = trimmed;
    }

    return normalized;
}

export const askGemini = async (payload: LessonPlanRequest): Promise<string> => {
    const { data, error } = await supabase.functions.invoke<GeminiResponse>(
        "gemini",
        { body: payload }
    );

    if (error) {
        // a edge function devolve { error: <mensagem genérica> } em não-2xx;
        // o detalhe real fica nos logs dela
        let serverMessage: string | undefined;
        if (error instanceof FunctionsHttpError) {
            try {
                const body = await error.context.json();
                serverMessage = body?.error;
            } catch {
                // corpo não-JSON; mantém a mensagem genérica
            }
        }
        console.error("Erro - Edge Function: ", serverMessage ?? error);
        throw new Error(serverMessage ?? "Não foi possível obter uma resposta da IA.");
    }

    if (!data?.text) {
        throw new Error("Resposta inválida da IA.");
    }

    return data.text;
};

// remove cercas de markdown (```json ... ```) e qualquer texto que o modelo
// tenha escrito antes/depois do objeto, recortando do primeiro `{` ao último `}`
function extractJson(text: string): string {
    const withoutFences = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const start = withoutFences.indexOf("{");
    const end = withoutFences.lastIndexOf("}");

    if (start === -1 || end <= start) return withoutFences;

    return withoutFences.slice(start, end + 1);
}

/**
 * Escapa caracteres de controle que estejam DENTRO de strings do JSON.
 *
 * O prompt pede um roteiro "pulando linhas", e o modelo às vezes atende com
 * quebras de linha cruas dentro do valor de `passo_a_passo` — que são JSON
 * inválido ("Bad control character in string literal") e derrubavam a geração
 * inteira. Como é uma resposta amostrada (temperature > 0), isso acontece de
 * forma intermitente: o mesmo build funciona em uma chamada e falha na
 * seguinte. Recuperar aqui é mais barato que perder o plano já gerado.
 */
function escapeControlCharsInStrings(text: string): string {
    let out = "";
    let inString = false;
    let escaped = false;

    for (const char of text) {
        if (escaped) {
            out += char;
            escaped = false;
            continue;
        }

        if (char === "\\") {
            out += char;
            escaped = inString;
            continue;
        }

        if (char === '"') {
            inString = !inString;
            out += char;
            continue;
        }

        if (inString && char < " ") {
            // JSON.stringify já escreve o controle na forma que o JSON aceita
            // ("\n", "\u0001", ...); as aspas que ele acrescenta saem fora
            out += JSON.stringify(char).slice(1, -1);
            continue;
        }

        out += char;
    }

    return out;
}

function parseLessonPlanContent(text: string): LessonPlanContent {
    const candidate = extractJson(text);

    let parsed: unknown;
    try {
        parsed = JSON.parse(candidate);
    } catch {
        try {
            parsed = JSON.parse(escapeControlCharsInStrings(candidate));
        } catch {
            // sem a resposta bruta no console não dá para saber o que a IA devolveu
            console.error("Resposta da IA não parseável:", text);
            throw new Error("A resposta da IA não é um JSON válido.");
        }
    }

    // mesmo guard que valida o JSONB na leitura (src/types/gemini.ts)
    if (!isLessonPlanContent(parsed)) {
        console.error("Resposta da IA em formato inesperado:", parsed);
        throw new Error("A resposta da IA veio em um formato inesperado.");
    }

    return parsed;
}

// fluxo completo: campos validados -> edge function (monta o prompt) ->
// extração/validação do JSON
export const generateLessonPlanContent = async (
    params: LessonPlanRequest
): Promise<LessonPlanContent> => {
    const responseText = await askGemini(normalizeRequest(params));
    return parseLessonPlanContent(responseText);
};
