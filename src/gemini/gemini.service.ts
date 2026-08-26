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

// remove cercas de markdown (```json ... ```) que o modelo pode incluir
function extractJson(text: string): string {
    return text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
}

function parseLessonPlanContent(text: string): LessonPlanContent {
    let parsed: unknown;
    try {
        parsed = JSON.parse(extractJson(text));
    } catch {
        throw new Error("A resposta da IA não é um JSON válido.");
    }

    // mesmo guard que valida o JSONB na leitura (src/types/gemini.ts)
    if (!isLessonPlanContent(parsed)) {
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
