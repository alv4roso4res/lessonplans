import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonPlanDetails } from "./LessonPlanDetails";
import type { LessonPlan } from "../types/gemini";

interface LessonPlanCardProps {
    plan: LessonPlan;
    isExpanded: boolean;
    onToggle: () => void;
    onRename: (id: string, newTitle: string) => void;
    onDelete: (id: string) => void;
}

export function LessonPlanCard({
    plan,
    isExpanded,
    onToggle,
    onRename,
    onDelete,
}: LessonPlanCardProps) {
    // desestruturar preserva o narrowing de content nos dois usos abaixo
    const { content } = plan;

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 p-4">
                <button onClick={onToggle} className="flex-1 text-left">
                    <h3 className="font-bold hover:cursor-pointer hover:text-primary transition-colors">
                        {plan.title}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                        {plan.subject} • {plan.grade_level}
                    </p>

                    {/* o card degradado precisa se anunciar antes do clique,
                        senão o professor abre esperando conteúdo */}
                    {content === null && (
                        <span className="mt-1 inline-block rounded border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-xs text-destructive">
                            Conteúdo indisponível
                        </span>
                    )}
                </button>

                <div className="flex gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                            const newTitle = prompt("Novo título do plano:", plan.title);
                            if (newTitle && newTitle !== plan.title) {
                                onRename(plan.id, newTitle);
                            }
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                            if (confirm("Deseja realmente excluir este plano?")) {
                                onDelete(plan.id);
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isExpanded &&
                (content === null ? (
                    <div className="border-t border-border bg-background p-6">
                        <p className="text-sm text-destructive">
                            Não conseguimos ler o conteúdo deste plano.
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            O aplicativo não reconhece o formato deste plano. Exclua-o e gere
                            outro com o mesmo tema.
                        </p>
                    </div>
                ) : (
                    <LessonPlanDetails content={content} />
                ))}
        </div>
    );
}
