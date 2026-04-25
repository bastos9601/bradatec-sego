-- Agregar constraint único en SKU para permitir UPSERT
-- Primero, eliminar duplicados si existen
DELETE FROM productos 
WHERE id NOT IN (
  SELECT DISTINCT ON (sku) id 
  FROM productos 
  WHERE sku IS NOT NULL AND sku != ''
  ORDER BY sku, created_at DESC
)
AND sku IS NOT NULL AND sku != '';

-- Agregar constraint único en SKU
ALTER TABLE productos 
ADD CONSTRAINT unique_sku UNIQUE (sku);

-- Crear índice para búsquedas rápidas por SKU
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
