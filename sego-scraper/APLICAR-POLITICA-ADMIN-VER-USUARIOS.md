# Aplicar Política: Admin Ver Todos los Usuarios

## Problema
En el panel de administración solo aparece 1 usuario (el admin actual), pero en la base de datos hay 2 usuarios. Esto se debe a que falta una política RLS que permita a los administradores ver todos los perfiles.

## Causa
La política actual solo permite que cada usuario vea su propio perfil:
```sql
CREATE POLICY "Usuarios pueden ver su perfil"
  ON perfiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

## Solución

### Paso 1: Abrir Supabase Dashboard
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a la sección **SQL Editor** en el menú lateral

### Paso 2: Ejecutar la Migración
1. Copia el contenido del archivo `supabase/migration-add-admin-view-all-perfiles.sql`
2. Pégalo en el SQL Editor
3. Haz clic en **Run** (Ejecutar)

### Paso 3: Verificar
Deberías ver el mensaje: "Success. No rows returned"

### Código SQL a Ejecutar:
```sql
-- Primero, eliminar la política restrictiva existente si causa problemas
DROP POLICY IF EXISTS "Usuarios pueden ver su perfil" ON perfiles;

-- Crear política que permite a cada usuario ver su propio perfil
-- Y permite a los admins ver todos los perfiles
CREATE POLICY "Usuarios pueden ver su perfil"
ON perfiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR rol = 'admin');
```

## ¿Qué hace esta política?
- Permite que los usuarios con rol 'admin' puedan ver TODOS los perfiles en la tabla `perfiles`
- Verifica que el usuario esté autenticado
- Verifica que el usuario tenga el rol 'admin'
- Se combina con la política existente que permite a cada usuario ver su propio perfil

## Después de Aplicar
Una vez aplicada la migración:
1. Los administradores podrán ver todos los usuarios registrados
2. En el panel admin aparecerán los 2 usuarios (admin + usuario regular)
3. Las estadísticas mostrarán correctamente:
   - Total Usuarios: 2
   - Administradores: 1
   - Usuarios Regulares: 1

## Verificar que Funciona
1. Recarga la página del panel de administración: http://localhost:5173/admin
2. Ve a la pestaña "👥 Usuarios"
3. Deberías ver los 2 usuarios:
   - bradatecrl@gmail.com (Admin)
   - bastoahugo01@gmail.com (Usuario)
4. Las estadísticas deberían actualizarse correctamente
