-- Permitir lectura pública de productos (sin autenticación)
-- Esto permite que usuarios no autenticados vean los productos pero no los precios

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON productos;
DROP POLICY IF EXISTS "Permitir inserción solo a usuarios autenticados" ON productos;
DROP POLICY IF EXISTS "Permitir actualización solo a usuarios autenticados" ON productos;
DROP POLICY IF EXISTS "Permitir eliminación solo a usuarios autenticados" ON productos;

-- Habilitar RLS en la tabla productos
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir lectura pública (SELECT) a todos
CREATE POLICY "Permitir lectura pública de productos"
ON productos
FOR SELECT
TO public
USING (true);

-- Política 2: Permitir inserción solo a usuarios autenticados
CREATE POLICY "Permitir inserción solo a usuarios autenticados"
ON productos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política 3: Permitir actualización solo a usuarios autenticados
CREATE POLICY "Permitir actualización solo a usuarios autenticados"
ON productos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política 4: Permitir eliminación solo a usuarios autenticados
CREATE POLICY "Permitir eliminación solo a usuarios autenticados"
ON productos
FOR DELETE
TO authenticated
USING (true);

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'productos';
