import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuthLayout } from "../components/AuthLayout";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRegister } from "../auth/hooks/useRegister";
import { useAuth } from "../auth/hooks/useAuth";
import {
    authFormVariants,
    authFieldVariants,
    authMessageVariants,
} from "./auth.animations";
import {Button} from "../components/ui/button.tsx";
import {GoogleButton} from "../components/GoogleButton.tsx";

export default function Register() {
    const {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        passwordsMatch,
        loading,
        message,
        isSuccess,
        handleRegister,
    } = useRegister();

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);

    return (
        <AuthLayout title="Criar conta">
            <motion.form
                onSubmit={handleRegister}
                className="space-y-4"
                variants={authFormVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Nome */}
                <motion.div variants={authFieldVariants}>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Nome
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full rounded-lg px-4 py-2 bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </motion.div>

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
                            className="absolute right-3 top-1/2 hover:cursor-pointer -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

                {/* Confirmar senha */}
                <motion.div variants={authFieldVariants}>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Confirmar senha
                    </label>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            className={`w-full rounded-lg px-4 py-2 pr-10 bg-input text-foreground border focus:outline-none focus:ring-2 focus:ring-ring ${
                                confirmPassword.length > 0 && !passwordsMatch
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="Repita a senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute right-3 hover:cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={
                                showConfirmPassword
                                    ? "Ocultar confirmação de senha"
                                    : "Mostrar confirmação de senha"
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Botão */}
                <motion.div variants={authFieldVariants}>
                    <Button
                        type="submit"
                        disabled={loading || !passwordsMatch}
                        className="w-full"
                    >
                        {loading ? "Criando..." : "Criar conta"}
                    </Button>
                </motion.div>

                {/* Mensagem */}
                <AnimatePresence mode="wait">
                    {message && (
                        <motion.p
                            key="auth-message"
                            className={`text-sm text-center mt-2 ${
                                isSuccess ? "text-primary" : "text-destructive"
                            }`}
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
                    <GoogleButton label="Cadastrar com Google" />
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
                    Já tem uma conta?{" "}
                    <Link
                        to="/login"
                        className="text-primary hover:underline font-medium"
                    >
                        Entrar
                    </Link>
                </motion.p>
            </motion.form>
        </AuthLayout>
    );
}
