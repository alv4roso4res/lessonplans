import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";

export default function CTASection() {
    const navigate = useNavigate();

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <section ref={ref} className="py-24 px-4 border-t border-border">
            <div className="container mx-auto max-w-5xl">
                <div className="relative rounded-3xl border border-border bg-background/60 backdrop-blur-xl p-8 md:p-16 text-center overflow-hidden shadow-lg">

                    {/* Decorative elements */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                    {/* Conteúdo animado */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="relative z-10"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Pronto para transformar suas aulas?
                        </h2>

                        <p className="text-muted-foreground mb-10 text-lg max-w-xl mx-auto">
                            Junte-se a professores que já estão usando IA para criar
                            experiências de aprendizado mais claras, rápidas e alinhadas à BNCC.
                        </p>

                        <Button
                            size="lg"
                            className="text-lg px-10 h-14"
                            onClick={() => navigate("/register")}
                        >
                            Começar gratuitamente
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
