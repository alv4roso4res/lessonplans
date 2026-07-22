# LessonPlansIA - Gerador de Planos de Aula com IA

O **LessonPlansIA** é uma plataforma moderna desenvolvida para auxiliar educadores na criação de planos de aula estruturados e alinhados à BNCC (Base Nacional Comum Curricular), utilizando o poder da inteligência artificial do Google Gemini.

---

## Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Backend as a Service:** [Supabase](https://supabase.com/) (Auth & PostgreSQL)
- **Inteligência Artificial:** [Google Gemini 2.5 Flash](https://aistudio.google.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Componentes:** [Radix UI](https://www.radix-ui.com/)

---

## Principais Funcionalidades

- **Autenticação Robusta:** Sistema completo de login e cadastro gerenciado pelo Supabase Auth.
- **Geração Inteligente:** Criação de planos de aula personalizados por tema, ano escolar e disciplina.
- **Alinhamento BNCC:** Os planos gerados incluem objetivos específicos baseados na BNCC.
- **Persistência em Nuvem:** Todos os seus planos são salvos automaticamente e podem ser acessados de qualquer lugar.
- **Gestão de Planos:** Visualize detalhes (introdução, passo a passo, rubricas de avaliação) ou exclua planos antigos.
- **Design Responsivo:** Interface moderna, limpa e totalmente adaptável a diferentes tamanhos de tela.

---

## Configuração do Ambiente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Conta no [Supabase](https://supabase.com/)
- API Key do [Google AI Studio (Gemini)](https://aistudio.google.com/)

### 1. Clonar e Instalar
```bash
git clone https://github.com/1alvaropaiva/planosdeaula.git
cd lessonplans
npm install
```

### 2. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e preencha com suas credenciais:
```env
VITE_SUPABASE_URL=seu_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### 3. Banco de Dados
Execute o script contido em `supabase_schema.sql` no Editor SQL do seu projeto Supabase para criar a estrutura de tabelas e as políticas de segurança (RLS).

---

## Como Executar

- **Desenvolvimento:**
  ```bash
  npm run dev
  ```
- **Build de Produção:**
  ```bash
  npm run build
  ```
- **Preview do Build:**
  ```bash
  npm run preview
  ```

---

## Fluxo Principal da Aplicação

1.  **Autenticação:** O sistema utiliza o `Supabase Auth` para gerenciar a sessão. Ao iniciar, a aplicação verifica a existência de uma sessão ativa e monitora mudanças de estado (`onAuthStateChange`) para alternar entre as rotas de login e o dashboard protegido.
2.  **Entrada de Dados:** No Dashboard, o usuário preenche um formulário com o tema, ano escolar e disciplina desejada.
3.  **Processamento com IA:** A lógica do dashboard constrói um prompt estruturado e invoca o serviço do `Google Gemini`.
4.  **Tratamento de Resposta:** O serviço da IA é instruído a responder estritamente em JSON. A aplicação realiza a limpeza de markdown (code fences) e o parse dos dados.
5.  **Persistência:** O plano gerado é enviado ao `planos.service.ts`, que o armazena no PostgreSQL do Supabase, vinculado ao `user_id` do educador.
6.  **Gerenciamento:** Os planos salvos são listados de forma reativa, permitindo a visualização detalhada de cada item ou sua exclusão definitiva.

---

## Principais Abordagens

-   **Segurança e Ambiente:** Uso de variáveis de ambiente via Vite para proteger chaves de API, garantindo que segredos não sejam expostos no código-fonte.
-   **Políticas de Segurança (RLS):** Integração direta com Row Level Security do Supabase, garantindo que cada usuário acesse e gerencie estritamente apenas seus próprios planos de aula.
-   **Engenharia de Prompt:** Instruções otimizadas para o Gemini garantir respostas estruturadas e alinhadas às competências da BNCC.
-   **UX Reativa:** Interface que reage instantaneamente a eventos de autenticação e estados de carregamento, fornecendo feedback visual claro (loading states, Empty states e tratamento de erros).
-   **Modularização:** Separação clara de responsabilidades entre serviços de IA, persistência de dados e lógica de autenticação.

---

## Edge Function

A edge function que faz a chamada na Gemini API — mantendo a chave segura como variável de ambiente dentro do próprio Supabase — está versionada em [`supabase/functions/gemini/index.ts`](supabase/functions/gemini/index.ts).

Ela propaga erros da Gemini API (chave inválida, cota estourada, resposta bloqueada) como HTTP 502 com a mensagem real no corpo, em vez de devolver 200 com texto de fallback.

Para implantar:

```bash
supabase functions deploy gemini
```

Ou copie o conteúdo do arquivo no editor de Edge Functions do painel do Supabase (função `gemini`).
---

## Estrutura do Projeto

```text
src/
├── auth/          # Contextos e hooks de autenticação
├── components/    # Componentes UI (Radix) e seções da Landing Page
├── gemini/        # Configuração e serviços da API de IA
├── hooks/         # Hooks personalizados para lógica de negócio
├── lib/           # Utilitários (shadcn/tailwind-merge)
├── pages/         # Páginas da aplicação (Home, Login, Dashboard, Register)
├── services/      # Cliente do Supabase
└── types/         # Definições de tipos TypeScript
```