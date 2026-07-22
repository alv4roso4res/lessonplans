import { useContext } from "react";
import type { AppUserMetadata, AuthHook } from "../types/auth";
import {AuthContext} from "../AuthContext.tsx";

export function useAuth(): AuthHook {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
    }

    const { supabase, session, user, loading } = ctx;

    const metadata: AppUserMetadata | undefined =
        user?.user_metadata && typeof user.user_metadata === "object"
            ? (user.user_metadata as AppUserMetadata)
            : undefined;

    const profileName =
        metadata?.name ??
        user?.email ??
        "";

    async function signOut() {
        await supabase.auth.signOut();
    }

    return {
        supabase,
        session,
        user,
        loading,
        isAuthenticated: !!session,
        profileName,
        signOut,
    };
}