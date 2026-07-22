import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "@/components/ui/button";
import { useLogin } from "../auth/hooks/useLogin";
import { useAuth } from "../auth/hooks/useAuth";
import {
    authFormVariants,
    authFieldVariants,
    authMessageVariants,
} from "./auth.animations";
import { GoogleButton } from "@/components/GoogleButton";

export default function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        message,
        handleLogin,
    } = useLogin();

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);

    return (
        <AuthLayout title="Entrar">
            <motion.form
                onSubmit={handleLogin}
                className="space-y-4"
                variants={authFormVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Email */}
                <motion.div variants={authFieldVariants}>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        className="w-full rounded-lg px-4 py-2 bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </motion.div>

                {/* Senha */}
                <motion.div variants={authFieldVariants}>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Senha
                    </label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full rounded-lg px-4 py-2 pr-10 bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:cursor-pointer hover:text-foreground transition-colors"
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Botão */}
                <motion.div variants={authFieldVariants}>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </motion.div>

                {/* Mensagem de erro */}
                <AnimatePresence mode="wait">
                    {message && (
                        <motion.p
                            key="auth-error"
                            className="text-destructive text-sm text-center mt-2"
                            variants={authMessageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Google */}
                <motion.div variants={authFieldVariants}>
                    <GoogleButton label="Entrar com Google" />
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-2 my-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">ou</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                {/* Link */}
                <motion.p
                    variants={authFieldVariants}
                    className="text-sm text-muted-foreground text-center mt-2"
                >
                    Não tem uma conta?{" "}
                    <Link
                        to="/register"
                        className="text-primary hover:underline font-medium"
                    >
                        Criar conta
                    </Link>
                </motion.p>
            </motion.form>
        </AuthLayout>
    );
}
