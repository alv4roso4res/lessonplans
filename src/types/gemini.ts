// o prompt é montado dentro da edge function; o cliente só envia estes campos
export interface LessonPlanRequest {
    tema: string;
    ano_escolar: string;
    disciplina: string;
}

// mesmo limite validado na edge function (supabase/functions/gemini/index.ts)
export const LESSON_PLAN_FIELD_MAX_LENGTH = 120;

export interface GeminiResponse {
    text: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface LessonPlanContent {
    introducao_ludica: string;
    objetivo_bncc: string;
    passo_a_passo: string;
    rubrica_avaliacao: Record<RubricaNivel, string>;
}

export type RubricaNivel =
    | "Em Desenvolvimento"
    | "Bom"
    | "Excelente";

// ordem canônica de exibição dos níveis da rubrica — e, desde que
// isLessonPlanContent passou a depender dela, também a definição do que conta
// como rubrica válida. Por isso é readonly: ninguém deve dar push aqui.
export const RUBRICA_NIVEIS = [
    "Em Desenvolvimento",
    "Bom",
    "Excelente",
] as const satisfies readonly RubricaNivel[];

// fonte única de verdade do shape de `content`, usada nos dois sentidos:
// na escrita (resposta da IA, em gemini.service) e na leitura (JSONB vindo do
// banco, em lessonPlans.service). Uma linha gravada por uma versão anterior do
// prompt não pode derrubar o render.
export function isLessonPlanContent(value: unknown): value is LessonPlanContent {
    if (!value || typeof value !== "object") return false;

    const content = value as Partial<LessonPlanContent>;
    const rubrica = content.rubrica_avaliacao;

    return (
        typeof content.introducao_ludica === "string" &&
        typeof content.objetivo_bncc === "string" &&
        typeof content.passo_a_passo === "string" &&
        !!rubrica &&
        typeof rubrica === "object" &&
        RUBRICA_NIVEIS.every((nivel) => typeof rubrica[nivel] === "string")
    );
}

export interface LessonPlan {
    id: string;
    user_id: string;
    title: string;
    subject: string;
    grade_level: string;
    topic: string;
    // null quando o JSONB salvo não bate com LessonPlanContent. A linha é
    // preservada de propósito: o professor vê o plano na lista e uma mensagem
    // ao abri-lo, em vez de o plano sumir sem explicação.
    //
    // ATENÇÃO ao paginar: hoje `content` sempre vem, porque getUserLessonPlans
    // usa select('*'). Se a listagem passar a selecionar colunas explícitas sem
    // `content`, ele virá `undefined` e toLessonPlan mapeará tudo para null —
    // "não carregado" apareceria como "corrompido" em todos os planos. Nesse
    // dia, separe um tipo de resumo em vez de reaproveitar este.
    content: LessonPlanContent | null;
    created_at: string;
}

// o que o cliente insere: aqui `content` já passou pela validação da IA
export type NewLessonPlan = Omit<LessonPlan, "id" | "created_at" | "content"> & {
    content: LessonPlanContent;
};
