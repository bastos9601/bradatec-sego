-- Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  celular TEXT NOT NULL,
  direccion TEXT NOT NULL,
  productos JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  igv DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  moneda TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propios pedidos
CREATE POLICY "Los usuarios pueden ver sus propios pedidos"
ON pedidos
FOR SELECT
TO authenticated
USING (auth.uid() = usuario_id);

-- Política: Los usuarios pueden crear pedidos
CREATE POLICY "Los usuarios pueden crear pedidos"
ON pedidos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = usuario_id);

-- Política: Los admins pueden ver todos los pedidos
CREATE POLICY "Los admins pueden ver todos los pedidos"
ON pedidos
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM perfiles
    WHERE perfiles.id = auth.uid()
    AND perfiles.rol = 'admin'
  )
);

-- Política: Los admins pueden actualizar pedidos
CREATE POLICY "Los admins pueden actualizar pedidos"
ON pedidos
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM perfiles
    WHERE perfiles.id = auth.uid()
    AND perfiles.rol = 'admin'
  )
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_pedidos_usuario_id ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at DESC);

-- Verificar la estructura
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pedidos';
