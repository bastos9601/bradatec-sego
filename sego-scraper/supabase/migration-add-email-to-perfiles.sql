-- Agregar columna email a la tabla perfiles
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Actualizar los emails existentes desde auth.users (esto se ejecuta en el servidor)
-- Nota: Esta parte debe ejecutarse manualmente en el SQL Editor de Supabase
UPDATE perfiles
SET email = auth.users.email
FROM auth.users
WHERE perfiles.id = auth.users.id
AND perfiles.email IS NULL;

-- Crear índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_perfiles_email ON perfiles(email);
