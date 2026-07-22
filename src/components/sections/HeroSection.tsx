import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="py-20 px-4 overflow-hidden">
            <div className="container mx-auto text-center max-w-4xl">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-primary mb-6"
                    style={{ willChange: "transform, opacity" }}
                >
                    <Sparkles className="h-3 w-3" />
                    <span>O futuro do planejamento escolar chegou</span>
                </motion.div>

                {/* Título */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                    style={{ willChange: "transform, opacity" }}
                >
                    Crie Planos de Aula{" "}
                    <span className="text-primary">Incríveis</span> em Segundos
                </motion.h1>

                {/* Parágrafo */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
                    style={{ willChange: "transform, opacity" }}
                >
                    A ferramenta definitiva para professores que desejam aliar a tecnologia
                    da IA às melhores práticas pedagógicas da BNCC.
                </motion.p>

                {/* Botões */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    style={{ willChange: "transform, opacity" }}
                >
                    <Button
                        size="lg"
                        className="text-lg px-8 h-14"
                        onClick={() => navigate("/register")}
                    >
                        Experimentar Grátis
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="text-lg px-8 h-14 hover:cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Acessar minha conta
                    </Button>
                </motion.div>

                {/* Image Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-16 relative mx-auto max-w-5xl hidden md:block"
                    style={{ willChange: "transform, opacity" }}
                >
                    <div className="aspect-video rounded-xl border border-primary/40 shadow-2xl overflow-hidden bg-muted">
                        <img
                            src="/platform.png"
                            alt="Screenshot da plataforma LessonPlans IA"
                            className="w-full h-full object-contain bg-background"
                            loading="eager"
                        />
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                </motion.div>
            </div>
        </section>
    );
}
