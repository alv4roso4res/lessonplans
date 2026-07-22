import type { Variants } from "motion/react";

/**
 * Container do formulário (stagger)
 */
export const authFormVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

/**
 * Campos e botões
 */
export const authFieldVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 12,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.25,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

/**
 * Mensagens (erro / sucesso)
 */
export const authMessageVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 6,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2 },
    },
    exit: {
        opacity: 0,
        y: 6,
        transition: { duration: 0.15 },
    },
};
