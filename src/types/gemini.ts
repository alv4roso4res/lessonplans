export interface GeminiRequest {
    prompt: string;
    context?: string;
}

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

// ordem canônica de exibição/validação dos níveis da rubrica
export const RUBRICA_NIVEIS: RubricaNivel[] = [
    "Em Desenvolvimento",
    "Bom",
    "Excelente",
];

export interface LessonPlan {
    id: string;
    user_id: string;
    title: string;
    subject: string;
    grade_level: string;
    topic: string;
    content: LessonPlanContent;
    created_at: string;
}
