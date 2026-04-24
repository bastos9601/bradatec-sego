-- Agregar columnas sku y stock a la tabla productos
ALTER TABLE productos ADD COLUMN IF NOT EXISTS sku TEXT DEFAULT '';
ALTER TABLE productos ADD COLUMN IF NOT EXISTS stock TEXT DEFAULT '';

-- Crear índices para búsquedas más rápidas
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_stock ON productos(stock);
