-- Tabela para os Planos de Aula
CREATE TABLE lesson_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    topic TEXT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (RLS)
CREATE POLICY "Users can create their own lesson plans" 
ON lesson_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own lesson plans" 
ON lesson_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson plans" 
ON lesson_plans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson plans" 
ON lesson_plans FOR DELETE 
USING (auth.uid() = user_id);
