import {useAuth} from "../auth/hooks/useAuth";
import {useLessonPlans} from "../hooks/useLessonPlans";
import {useGenerateLessonPlan} from "../hooks/useGenerateLessonPlan";
import {LESSON_PLAN_FIELD_MAX_LENGTH} from "../types/gemini";
import {useState} from "react";
import {Header} from "../components/Header.tsx";
import {LessonPlanCard} from "../components/LessonPlanCard";
import {Button} from "@/components/ui/button";

export default function Dashboard() {
    const {user} = useAuth();
    const [isPlansOpen, setIsPlansOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    const {
        plans,
        fetching,
        error: plansError,
        refetch,
        addPlan,
        deletePlan,
        renamePlan,
    } = useLessonPlans(user?.id);

    const {
        topic,
        gradeLevel,
        subject,
        setTopic,
        setGradeLevel,
        setSubject,
        loading,
        error,
        generatePlan,
    } = useGenerateLessonPlan({userId: user?.id, onGenerated: addPlan});

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header variant="private"/>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Form Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="mb-6 text-xl font-bold">Novo Plano de Aula</h2>

                            <form onSubmit={generatePlan} className="space-y-4">
                                {[
                                    {
                                        label: "Tema da Aula",
                                        value: topic,
                                        setter: setTopic,
                                        placeholder: "Ex: Sistema Solar",
                                    },
                                    {
                                        label: "Ano Escolar",
                                        value: gradeLevel,
                                        setter: setGradeLevel,
                                        placeholder: "Ex: 5º ano Fundamental",
                                    },
                                    {
                                        label: "Disciplina",
                                        value: subject,
                                        setter: setSubject,
                                        placeholder: "Ex: Ciências",
                                    },
                                ].map((field) => (
                                    <div key={field.label}>
                                        <label className="mb-1 block text-sm font-medium text-muted-foreground">
                                            {field.label}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={LESSON_PLAN_FIELD_MAX_LENGTH}
                                            value={field.value}
                                            onChange={(e) => field.setter(e.target.value)}
                                            placeholder={field.placeholder}
                                            className="
                        w-full rounded-lg px-4 py-2
                        bg-input text-foreground
                        border border-border
                        focus:outline-none focus:ring-2 focus:ring-ring
                        placeholder:text-muted-foreground
                      "
                                        />
                                    </div>
                                ))}

                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? "Gerando plano personalizado..." : "Gerar Plano de Aula"}
                                </Button>

                                {error && (
                                    <p className="text-sm text-center text-destructive">
                                        {error}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* List Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <h2 className="text-2xl font-bold">Meus Planos</h2>

                            <Button
                                variant="secondary"
                                onClick={() => setIsPlansOpen(!isPlansOpen)}
                                className="md:hidden"
                            >
                                {isPlansOpen ? "Ocultar Lista" : "Ver Meus Planos"}
                            </Button>
                        </div>

                        <div className={`${isPlansOpen ? "block" : "hidden"} md:block`}>
                            {fetching ? (
                                <p className="py-12 text-center text-muted-foreground">
                                    Carregando seus planos...
                                </p>
                            ) : plansError ? (
                                /* o erro vem antes do vazio de propósito: tratado
                                   depois, uma falha de leitura apareceria como
                                   "você não tem planos" e o professor pensaria
                                   que perdeu o conteúdo */
                                <div
                                    role="alert"
                                    className="rounded-xl border border-destructive/30 bg-destructive/10 p-12 text-center"
                                >
                                    <p className="text-sm text-destructive">{plansError}</p>

                                    <Button
                                        variant="secondary"
                                        className="mt-4"
                                        onClick={refetch}
                                    >
                                        Tentar novamente
                                    </Button>
                                </div>
                            ) : plans.length === 0 ? (
                                <div
                                    className="rounded-xl border-2 border-dashed border-border bg-card p-12 text-center text-muted-foreground">
                                    Você ainda não gerou nenhum plano de aula.
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {plans.map((plan) => (
                                        <LessonPlanCard
                                            key={plan.id}
                                            plan={plan}
                                            isExpanded={selectedPlanId === plan.id}
                                            onToggle={() =>
                                                setSelectedPlanId(
                                                    selectedPlanId === plan.id ? null : plan.id
                                                )
                                            }
                                            onRename={renamePlan}
                                            onDelete={(id) => {
                                                deletePlan(id);
                                                if (selectedPlanId === id) setSelectedPlanId(null);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
