import { useState } from "react";
import type { RegisterHook } from "../types/auth.ts";
import { useAuth } from "./useAuth.ts";
import { getAuthErrorMessage } from "../authErrorHandler.ts";

export function useRegister(): RegisterHook {
    const { supabase } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const passwordsMatch =
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword;

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        if (!passwordsMatch) {
            setMessage("As senhas não coincidem.");
            setIsSuccess(false);
            return;
        }

        setLoading(true);
        setMessage(null);
        setIsSuccess(false);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });

        if (error) {
            setMessage(getAuthErrorMessage(error));
        } else {
            setMessage("Conta criada!");
            setIsSuccess(true);
        }

        setLoading(false);
    }

    return {
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
    };
}
