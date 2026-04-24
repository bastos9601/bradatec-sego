# 🔴 Error 401 (Unauthorized) - Solución

## ❌ El Error que Ves:

```
Failed to load resource: the server responded with a status of 401 ()
```

Esto significa que la Edge Function está rechazando tu petición por falta de permisos.

---

## ✅ SOLUCIÓN PASO A PASO

### Paso 1: Verificar que el usuario existe

1. Ve a tu proyecto en Supabase: https://supabase.com
2. Ve a **Authentication** > **Users**
3. Verifica que tu usuario existe (el email con el que hiciste login)
4. **Copia el UUID** del usuario (algo como: `a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6`)

### Paso 2: Crear el perfil de admin

1. Ve a **SQL Editor** en Supabase
2. Copia y pega este SQL (reemplaza el UUID con el tuyo):

```sql
-- Ver tu usuario
SELECT id, email FROM auth.users;

-- Crear perfil de admin (reemplaza el UUID)
INSERT INTO perfiles (id, rol)
VALUES ('PEGA_AQUI_TU_UUID', 'admin')
ON CONFLICT (id) DO UPDATE SET rol = 'admin';

-- Verificar
SELECT u.email, p.rol
FROM auth.users u
JOIN perfiles p ON u.id = p.id;
```

3. Haz clic en **Run** (▶️)
4. Deberías ver tu email con rol 'admin'

### Paso 3: Redesplegar la Edge Function

La función fue actualizada para mejor manejo de errores.

```bash
cd sego-scraper
npx supabase functions deploy scrape_productos
```

### Paso 4: Reiniciar el servidor de desarrollo

```bash
# Detén el servidor (Ctrl+C)
# Vuelve a iniciarlo
npm run dev
```

### Paso 5: Probar nuevamente

1. Abre http://localhost:5173
2. Haz login
3. Ve a la página **Admin**
4. Haz clic en **"🔄 Actualizar Productos"**

---

## 🔍 Verificar que Todo Está Bien

### Verificar tablas en Supabase:

```sql
-- Ver si las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver perfiles
SELECT * FROM perfiles;

-- Ver productos
SELECT * FROM productos;
```

### Verificar políticas RLS:

```sql
-- Ver políticas de la tabla productos
SELECT * FROM pg_policies WHERE tablename = 'productos';

-- Ver políticas de la tabla perfiles
SELECT * FROM pg_policies WHERE tablename = 'perfiles';
```

---

## 🐛 Otros Problemas Comunes

### "Table 'perfiles' does not exist"

Ejecuta el archivo `supabase/schema.sql` completo en SQL Editor.

### "No rows returned"

El trigger para crear perfiles automáticamente puede no estar funcionando. Crea el perfil manualmente con el SQL del Paso 2.

### "RLS policy violation"

Las políticas de seguridad están bloqueando el acceso. Verifica que:
1. El usuario esté autenticado
2. El perfil tenga rol 'admin'
3. Las políticas RLS estén creadas correctamente

### Deshabilitar RLS temporalmente (solo para debug):

```sql
-- SOLO PARA DEBUG - NO EN PRODUCCIÓN
ALTER TABLE productos DISABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles DISABLE ROW LEVEL SECURITY;

-- Cuando funcione, vuelve a habilitarlo:
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
```

---

## 📝 Checklist

- [ ] Usuario creado en Authentication > Users
- [ ] Perfil creado en tabla `perfiles` con rol 'admin'
- [ ] Tablas creadas (ejecutar `schema.sql`)
- [ ] Edge Function desplegada
- [ ] Variables `.env` correctas
- [ ] Servidor reiniciado

---

## 🚀 Si Todo Falla

Ejecuta este SQL para resetear todo:

```sql
-- Eliminar datos existentes
TRUNCATE productos CASCADE;
TRUNCATE perfiles CASCADE;

-- Recrear perfil de admin
INSERT INTO perfiles (id, rol)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'TU_EMAIL_AQUI';

-- Verificar
SELECT u.email, p.rol
FROM auth.users u
JOIN perfiles p ON u.id = p.id;
```

Luego intenta nuevamente el scraping.
