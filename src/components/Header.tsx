import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth.ts";
import { motion, AnimatePresence } from "motion/react";

type HeaderVariant = "public" | "private";

interface HeaderProps {
    variant?: HeaderVariant;
}

export function Header({ variant = "public" }: HeaderProps) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { signOut, profileName } = useAuth();

    return (
        <>
            {/* ===== HEADER ===== */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    {/* Logo */}
                    <div className="flex hover:cursor-default items-center gap-3">
                        <img src="/icon.png" alt="Logo" className="ml-5 h-9 w-auto" />
                        <h1 className="hidden text-2xl font-bold text-primary sm:block">
                            LessonPlans IA
                        </h1>
                    </div>

                    {/* ===== PUBLIC HEADER ===== */}
                    {variant === "public" && (
                        <>
                            <nav className="hidden items-center gap-4 md:flex">
                                <a
                                    href="#features"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Funcionalidades
                                </a>
                                <a
                                    href="#about"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Sobre
                                </a>

                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/login")}
                                    className="inline-flex items-center px-3 py2 text-sm font-medium"
                                >
                                    Entrar
                                </Button>

                                <Button
                                    onClick={() => navigate("/register")}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium"
                                >
                                    Começar Agora
                                </Button>
                            </nav>

                            {/* Mobile menu button */}
                            <motion.button
                                className="rounded-md p-2 md:hidden"
                                onClick={() => setIsMenuOpen(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Menu />
                            </motion.button>
                        </>
                    )}

                    {/* ===== PRIVATE HEADER ===== */}
                    {variant === "private" && (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                Olá,{" "}
                                <strong className="text-foreground">
                                    {profileName}
                                </strong>
                            </span>

                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={signOut}
                            >
                                Sair
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* ===== OVERLAY ===== */}
            <AnimatePresence>
                {variant === "public" && isMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/40"
                        onClick={() => setIsMenuOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                )}
            </AnimatePresence>

            {/* ===== MOBILE MENU ===== */}
            <AnimatePresence>
                {variant === "public" && isMenuOpen && (
                    <motion.div
                        className="
                            fixed top-16 right-4 z-50 w-64
                            rounded-xl border border-border
                            bg-background shadow-lg
                        "
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{
                            type: "spring",
                            visualDuration: 0.35,
                            bounce: 0.2,
                        }}
                    >
                        <div className="flex justify-end p-3">
                            <motion.button
                                onClick={() => setIsMenuOpen(false)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="rounded-md p-1"
                            >
                            </motion.button>
                        </div>

                        <nav className="flex flex-col items-center gap-4 px-6 pb-6 text-center">
                            <a
                                href="#features"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-base transition-colors hover:text-primary"
                            >
                                Funcionalidades
                            </a>

                            <a
                                href="#about"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-base transition-colors hover:text-primary"
                            >
                                Sobre
                            </a>

                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    navigate("/login");
                                }}
                            >
                                Entrar
                            </Button>

                            <Button
                                className="w-full text-primary bg-background"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    navigate("/register");
                                }}
                            >
                                Começar Agora
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
