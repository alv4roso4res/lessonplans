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

        const tema = topic.trim();
        const anoEscolar = gradeLevel.trim();
        const disciplina = subject.trim();

        if (!userId || !tema || !anoEscolar || !disciplina) return;

        setLoading(true);
        setError(null);

        try {
            const content = await generateLessonPlanContent({
                tema,
                ano_escolar: anoEscolar,
                disciplina,
            });

            const newPlan = await saveLessonPlan({
                user_id: userId,
                title: tema,
                topic: tema,
                grade_level: anoEscolar,
                subject: disciplina,
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
