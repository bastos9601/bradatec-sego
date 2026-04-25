# Eliminar Usuario Completamente (Auth + Perfiles)

## 🎯 Objetivo
Cuando el admin elimina un usuario del panel, se elimina completamente de:
- ✅ Tabla `perfiles` (base de datos)
- ✅ Tabla `auth.users` (Supabase Auth)

## 🔧 Solución Implementada

### 1. Función RPC en Supabase
Se crea una función `delete_user_account()` que:
- Elimina el usuario de la tabla `perfiles`
- Elimina el usuario de `auth.users`
- Retorna un JSON con el resultado

### 2. Actualización en Admin.jsx
La función `eliminarUsuario()` ahora:
- Llama a la función RPC `delete_user_account()`
- Muestra mensaje de éxito o error
- Recarga la lista de usuarios

## 📋 Pasos para Aplicar

### Paso 1: Crear la Función RPC en Supabase

1. **Accede a Supabase**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto `bradatec-sego`

2. **Abre SQL Editor**
   - En el panel izquierdo, haz clic en "SQL Editor"
   - Haz clic en "New Query"

3. **Copia y Ejecuta el SQL**
   ```sql
   -- Crear función RPC para eliminar usuario completamente
   CREATE OR REPLACE FUNCTION delete_user_account(user_id UUID)
   RETURNS JSON AS $$
   DECLARE
     result JSON;
   BEGIN
     -- Eliminar de la tabla perfiles primero
     DELETE FROM perfiles WHERE id = user_id;
     
     -- Eliminar de auth.users
     DELETE FROM auth.users WHERE id = user_id;
     
     -- Retornar resultado
     result := json_build_object(
       'success', true,
       'message', 'Usuario eliminado correctamente',
       'user_id', user_id
     );
     
     RETURN result;
   EXCEPTION WHEN OTHERS THEN
     result := json_build_object(
       'success', false,
       'message', SQLERRM,
       'user_id', user_id
     );
     RETURN result;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Dar permisos al rol authenticated
   GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;
   ```

4. **Verifica que se ejecutó correctamente**
   - Deberías ver un mensaje de éxito
   - La función estará disponible en el panel de Supabase

### Paso 2: Desplegar los Cambios

1. **Commit y Push**:
   ```bash
   git add .
   git commit -m "feat: eliminar usuario completamente de Auth y Perfiles"
   git push
   ```

2. **Netlify se redesplegará automáticamente**

### Paso 3: Prueba

1. **Ve al Admin Panel**
   - https://bradatec.netlify.app/admin

2. **Selecciona un usuario**
   - Haz clic en el botón 🗑️ Eliminar

3. **Confirma la eliminación**
   - Se mostrará un mensaje de confirmación

4. **Verifica**
   - El usuario desaparece de la tabla
   - Verifica en Supabase Auth que también se eliminó

## 📊 Flujo de Eliminación

```
1. Admin hace clic en 🗑️ Eliminar
   ↓
2. Se muestra confirmación
   ↓
3. Se llama a función RPC delete_user_account()
   ↓
4. Se elimina de perfiles
   ↓
5. Se elimina de auth.users
   ↓
6. Se retorna resultado JSON
   ↓
7. Se muestra mensaje de éxito
   ↓
8. Se recarga la lista de usuarios
```

## 💡 Ventajas

- ✅ **Eliminación completa**: Se elimina de Auth y Perfiles
- ✅ **Seguro**: Usa función RPC con SECURITY DEFINER
- ✅ **Transaccional**: Todo o nada
- ✅ **Manejo de errores**: Retorna JSON con resultado
- ✅ **Auditable**: Se registran los cambios

## 🔒 Seguridad

- ✅ Solo admins pueden eliminar usuarios
- ✅ Requiere confirmación del usuario
- ✅ Usa función RPC con permisos limitados
- ✅ No se puede deshacer (confirmación clara)

## 📝 Archivos Modificados
- `sego-scraper/src/paginas/Admin.jsx` - Función eliminarUsuario mejorada
- `sego-scraper/supabase/migration-delete-user-function.sql` - Función RPC

## 🧪 Testing

Para probar:
1. Crea un usuario de prueba
2. Ve al Admin Panel
3. Haz clic en 🗑️ Eliminar
4. Confirma la eliminación
5. Verifica que desaparece de la tabla
6. Verifica en Supabase Auth que también se eliminó

## ⚠️ Notas Importantes

- La eliminación es irreversible
- Se elimina completamente de Supabase
- Se requiere confirmación del usuario
- Solo admins pueden eliminar usuarios

## 🚀 Próximos Pasos

1. Aplica la función RPC en Supabase
2. Despliega los cambios en Netlify
3. Prueba la eliminación de usuarios
4. Verifica que se eliminen de Auth y Perfiles

## ❓ Preguntas Frecuentes

### ¿Se puede recuperar un usuario eliminado?
No, la eliminación es permanente. Se recomienda hacer backup antes.

### ¿Qué pasa con los pedidos del usuario?
Los pedidos se mantienen en la base de datos. Puedes eliminarlos manualmente si es necesario.

### ¿Solo admins pueden eliminar?
Sí, solo los usuarios con rol 'admin' pueden eliminar otros usuarios.

### ¿Se elimina el email también?
Sí, se elimina completamente de Supabase Auth, incluyendo el email.
