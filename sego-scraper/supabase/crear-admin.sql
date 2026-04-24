-- Script para crear usuario admin
-- Ejecuta esto en SQL Editor de Supabase

-- 1. Primero, ver todos los usuarios existentes
SELECT id, email, created_at 
FROM auth.users;

-- 2. Ver los perfiles existentes
SELECT * FROM perfiles;

-- 3. Si tu usuario NO tiene perfil, créalo (reemplaza el UUID con el de tu usuario)
-- Copia el UUID de la consulta anterior
INSERT INTO perfiles (id, rol)
VALUES ('32693325-1b61-4c02-b9ba-18e9a9090997', 'admin')
ON CONFLICT (id) DO UPDATE SET rol = 'admin';

-- 4. Verificar que se creó correctamente
SELECT u.id, u.email, p.rol
FROM auth.users u
LEFT JOIN perfiles p ON u.id = p.id;

-- 5. Si quieres actualizar un usuario existente a admin:
UPDATE perfiles 
SET rol = 'admin' 
WHERE id = '32693325-1b61-4c02-b9ba-18e9a9090997';

-- 6. Verificación final - deberías ver tu usuario con rol 'admin'
SELECT u.email, p.rol
FROM auth.users u
JOIN perfiles p ON u.id = p.id
WHERE p.rol = 'admin';
