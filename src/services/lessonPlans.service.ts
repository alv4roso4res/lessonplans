import type { LessonPlan, NewLessonPlan } from "../types/gemini";
import { isLessonPlanContent } from "../types/gemini";
import { supabase } from "./supabase";

// o client Supabase não é gerado a partir do schema, então tudo que vem de
// `data` chega como `any`. As anotações de retorno abaixo prendem esse `any`
// aqui dentro, em vez de deixá-lo vazar destipado para hooks e componentes.

// `content` é JSONB: o banco não garante o shape. Toda linha passa por aqui
// antes de virar LessonPlan, e um `content` fora de forma vira null em vez de
// explodir no render (Dashboard trata o null).
function toLessonPlan(row: Record<string, unknown>): LessonPlan {
    const content = row.content;
    const isValid = isLessonPlanContent(content);

    if (!isValid) {
        console.warn("Plano com conteúdo fora do formato esperado: ", row.id);
    }

    return {
        // as colunas escalares são NOT NULL no schema (supabase_schema.sql),
        // então esta asserção está lastreada por constraint de banco; só o
        // `content` (JSONB, sem shape garantido) passa pelo guard acima
        ...(row as Omit<LessonPlan, "content">),
        content: isValid ? content : null,
    };
}

// salvar plano de aula
export const saveLessonPlan = async (
    lessonPlan: NewLessonPlan
): Promise<LessonPlan> => {
    const { data, error } = await supabase
        .from('lesson_plans')
        .insert(lessonPlan)
        .select()
        .single();

    if (error || !data) {
        console.error("Erro ao salvar plano de aula: ", error);
        throw new Error("Erro ao salvar o plano de aula no banco de dados.");
    }

    // `content` acabou de passar pelo guard em parseLessonPlanContent, então
    // reaproveitamos o valor validado. Sem isso, um round-trip do JSONB que
    // devolvesse algo inesperado faria o professor receber um card degradado
    // logo após gerar o plano com sucesso.
    return { ...toLessonPlan(data as Record<string, unknown>), content: lessonPlan.content };
};

// buscar planos de aula
export const getUserLessonPlans = async (userId: string): Promise<LessonPlan[]> => {
    const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao buscar planos de aula: ", error);
        throw new Error("Erro ao buscar planos de aula no banco de dados.");
    }

    // `data` é `any`: sem o cast explícito, o TypeScript nem verifica que
    // toLessonPlan serve como callback deste .map
    const rows = (data ?? []) as Record<string, unknown>[];
    return rows.map((row) => toLessonPlan(row));
};

// excluir plano de aula
export const deleteLessonPlan = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Erro ao excluir plano de aula: ", error);
        throw new Error("Erro ao excluir o plano de aula.");
    }
};

// atualizar titulo.
export const updateLessonPlanTitle = async (id: string, title: string): Promise<void> => {
    const { error } = await supabase
        .from('lesson_plans')
        .update({ title })
        .eq('id', id);

    if (error) {
        console.error("Erro ao atualizar título do plano de aula: ", error);
        throw new Error("Erro ao renomear o plano de aula.");
    }
};
