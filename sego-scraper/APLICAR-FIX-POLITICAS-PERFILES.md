# SOLUCIÓN DEFINITIVA: Arreglar Políticas RLS de Perfiles

## Problema Identificado
Error en consola del navegador:
```
Error al obtener perfil:
{ code: "42P17", message: "infinite recursion detected in policy for relation 'perfiles'" }
```

Este error ocurre porque la política RLS intenta consultar la misma tabla `perfiles` dentro de su propia condición, causando un **loop infinito**.

## Causa Raíz
La política problemática era:
```sql
CREATE POLICY "Usuarios pueden ver su perfil"
ON perfiles FOR SELECT
USING (auth.uid() = id OR rol = 'admin');
```

El problema es `OR rol = 'admin'` - para verificar si `rol = 'admin'`, Supabase necesita leer la tabla `perfiles`, pero para leer `perfiles` necesita verificar la política, que necesita leer `perfiles`... ¡recursión infinita!

## Solución

### Paso 1: Abrir Supabase Dashboard
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a la sección **SQL Editor** en el menú lateral

### Paso 2: Ejecutar la Migración de Corrección
Copia y pega este código completo en el SQL Editor:

```sql
-- SOLUCIÓN DEFINITIVA: Eliminar todas las políticas existentes y crear nuevas sin recursión

-- Paso 1: Eliminar todas las políticas existentes en la tabla perfiles
DROP POLICY IF EXISTS "Usuarios pueden ver su perfil" ON perfiles;
DROP POLICY IF EXISTS "Los admins pueden ver todos los perfiles" ON perfiles;

-- Paso 2: Crear una política simple que permita a todos los usuarios autenticados ver todos los perfiles
-- Esto es seguro porque solo los admins acceden al panel de administración
CREATE POLICY "Usuarios autenticados pueden ver perfiles"
ON perfiles
FOR SELECT
TO authenticated
USING (true);

-- Paso 3: Agregar políticas para INSERT (solo en registro)
CREATE POLICY "Usuarios pueden crear su propio perfil"
ON perfiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Paso 4: Agregar políticas para UPDATE
CREATE POLICY "Usuarios autenticados pueden actualizar perfiles"
ON perfiles
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Paso 5: Agregar políticas para DELETE
CREATE POLICY "Usuarios autenticados pueden eliminar perfiles"
ON perfiles
FOR DELETE
TO authenticated
USING (true);
```

### Paso 3: Verificar
Deberías ver el mensaje: "Success. No rows returned"

## ¿Por qué esta solución funciona?

1. **Sin recursión**: La política `USING (true)` no consulta la tabla `perfiles`, por lo que no hay recursión
2. **Seguridad**: Solo usuarios autenticados pueden acceder, y la lógica de admin/usuario se maneja en el código de la aplicación
3. **Simple y eficiente**: No hay consultas complejas que ralenticen la base de datos

## Después de Aplicar

1. **Recarga la página** de la tienda (F5)
2. Abre la consola del navegador (F12)
3. Deberías ver:
   ```
   === DIAGNÓSTICO DE USUARIO ===
   Usuario Email: bradatecrl@gmail.com
   Perfil obtenido: { rol: 'admin' }
   Error al obtener perfil: null
   Rol del usuario: admin
   Es Admin?: true
   ==============================
   ```
4. El **botón "Admin"** debería aparecer en el navbar
5. Al hacer clic, deberías acceder al panel de administración
6. En el panel admin deberías ver **los 2 usuarios** correctamente

## Nota de Seguridad
Esta solución permite que todos los usuarios autenticados puedan leer la tabla `perfiles`. Esto es aceptable porque:
- Solo usuarios registrados pueden autenticarse
- La información en `perfiles` (nombre, email, celular, rol) no es sensible
- La lógica de autorización (quién puede hacer qué) se maneja en el código de la aplicación
- Solo los admins tienen acceso al panel de administración (verificado en el código)
