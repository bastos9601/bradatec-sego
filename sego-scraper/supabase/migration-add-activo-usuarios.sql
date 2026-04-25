-- Agregar campo activo a la tabla perfiles
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_perfiles_activo ON perfiles(activo);
