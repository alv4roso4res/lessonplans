import { useEffect, useState } from "react";
import {
    deleteLessonPlan,
    getUserLessonPlans,
    updateLessonPlanTitle,
} from "../services/lessonPlans.service";
import type { LessonPlan } from "../types/gemini";

export function useLessonPlans(userId?: string) {
    const [plans, setPlans] = useState<LessonPlan[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!userId) return;

        let cancelled = false;

        getUserLessonPlans(userId)
            .then((data) => {
                if (!cancelled) setPlans(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                if (!cancelled) setFetching(false);
            });

        return () => {
            cancelled = true;
        };
    }, [userId]);

    function addPlan(plan: LessonPlan) {
        setPlans((prev) => [plan, ...prev]);
    }

    async function deletePlan(id: string) {
        try {
            await deleteLessonPlan(id);
            setPlans((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    async function renamePlan(id: string, newTitle: string) {
        try {
            await updateLessonPlanTitle(id, newTitle);
            setPlans((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, title: newTitle } : p
                )
            );
        } catch (err) {
            console.error(err);
        }
    }

    return {
        plans,
        fetching,
        addPlan,
        deletePlan,
        renamePlan,
    };
}
