import { buildLessonPlanPrompt, GEMINI_CONFIG } from "./gemini.config";
import { RUBRICA_NIVEIS } from "../types/gemini";
import type { GeminiRequest, GeminiResponse, LessonPlanContent } from "../types/gemini";
import { supabase } from "../services/supabase";
import { FunctionsHttpError } from "@supabase/supabase-js";

export const askGemini = async (payload: GeminiRequest): Promise<string> => {
    const { data, error } = await supabase.functions.invoke<GeminiResponse>(
        "gemini",
        {
            body: {
                ...payload,
                config: {
                    model: GEMINI_CONFIG.MODEL,
                },
            },
        }
    );

    if (error) {
        // a edge function devolve { error: <mensagem real da Gemini API> } em não-2xx
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

    const content = parsed as Partial<LessonPlanContent> | null;
    const rubrica = content?.rubrica_avaliacao;

    const isValid =
        !!content &&
        typeof content.introducao_ludica === "string" &&
        typeof content.objetivo_bncc === "string" &&
        typeof content.passo_a_passo === "string" &&
        !!rubrica &&
        RUBRICA_NIVEIS.every((nivel) => typeof rubrica[nivel] === "string");

    if (!isValid) {
        throw new Error("A resposta da IA veio em um formato inesperado.");
    }

    return content as LessonPlanContent;
}

// fluxo completo: prompt -> edge function -> extração/validação do JSON
export const generateLessonPlanContent = async (params: {
    tema: string;
    ano_escolar: string;
    disciplina: string;
}): Promise<LessonPlanContent> => {
    const prompt = buildLessonPlanPrompt(params);
    const responseText = await askGemini({ prompt });
    return parseLessonPlanContent(responseText);
};
