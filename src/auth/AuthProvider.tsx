import { useEffect, useState } from "react";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";
import type {AuthProviderProps} from "./types/auth.ts";

export function AuthProvider({ supabase, children }: AuthProviderProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session) => {
                setSession(session);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    return (
        <AuthContext.Provider
            value={{
                supabase,
                session,
                user: session?.user ?? null,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
