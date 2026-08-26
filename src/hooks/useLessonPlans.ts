import { useEffect, useState } from "react";
import {
    deleteLessonPlan,
    getUserLessonPlans,
    updateLessonPlanTitle,
} from "../services/lessonPlans.service";
import type { LessonPlan } from "../types/gemini";

export function useLessonPlans(userId?: string) {
    const [plans, setPlans] = useState<LessonPlan[]>([]);
    // sem usuário não há o que buscar: já nasce fora do carregando, em vez de
    // deixar a lista presa no "Carregando seus planos..." para sempre.
    // Quem garante que userId existe já na primeira renderização é o
    // ProtectedRoute, que só monta o Dashboard com a sessão resolvida. Se o
    // Dashboard for montado fora do guard, o professor verá o estado vazio
    // antes de a sessão chegar — exatamente a mentira que evitamos aqui.
    const [fetching, setFetching] = useState(Boolean(userId));
    const [error, setError] = useState<string | null>(null);
    // incrementar força o efeito a rodar de novo sem depender de outra mudança
    const [reloadToken, setReloadToken] = useState(0);

    // identifica a busca vigente: muda quando o usuário troca ou quando o
    // professor pede para tentar de novo.
    // CUIDADO: o que entrar nesta chave tem que entrar também nas deps do
    // efeito abaixo. Se divergirem, o ajuste liga `fetching` e o efeito nunca
    // roda — a lista trava em "Carregando..." sem erro, e o exhaustive-deps
    // não pega isso.
    const requestKey = `${userId ?? ""}:${reloadToken}`;
    const [activeKey, setActiveKey] = useState(requestKey);

    // ajuste durante a renderização, e não dentro do efeito: zerar o estado
    // anterior num efeito dispara uma renderização em cascata, e o resultado
    // antigo apareceria por um instante como se fosse do usuário novo
    if (activeKey !== requestKey) {
        setActiveKey(requestKey);
        setPlans([]);
        setError(null);
        setFetching(Boolean(userId));
    }

    useEffect(() => {
        if (!userId) return;

        let cancelled = false;

        getUserLessonPlans(userId)
            .then((data) => {
                if (!cancelled) setPlans(data);
            })
            .catch((err) => {
                // depois do check: buscas descartadas não precisam poluir o
                // console (o StrictMode duplicaria cada falha em dev)
                if (cancelled) return;
                console.error(err);

                // sem isso a falha viraria estado vazio, dizendo ao professor
                // que ele não tem planos quando na verdade não conseguimos ler
                setPlans([]);
                setError("Não conseguimos carregar seus planos.");
            })
            .finally(() => {
                if (!cancelled) setFetching(false);
            });

        return () => {
            cancelled = true;
        };
    }, [userId, reloadToken]);

    function refetch() {
        setReloadToken((token) => token + 1);
    }

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
        error,
        refetch,
        addPlan,
        deletePlan,
        renamePlan,
    };
}
