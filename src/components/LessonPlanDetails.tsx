import { RUBRICA_NIVEIS, type LessonPlanContent, type RubricaNivel } from "../types/gemini";

// apresentação de cada nível da rubrica (a ordem canônica vem de RUBRICA_NIVEIS)
const RUBRICA_STYLES: Record<RubricaNivel, string> = {
    "Em Desenvolvimento": "bg-red-500/10 border-red-500/20 text-red-400",
    "Bom": "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    "Excelente": "bg-green-500/10 border-green-500/20 text-green-400",
};

interface LessonPlanDetailsProps {
    // não-nulo por contrato: quem renderiza já tratou o conteúdo indisponível
    content: LessonPlanContent;
}

export function LessonPlanDetails({ content }: LessonPlanDetailsProps) {
    const secoes = [
        { titulo: "Introdução Lúdica", texto: content.introducao_ludica },
        { titulo: "Objetivo (BNCC)", texto: content.objetivo_bncc },
        { titulo: "Passo a Passo", texto: content.passo_a_passo, preservaQuebras: true },
    ];

    return (
        <div className="space-y-4 border-t border-border bg-background p-6">
            {secoes.map((secao) => (
                <div key={secao.titulo}>
                    <h4 className="font-bold text-primary">{secao.titulo}</h4>
                    <p
                        className={`text-muted-foreground ${
                            secao.preservaQuebras ? "whitespace-pre-wrap" : ""
                        }`}
                    >
                        {secao.texto}
                    </p>
                </div>
            ))}

            <div>
                <h4 className="font-bold text-primary">Avaliação (Rubrica)</h4>

                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {RUBRICA_NIVEIS.map((nivel) => (
                        <div
                            key={nivel}
                            className={`rounded-lg border p-3 ${RUBRICA_STYLES[nivel]}`}
                        >
                            <span className="text-xs font-bold uppercase">{nivel}</span>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {content.rubrica_avaliacao[nivel]}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
