# Desplegar Edge Function para Cambiar Contraseñas

## ¿Qué es esto?
Una Edge Function de Supabase que permite a los administradores cambiar las contraseñas de los usuarios desde el panel admin de forma segura.

## Requisitos Previos
1. Tener Supabase CLI instalado
2. Estar autenticado en Supabase CLI
3. Tener el proyecto vinculado

## Paso 1: Instalar Supabase CLI (si no lo tienes)

### Windows (PowerShell):
```powershell
scoop install supabase
```

O descarga desde: https://github.com/supabase/cli/releases

### Verificar instalación:
```bash
supabase --version
```

## Paso 2: Autenticarse en Supabase

```bash
supabase login
```

Esto abrirá tu navegador para autenticarte.

## Paso 3: Vincular tu Proyecto

```bash
cd sego-scraper
supabase link --project-ref TU_PROJECT_REF
```

Para obtener tu `PROJECT_REF`:
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a Settings → General
4. Copia el "Reference ID"

## Paso 4: Desplegar la Edge Function

```bash
supabase functions deploy update-user-password
```

## Paso 5: Verificar el Despliegue

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Edge Functions" en el menú lateral
4. Deberías ver `update-user-password` en la lista

## Paso 6: Probar la Funcionalidad

1. Ve al panel de administración: http://localhost:5173/admin
2. Ve a la pestaña "👥 Usuarios"
3. Haz clic en "✏️ Editar" de cualquier usuario
4. Ingresa una nueva contraseña (mínimo 6 caracteres)
5. Haz clic en "Guardar Cambios"
6. Deberías ver el mensaje: "✓ Usuario y contraseña actualizados correctamente"

## Solución de Problemas

### Error: "supabase: command not found"
- Instala Supabase CLI siguiendo el Paso 1

### Error: "Not logged in"
- Ejecuta `supabase login` y autentica

### Error: "Project not linked"
- Ejecuta `supabase link --project-ref TU_PROJECT_REF`

### Error al desplegar
- Verifica que estés en la carpeta `sego-scraper`
- Verifica que exista la carpeta `supabase/functions/update-user-password/`
- Verifica que el archivo `index.ts` esté en esa carpeta

## Seguridad

Esta Edge Function es segura porque:
1. Verifica que el usuario que hace la petición esté autenticado
2. Verifica que el usuario tenga rol 'admin' en la base de datos
3. Valida que la contraseña tenga al menos 6 caracteres
4. Usa la clave de servicio (service_role key) que solo está disponible en el servidor
5. No expone credenciales al cliente

## Alternativa: Sin Edge Function

Si no quieres usar Edge Functions, puedes:
1. Pedir a los usuarios que usen "Olvidé mi contraseña" en el login
2. Cambiar contraseñas manualmente desde el Dashboard de Supabase:
   - Ve a Authentication → Users
   - Haz clic en el usuario
   - Haz clic en "Reset Password"
   - Envía el email de recuperación al usuario
