# 🔐 Aplicar Migración de Sesiones de Sego

## ⚠️ IMPORTANTE
Esta migración crea la tabla `sego_sessions` necesaria para guardar las cookies de sesión de Sego.

## 📋 Pasos para Aplicar la Migración

### Opción 1: Desde el Dashboard de Supabase (Recomendado)

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto `bradatec-sego`
3. Ve a la sección **SQL Editor** en el menú lateral
4. Haz clic en **New Query**
5. Copia y pega el contenido del archivo `supabase/migration-add-sego-sessions.sql`
6. Haz clic en **Run** (o presiona Ctrl+Enter)
7. Verifica que aparezca el mensaje: "Success. No rows returned"

### Opción 2: Usando Supabase CLI

```bash
# Asegúrate de estar en la carpeta sego-scraper
cd sego-scraper

# Aplicar la migración
supabase db push

# O aplicar manualmente
supabase db execute -f supabase/migration-add-sego-sessions.sql
```

## ✅ Verificar que la Migración se Aplicó

1. Ve a **Table Editor** en Supabase
2. Busca la tabla `sego_sessions`
3. Deberías ver las columnas:
   - `id` (UUID)
   - `user_id` (UUID)
   - `email` (TEXT)
   - `cookies` (JSONB)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

## 🔒 Políticas de Seguridad (RLS)

La migración incluye políticas de seguridad:
- Los usuarios solo pueden ver/editar sus propias sesiones
- Los admins pueden ver todas las sesiones

## 🧪 Probar el Sistema

Después de aplicar la migración:

1. Ve al panel de admin: https://bradatec.netlify.app/admin
2. Haz clic en **"🔗 Conectar Cuenta de Sego"**
3. Ingresa tus credenciales de Sego
4. Si todo funciona, verás: "✅ Cuenta de Sego conectada"
5. La próxima vez que importes productos, no necesitarás ingresar credenciales

## 🐛 Solución de Problemas

### Error: "relation sego_sessions does not exist"
- La migración no se aplicó correctamente
- Vuelve a ejecutar el SQL desde el dashboard

### Error: "permission denied for table sego_sessions"
- Las políticas RLS no se aplicaron
- Verifica que el usuario tenga rol de admin en la tabla `perfiles`

### La sesión no se guarda
- Verifica que el `userId` se esté enviando correctamente
- Revisa los logs del servidor en Railway
