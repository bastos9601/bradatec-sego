# 🚨 PASOS URGENTES - Solucionar Error 401

## El problema:
Tu usuario NO tiene un perfil de admin en la base de datos.

---

## ✅ SOLUCIÓN (5 minutos)

### PASO 1: Ir a Supabase

Abre: https://supabase.com

### PASO 2: Abrir SQL Editor

1. Haz clic en tu proyecto
2. En el menú lateral, busca el ícono de base de datos 🗄️
3. Haz clic en **"SQL Editor"**

### PASO 3: Ejecutar este SQL

Copia y pega TODO esto en el editor:

```sql
-- 1. Ver tu usuario (copia el UUID que aparece)
SELECT id, email, created_at 
FROM auth.users;
```

Haz clic en **RUN** (▶️)

Verás algo como:
```
id: a1b2c3d4-5e6f-7890-abcd-ef1234567890
email: bradatecrl@gmail.com
```

**COPIA ESE UUID** (el id completo)

### PASO 4: Crear el perfil de admin

Ahora ejecuta este SQL (reemplaza el UUID con el que copiaste):

```sql
-- Reemplaza 'TU_UUID_AQUI' con el UUID que copiaste arriba
INSERT INTO perfiles (id, rol)
VALUES ('TU_UUID_AQUI', 'admin')
ON CONFLICT (id) DO UPDATE SET rol = 'admin';
```

Ejemplo real:
```sql
INSERT INTO perfiles (id, rol)
VALUES ('a1b2c3d4-5e6f-7890-abcd-ef1234567890', 'admin')
ON CONFLICT (id) DO UPDATE SET rol = 'admin';
```

Haz clic en **RUN** (▶️)

### PASO 5: Verificar que funcionó

Ejecuta:
```sql
SELECT u.email, p.rol
FROM auth.users u
JOIN perfiles p ON u.id = p.id;
```

Deberías ver:
```
email: bradatecrl@gmail.com
rol: admin
```

### PASO 6: Volver a tu aplicación

1. Ve a http://localhost:5173/admin
2. Haz clic en **"🔄 Actualizar Productos"**
3. Ahora debería funcionar ✅

---

## 🎯 Si NO ves tu usuario en el PASO 3

Significa que no has creado un usuario. Hazlo así:

1. En Supabase, ve a **Authentication** > **Users**
2. Haz clic en **"Add user"** > **"Create new user"**
3. Email: `bradatecrl@gmail.com`
4. Password: `admin123456` (o la que quieras)
5. Haz clic en **"Create user"**
6. Vuelve al PASO 3

---

## 🔍 Verificación Rápida

Ejecuta este SQL para ver todo:

```sql
-- Ver usuarios y sus roles
SELECT 
  u.email,
  p.rol,
  u.created_at
FROM auth.users u
LEFT JOIN perfiles p ON u.id = p.id;
```

Si ves `rol: null`, significa que falta crear el perfil (PASO 4).

---

## ⚡ Atajo Rápido

Si quieres hacerlo todo de una vez, ejecuta esto (reemplaza el email):

```sql
-- Crear perfil de admin para el usuario con este email
INSERT INTO perfiles (id, rol)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'bradatecrl@gmail.com'
ON CONFLICT (id) DO UPDATE SET rol = 'admin';

-- Verificar
SELECT u.email, p.rol
FROM auth.users u
JOIN perfiles p ON u.id = p.id;
```

---

## 📞 ¿Sigue sin funcionar?

Ejecuta esto para ver qué está pasando:

```sql
-- Ver si las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('productos', 'perfiles');

-- Ver todos los perfiles
SELECT * FROM perfiles;

-- Ver todos los usuarios
SELECT id, email FROM auth.users;
```

Si alguna tabla no existe, ejecuta el archivo `schema.sql` completo.
