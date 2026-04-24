-- Agregar columnas nombre y celular a la tabla perfiles
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS nombre TEXT;
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS celular TEXT;

-- Verificar la estructura de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'perfiles';
