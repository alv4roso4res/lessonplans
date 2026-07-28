import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
        // PKCE evita que o OAuth devolva os tokens no fragmento da URL
        // (#access_token=...), onde ficariam no histórico do navegador
        auth: { flowType: "pkce" },
    }
);
