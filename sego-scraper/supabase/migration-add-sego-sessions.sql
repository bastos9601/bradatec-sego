-- Crear tabla para guardar sesiones de Sego
CREATE TABLE IF NOT EXISTS sego_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  cookies JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE sego_sessions ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver/editar sus propias sesiones
CREATE POLICY "Users can manage their own sessions"
  ON sego_sessions
  FOR ALL
  USING (auth.uid() = user_id);

-- Política: Admins pueden ver todas las sesiones
CREATE POLICY "Admins can view all sessions"
  ON sego_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol = 'admin'
    )
  );

-- Índice para búsquedas rápidas
CREATE INDEX idx_sego_sessions_user_id ON sego_sessions(user_id);
CREATE INDEX idx_sego_sessions_email ON sego_sessions(email);
