import { BookOpen, Sparkles, Clock } from "lucide-react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";

const features = [
    {
        icon: Sparkles,
        title: "IA Especializada",
        description:
            "Planos de aula gerados por inteligência artificial treinada com as diretrizes da BNCC.",
    },
    {
        icon: Clock,
        title: "Economize Tempo",
        description:
            "Transforme horas de planejamento em poucos segundos. Foque no que importa: seus alunos.",
    },
    {
        icon: BookOpen,
        title: "Metodologias Ativas",
        description:
            "Sugestões de introduções lúdicas e atividades práticas que engajam de verdade.",
    },
];

export default function FeaturesSection() {
    const [ref, inView] = useInView({
        triggerOnce: true, // anima apenas na primeira vez
        threshold: 0.2,    // 20% da seção visível
    });

    return (
        <section id="features" ref={ref} className="py-24 bg-muted/30 px-4">
            <div className="container mx-auto">
                {/* Título e descrição da seção */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold mb-4">Tudo o que você precisa</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Desenvolvido por quem entende a rotina da sala de aula e os desafios
                        do professor moderno.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map(({ icon: Icon, title, description }, index) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 + index * 0.15 }}
                            className="bg-background p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors group"
                        >
                            <div className="mb-4 p-3 bg-primary/5 rounded-lg w-fit group-hover:bg-primary/10 transition-colors">
                                <Icon className="h-6 w-6 text-primary" />
                            </div>

                            <h3 className="text-xl font-bold mb-2">{title}</h3>

                            <p className="text-muted-foreground leading-relaxed">
                                {description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
