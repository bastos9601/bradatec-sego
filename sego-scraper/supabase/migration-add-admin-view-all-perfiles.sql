-- Primero, eliminar la política restrictiva existente si causa problemas
DROP POLICY IF EXISTS "Usuarios pueden ver su perfil" ON perfiles;

-- Crear política que permite a cada usuario ver su propio perfil
CREATE POLICY "Usuarios pueden ver su perfil"
ON perfiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR rol = 'admin');

