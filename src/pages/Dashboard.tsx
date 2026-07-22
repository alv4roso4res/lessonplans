import {useAuth} from "../auth/hooks/useAuth";
import {useLessonPlans} from "../hooks/useLessonPlans";
import {useGenerateLessonPlan} from "../hooks/useGenerateLessonPlan";
import {RUBRICA_NIVEIS, type RubricaNivel} from "../types/gemini";
import {useState} from "react";
import {Header} from "../components/Header.tsx";
import { Pencil, Trash2 } from "lucide-react";
import {Button} from "@/components/ui/button";

// apresentação de cada nível da rubrica (a ordem canônica vem de RUBRICA_NIVEIS)
const RUBRICA_STYLES: Record<RubricaNivel, string> = {
    "Em Desenvolvimento": "bg-red-500/10 border-red-500/20 text-red-400",
    "Bom": "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    "Excelente": "bg-green-500/10 border-green-500/20 text-green-400",
};

export default function Dashboard() {
    const {user} = useAuth();
    const [isPlansOpen, setIsPlansOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    const {
        plans,
        fetching,
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
                            ) : plans.length === 0 ? (
                                <div
                                    className="rounded-xl border-2 border-dashed border-border bg-card p-12 text-center text-muted-foreground">
                                    Você ainda não gerou nenhum plano de aula.
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                                        >
                                            <div className="flex items-center justify-between gap-4 p-4">
                                                <button
                                                    onClick={() =>
                                                        setSelectedPlanId(
                                                            selectedPlanId === plan.id ? null : plan.id
                                                        )
                                                    }
                                                    className="flex-1 text-left"
                                                >
                                                    <h3 className="font-bold hover:cursor-pointer hover:text-primary transition-colors">
                                                        {plan.title}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        {plan.subject} • {plan.grade_level}
                                                    </p>
                                                </button>

                                                <div className="flex gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newTitle = prompt(
                                                                "Novo título do plano:",
                                                                plan.title
                                                            );
                                                            if (newTitle && newTitle !== plan.title) {
                                                                renamePlan(plan.id, newTitle);
                                                            }
                                                        }}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (
                                                                confirm(
                                                                    "Deseja realmente excluir este plano?"
                                                                )
                                                            ) {
                                                                deletePlan(plan.id);
                                                                if (selectedPlanId === plan.id)
                                                                    setSelectedPlanId(null);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {selectedPlanId === plan.id && (
                                                <div className="space-y-4 border-t border-border bg-background p-6">
                                                    {[
                                                        {
                                                            title: "Introdução Lúdica",
                                                            content: plan.content.introducao_ludica,
                                                        },
                                                        {
                                                            title: "Objetivo (BNCC)",
                                                            content: plan.content.objetivo_bncc,
                                                        },
                                                        {
                                                            title: "Passo a Passo",
                                                            content: plan.content.passo_a_passo,
                                                            pre: true,
                                                        },
                                                    ].map((section) => (
                                                        <div key={section.title}>
                                                            <h4 className="font-bold text-primary">
                                                                {section.title}
                                                            </h4>
                                                            <p
                                                                className={`text-muted-foreground ${
                                                                    section.pre ? "whitespace-pre-wrap" : ""
                                                                }`}
                                                            >
                                                                {section.content}
                                                            </p>
                                                        </div>
                                                    ))}

                                                    {/* Rubrica */}
                                                    <div>
                                                        <h4 className="font-bold text-primary">Avaliação (Rubrica)</h4>

                                                        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                                                            {RUBRICA_NIVEIS.map((key) => (
                                                                <div
                                                                    key={key}
                                                                    className={`rounded-lg border p-3 ${RUBRICA_STYLES[key]}`}
                                                                >
                <span className="text-xs font-bold uppercase">
                    {key}
                </span>

                                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                                        {plan.content.rubrica_avaliacao[key]}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
