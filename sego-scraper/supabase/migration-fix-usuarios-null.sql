-- Verificar usuarios con datos NULL
SELECT id, nombre, email, celular, rol, created_at
FROM perfiles
WHERE nombre IS NULL OR email IS NULL OR celular IS NULL
ORDER BY created_at DESC;

-- Para usuarios con NULL, usar el email de Supabase Auth si está disponible
-- Primero, obtener los emails de la tabla auth.users
-- Nota: Esto requiere que ejecutes esto manualmente o uses una función RPC

-- Opción 1: Si conoces los emails, actualiza manualmente:
-- UPDATE perfiles
-- SET nombre = 'Nombre del Usuario', email = 'email@ejemplo.com', celular = '999999999'
-- WHERE id = 'd58d8641-ecdb-44f7-a18f-0f21f0773d19';

-- Opción 2: Eliminar usuarios con datos incompletos (si prefieres empezar de cero)
-- DELETE FROM perfiles
-- WHERE nombre IS NULL OR email IS NULL OR celular IS NULL;

-- Opción 3: Asignar valores por defecto temporales
UPDATE perfiles
SET 
  nombre = COALESCE(nombre, 'Usuario ' || SUBSTRING(id::text, 1, 8)),
  email = COALESCE(email, 'usuario-' || SUBSTRING(id::text, 1, 8) || '@bradatec.local'),
  celular = COALESCE(celular, 'No proporcionado')
WHERE nombre IS NULL OR email IS NULL OR celular IS NULL;

-- Verificar que se actualizaron correctamente
SELECT id, nombre, email, celular, rol, created_at
FROM perfiles
ORDER BY created_at DESC;
