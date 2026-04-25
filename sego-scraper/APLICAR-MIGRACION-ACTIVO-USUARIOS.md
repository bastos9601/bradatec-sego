# Aplicar Migración: Campo Activo en Usuarios

## Descripción
Esta migración agrega la funcionalidad de desactivar/activar usuarios en el sistema. Cuando un usuario está desactivado, no puede iniciar sesión.

## Cambios
- Agrega columna `activo` (BOOLEAN) a la tabla `perfiles` con valor por defecto `true`
- Crea índice para búsquedas rápidas por estado activo

## Pasos para Aplicar

### 1. Acceder a Supabase
- Ve a https://supabase.com/dashboard
- Selecciona tu proyecto `bradatec-sego`

### 2. Abrir SQL Editor
- En el panel izquierdo, haz clic en "SQL Editor"
- Haz clic en "New Query"

### 3. Copiar y Ejecutar SQL
Copia el siguiente SQL en el editor:

```sql
-- Agregar campo activo a la tabla perfiles
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_perfiles_activo ON perfiles(activo);
```

### 4. Ejecutar
- Haz clic en el botón "Run" (o presiona Ctrl+Enter)
- Deberías ver un mensaje de éxito

## Verificación
Para verificar que la migración se aplicó correctamente:

1. Ve a "Table Editor"
2. Selecciona la tabla `perfiles`
3. Deberías ver la nueva columna `activo` con valores `true` para todos los usuarios existentes

## Funcionalidad Implementada

### En el Admin Panel
- **Desactivar Usuario**: Botón 🔒 Desactivar para bloquear acceso
- **Activar Usuario**: Botón 🔓 Activar para restaurar acceso
- **Estado Visual**: Columna "Estado" muestra ✅ Activo o ❌ Inactivo

### En el Login
- Si un usuario intenta iniciar sesión con cuenta desactivada, verá el error:
  - "❌ Tu cuenta ha sido desactivada. Contacta al administrador."
- La sesión se cierra automáticamente

### En el Registro
- Nuevos usuarios se registran con `activo = true` por defecto

## Notas
- Los usuarios desactivados NO pueden iniciar sesión
- Los usuarios desactivados NO pueden acceder a la tienda
- El admin puede reactivar usuarios en cualquier momento
- Eliminar un usuario lo borra completamente de la base de datos
