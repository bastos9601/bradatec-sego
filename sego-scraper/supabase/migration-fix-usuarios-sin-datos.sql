-- Actualizar usuarios que tienen "Sin nombre" o nombre vacío
-- Usar el email como nombre si no tienen uno
UPDATE perfiles
SET nombre = COALESCE(NULLIF(nombre, ''), NULLIF(nombre, 'Sin nombre'), email)
WHERE nombre IS NULL OR nombre = '' OR nombre = 'Sin nombre';

-- Actualizar usuarios que tienen "Sin celular" o celular vacío
-- Dejar como NULL si no tienen celular
UPDATE perfiles
SET celular = NULL
WHERE celular = '' OR celular = 'Sin celular';

-- Verificar que los datos se actualizaron correctamente
SELECT id, nombre, email, celular, rol, created_at
FROM perfiles
ORDER BY created_at DESC;
