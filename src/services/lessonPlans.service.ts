import type { LessonPlan } from "../types/gemini";
import { supabase } from "./supabase";

// salvar plano de aula
export const saveLessonPlan = async (lessonPlan: Omit<LessonPlan, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
        .from('lesson_plans')
        .insert(lessonPlan)
        .select()
        .single();

    if (error) {
        console.error("Erro ao salvar plano de aula: ", error);
        throw new Error("Erro ao salvar o plano de aula no banco de dados.");
    }

    return data;
};

// buscar planos de aula
export const getUserLessonPlans = async (userId: string) => {
    const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao buscar planos de aula: ", error);
        throw new Error("Erro ao buscar planos de aula no banco de dados.");
    }

    return data as LessonPlan[];
};

// excluir plano de aula
export const deleteLessonPlan = async (id: string) => {
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
export const updateLessonPlanTitle = async (id: string, title: string) => {
    const { error } = await supabase
        .from('lesson_plans')
        .update({ title })
        .eq('id', id);

    if (error) {
        console.error("Erro ao atualizar título do plano de aula: ", error);
        throw new Error("Erro ao renomear o plano de aula.");
    }
};
