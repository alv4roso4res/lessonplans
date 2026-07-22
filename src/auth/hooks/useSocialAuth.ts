import { useState } from "react";
import { useAuth } from "./useAuth";

export function useSocialAuth() {
    const { supabase } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });

        if (error) {
            console.error(error);
            setError("Erro ao autenticar com Google");
            setLoading(false);
        }
    };

    return {
        handleGoogleLogin,
        loading,
        error,
    };
}