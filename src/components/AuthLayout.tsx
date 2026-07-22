import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background px-4">
            {/* Card */}
            <motion.div
                className="
                    relative
                    w-full max-w-md space-y-8
                    rounded-xl border border-border
                    bg-card p-8 shadow-lg
                "
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    type: "spring",
                    visualDuration: 0.45,
                    bounce: 0.2,
                }}
            >
                {/* Header */}
                <div className="relative flex items-center justify-center">
                    {/* Seta */}
                    <motion.div
                        className="absolute left-0"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.25, ease: "easeOut" }}
                    >
                        <Link
                            to="/"
                            className="
                                inline-flex items-center justify-center
                                rounded-md p-2
                                text-muted-foreground
                                transition-colors
                                hover:bg-muted hover:text-foreground
                            "
                            aria-label="Voltar para a home"
                        >
                            <motion.div
                                whileHover={{ x: -2 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </motion.div>
                        </Link>
                    </motion.div>

                    {/* Título */}
                    <motion.h2
                        className="text-3xl font-bold text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                    >
                        {title}
                    </motion.h2>
                </div>

                {/* Conteúdo (Login / Register) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </div>
    );
}
