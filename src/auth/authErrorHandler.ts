import { AuthError } from "@supabase/supabase-js";

export const ERROR_MESSAGES: Record<string, string> = {
    "400": "Email ou senha incorretos.",
    "email_not_confirmed": "Por favor, confirme seu email antes de entrar.",
    "user_not_found": "Usuário não encontrado.",
    "invalid_grant": "Credenciais inválidas.",
    "weak_password": "A senha deve ter pelo menos 6 caracteres.",
    "password_exists": "Usuário já existe com esse email.",
    "429": "Muitas solicitações. Tente novamente mais tarde.",
    "500": "Erro interno do servidor. Tente novamente em alguns instantes.",
    "network_error": "Erro de conexão. Verifique sua internet.",
    "default": "Ocorreu um erro inesperado. Tente novamente.",
};

export function getAuthErrorMessage(error: AuthError | null): string {
    if (!error) return "";

    // Tenta pelo código (status)
    if (error.status && ERROR_MESSAGES[error.status.toString()]) {
        return ERROR_MESSAGES[error.status.toString()];
    }

    // Tenta pela mensagem ou código interno do erro
    const message = error.message.toLowerCase();

    if (message.includes("invalid login credentials")) return ERROR_MESSAGES["400"];
    if (message.includes("email not confirmed")) return ERROR_MESSAGES["email_not_confirmed"];
    if (message.includes("password") && message.includes("6")) return ERROR_MESSAGES["weak_password"];
    if (message.includes("already registered") || message.includes("user already exists")) return ERROR_MESSAGES["password_exists"];
    if (message.includes("rate limit")) return ERROR_MESSAGES["429"];
    if (message.includes("network error") || message.includes("fetch")) return ERROR_MESSAGES["network_error"];

    return error.message || ERROR_MESSAGES["default"];
}
