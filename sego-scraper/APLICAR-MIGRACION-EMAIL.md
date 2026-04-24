# Aplicar Migración: Agregar Email a Perfiles

## Problema
Los usuarios no aparecen correctamente en el panel de administración porque falta el campo `email` en la tabla `perfiles`.

## Solución

### Paso 1: Abrir Supabase Dashboard
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a la sección **SQL Editor** en el menú lateral

### Paso 2: Ejecutar la Migración
1. Copia el contenido del archivo `supabase/migration-add-email-to-perfiles.sql`
2. Pégalo en el SQL Editor
3. Haz clic en **Run** (Ejecutar)

### Paso 3: Verificar
Deberías ver el mensaje: "Success. No rows returned"

### Código SQL a Ejecutar:
```sql
-- Agregar columna email a la tabla perfiles
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Actualizar los emails existentes desde auth.users
UPDATE perfiles
SET email = auth.users.email
FROM auth.users
WHERE perfiles.id = auth.users.id
AND perfiles.email IS NULL;

-- Crear índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_perfiles_email ON perfiles(email);
```

## ¿Qué hace esta migración?
1. Agrega la columna `email` a la tabla `perfiles`
2. Copia los emails existentes desde `auth.users` a `perfiles`
3. Crea un índice para mejorar las búsquedas por email

## Después de Aplicar
Una vez aplicada la migración:
1. Los usuarios existentes tendrán su email visible en el panel admin
2. Los nuevos usuarios registrados guardarán automáticamente su email en `perfiles`
3. Todos los usuarios (2 en tu caso) deberían aparecer en el panel de administración

## Verificar que Funciona
1. Ve al panel de administración: http://localhost:5173/admin
2. Ve a la pestaña "👥 Usuarios"
3. Deberías ver los 2 usuarios con sus emails correctos
4. Las estadísticas deberían mostrar "Total Usuarios: 2"
