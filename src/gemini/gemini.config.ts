export const buildLessonPlanPrompt = ({ tema, ano_escolar, disciplina }: { tema: string; ano_escolar: string; disciplina: string; }) => {
    return `Você é um especialista em pedagogia e na BNCC. Crie um plano de aula para a disciplina "${disciplina}", destinado ao "${ano_escolar}", com o tema "${tema}". Sua resposta DEVE ser um objeto JSON, sem nenhum texto ou formatação adicional fora dele. O JSON deve ter EXATAMENTE a seguinte estrutura: {"introducao_ludica": "Uma introdução criativa e curta para o tema.", "objetivo_bncc": "Um objetivo de aprendizagem claro, incluindo o código da habilidade da BNCC (ex: EF03CI02).", "passo_a_passo": "Um roteiro detalhado da atividade em formato de texto simples. Não use asteriscos (*) e nem hashtags (#), separe os tópicos em números e pulando linhas (exemplo: 1) Inicio \n 2)Passo a passo)", "rubrica_avaliacao": {"Excelente": "Descrição para o critério 'Excelente'.", "Bom": "Descrição para o critério 'Bom'.", "Em Desenvolvimento": "Descrição para o critério 'Em Desenvolvimento'."}}`;
};

export const GEMINI_CONFIG = {
    MODEL: "gemini-2.5-flash",
};
