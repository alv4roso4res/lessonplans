import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function AboutSection() {
    const navigate = useNavigate();

    const items = [
        "Introdução lúdica para captar atenção",
        "Objetivos de aprendizagem claros",
        "Passo a passo detalhado da aula",
        "Rubrica completa para avaliação de desempenho",
    ];

    return (
        <section id="about" className="py-24 px-4 overflow-hidden">
            <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">

                {/* Imagem */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative"
                    style={{ willChange: "transform, opacity" }}
                >
                    <div className="aspect-square rounded-2xl overflow-hidden border border-border/40 bg-muted shadow-lg relative">
                        <img
                            src="/prof.jpg"
                            alt="Professor usando app"
                            className="w-full h-full object-cover"
                            loading="eager"
                            decoding="async"
                        />
                    </div>

                    {/* Glow sutil */}
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                </motion.div>

                {/* Conteúdo */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="space-y-6"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.05 } },
                    }}
                >
                    <motion.h2
                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-3xl font-bold leading-tight"
                    >
                        Planos Alinhados à BNCC com Rubricas de Avaliação
                    </motion.h2>

                    <motion.p
                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-lg text-muted-foreground"
                    >
                        Não geramos apenas textos. Entregamos uma estrutura pedagógica
                        completa que inclui:
                    </motion.p>

                    <motion.ul className="space-y-4">
                        {items.map((item) => (
                            <motion.li
                                key={item}
                                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                transition={{ duration: 0.4 }}
                                className="flex items-start gap-3"
                            >
                                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                                <span>{item}</span>
                            </motion.li>
                        ))}
                    </motion.ul>

                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.6 }}
                        className="pt-4"
                    >
                        <Button onClick={() => navigate("/register")}>
                            Criar meu primeiro plano
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
