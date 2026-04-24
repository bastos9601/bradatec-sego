# Aplicar Migración: Agregar Campos Nombre y Celular a Perfiles

Esta migración agrega los campos `nombre` y `celular` a la tabla `perfiles` para almacenar información completa de los usuarios.

## Pasos para aplicar la migración

### Opción 1: Desde Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, selecciona **SQL Editor**
3. Copia y pega el siguiente código SQL:

```sql
-- Agregar columnas nombre y celular a la tabla perfiles
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS nombre TEXT;
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS celular TEXT;

-- Verificar la estructura de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'perfiles';
```

4. Haz clic en **Run** para ejecutar la migración
5. Verifica que las columnas `nombre` y `celular` aparezcan en los resultados

### Opción 2: Desde Supabase CLI

Si tienes Supabase CLI instalado:

```bash
# Navegar a la carpeta del proyecto
cd sego-scraper

# Aplicar la migración
supabase db push

# O ejecutar el archivo SQL directamente
psql -h [TU_HOST] -U postgres -d postgres -f supabase/migration-add-nombre-perfil.sql
```

## Verificación

Después de aplicar la migración, verifica que funcione correctamente:

1. Ve al panel de Admin en tu aplicación
2. Navega a la pestaña "Usuarios"
3. Haz clic en "Editar" en cualquier usuario
4. Deberías poder editar el nombre, email, celular y contraseña

## Funcionalidades Nuevas

Después de aplicar esta migración, el admin podrá:

- ✅ Ver el nombre, email y celular de cada usuario en la tabla
- ✅ Editar el nombre de los usuarios
- ✅ Editar el email de los usuarios
- ✅ Editar el número de celular de los usuarios
- ✅ Cambiar la contraseña de los usuarios
- ✅ Los nuevos usuarios que se registren tendrán su nombre y celular guardados automáticamente

## Formulario de Registro Actualizado

El formulario de registro ahora incluye:
- Nombre Completo (requerido)
- Email (requerido)
- Número de Celular (requerido)
- Contraseña (requerido, mínimo 6 caracteres)
- Confirmar Contraseña (requerido)

## Notas

- Los usuarios existentes tendrán `nombre: null` y `celular: null` hasta que un admin lo edite
- Los campos `nombre` y `celular` son opcionales en la base de datos (pueden ser NULL)
- El email se obtiene de `auth.users` y se sincroniza automáticamente
- El número de celular se guarda como texto para permitir diferentes formatos
