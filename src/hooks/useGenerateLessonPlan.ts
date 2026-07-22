import { useState } from "react";
import { generateLessonPlanContent } from "../gemini/gemini.service";
import { saveLessonPlan } from "../services/lessonPlans.service";
import type { LessonPlan } from "../types/gemini";

interface UseGenerateLessonPlanParams {
    userId?: string;
    onGenerated: (plan: LessonPlan) => void;
}

export function useGenerateLessonPlan({ userId, onGenerated }: UseGenerateLessonPlanParams) {
    const [topic, setTopic] = useState("");
    const [gradeLevel, setGradeLevel] = useState("");
    const [subject, setSubject] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function generatePlan(e: React.FormEvent) {
        e.preventDefault();
        if (!userId || !topic || !gradeLevel || !subject) return;

        setLoading(true);
        setError(null);

        try {
            const content = await generateLessonPlanContent({
                tema: topic,
                ano_escolar: gradeLevel,
                disciplina: subject,
            });

            const newPlan = await saveLessonPlan({
                user_id: userId,
                title: topic,
                topic,
                grade_level: gradeLevel,
                subject,
                content,
            });

            onGenerated(newPlan);
            setTopic("");
            setGradeLevel("");
            setSubject("");
        } catch (err) {
            console.error("Erro ao gerar plano: ", err);
            setError("Erro ao gerar plano de aula. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return {
        topic,
        gradeLevel,
        subject,
        setTopic,
        setGradeLevel,
        setSubject,
        loading,
        error,
        generatePlan,
    };
}
