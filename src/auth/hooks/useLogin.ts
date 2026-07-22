import { useState } from "react";
import type { LoginHook } from "../types/auth.ts";
import { useAuth } from "./useAuth.ts";
import { getAuthErrorMessage } from "../authErrorHandler.ts";

export function useLogin(): LoginHook {
    const { supabase } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(getAuthErrorMessage(error));
        }

        setLoading(false);
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        message,
        handleLogin,
    };
}
