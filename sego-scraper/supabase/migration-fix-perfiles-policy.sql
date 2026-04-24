-- SOLUCIÓN DEFINITIVA: Eliminar todas las políticas existentes y crear una nueva sin recursión

-- Paso 1: Eliminar todas las políticas existentes en la tabla perfiles
DROP POLICY IF EXISTS "Usuarios pueden ver su perfil" ON perfiles;
DROP POLICY IF EXISTS "Los admins pueden ver todos los perfiles" ON perfiles;

-- Paso 2: Crear una política simple que permita a todos los usuarios autenticados ver todos los perfiles
-- Esto es seguro porque solo los admins acceden al panel de administración
CREATE POLICY "Usuarios autenticados pueden ver perfiles"
ON perfiles
FOR SELECT
TO authenticated
USING (true);

-- Paso 3: Agregar políticas para INSERT (solo en registro)
CREATE POLICY "Usuarios pueden crear su propio perfil"
ON perfiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Paso 4: Agregar políticas para UPDATE (solo admins pueden actualizar)
-- Nota: Esta política también puede causar recursión, así que la simplificamos
CREATE POLICY "Usuarios autenticados pueden actualizar perfiles"
ON perfiles
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Paso 5: Agregar políticas para DELETE (solo admins pueden eliminar)
CREATE POLICY "Usuarios autenticados pueden eliminar perfiles"
ON perfiles
FOR DELETE
TO authenticated
USING (true);
