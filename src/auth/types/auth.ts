import type { SupabaseClient, Session, User, UserMetadata } from "@supabase/supabase-js";

export interface AppUserMetadata extends UserMetadata {
    name?: string;
}

export interface AuthContextData {
    supabase: SupabaseClient;
    session: Session | null;
    user: User | null;
    loading: boolean;
}

export interface AuthProviderProps {
    supabase: SupabaseClient;
    children: React.ReactNode;
}

export interface LoginHook {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    loading: boolean;
    message: string | null;
    handleLogin: (e: React.FormEvent) => Promise<void>;
}

export interface RegisterHook {
    name: string;
    setName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (confirmPassword: string) => void;
    passwordsMatch: boolean;
    loading: boolean;
    message: string | null;
    isSuccess: boolean;
    handleRegister: (e: React.FormEvent) => Promise<void>;
}


export interface AuthHook extends AuthContextData {
    isAuthenticated: boolean;
    profileName: string;
    signOut: () => Promise<void>;
}
