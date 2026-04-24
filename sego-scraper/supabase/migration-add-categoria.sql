-- Agregar columna categoria a la tabla productos
ALTER TABLE productos ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'General';

-- Crear índice para búsquedas más rápidas por categoría
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
