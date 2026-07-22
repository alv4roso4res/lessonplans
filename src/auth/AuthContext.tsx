import { createContext } from "react";
import type {AuthContextData} from "./types/auth.ts";

export const AuthContext = createContext<AuthContextData | undefined>(
    undefined
);
