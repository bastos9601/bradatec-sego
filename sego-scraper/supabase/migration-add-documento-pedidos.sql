-- Agregar campos de DNI/RUC a la tabla pedidos
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS tipo_documento TEXT DEFAULT 'DNI';
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS numero_documento TEXT;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_pedidos_numero_documento ON pedidos(numero_documento);
