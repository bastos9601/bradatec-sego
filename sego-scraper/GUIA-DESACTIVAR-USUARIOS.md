# Guía: Desactivar y Gestionar Usuarios

## 🎯 Objetivo
Permitir que el admin pueda desactivar usuarios para que no puedan ingresar al sistema, y también eliminar usuarios completamente.

## ✅ Lo que se Implementó

### 1. Campo "Activo" en Usuarios
- Cada usuario tiene un estado: **Activo** ✅ o **Inactivo** ❌
- Los usuarios inactivos NO pueden iniciar sesión
- El admin puede cambiar este estado en cualquier momento

### 2. Registro Mejorado
Cuando un usuario se registra, se guardan:
- ✅ Nombre completo
- ✅ Email
- ✅ Celular
- ✅ Estado activo (true por defecto)

### 3. Verificación en Login
- El sistema verifica si el usuario está activo
- Si está inactivo, muestra error: "❌ Tu cuenta ha sido desactivada. Contacta al administrador."

## 📋 Pasos para Aplicar

### Paso 1: Aplicar Migración SQL

1. **Accede a Supabase**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto `bradatec-sego`

2. **Abre SQL Editor**
   - En el panel izquierdo, haz clic en "SQL Editor"
   - Haz clic en "New Query"

3. **Copia y Ejecuta el SQL**
   ```sql
   -- Agregar campo activo a la tabla perfiles
   ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

   -- Crear índice para búsquedas rápidas
   CREATE INDEX IF NOT EXISTS idx_perfiles_activo ON perfiles(activo);
   ```

4. **Verifica que se ejecutó correctamente**
   - Deberías ver un mensaje de éxito
   - Ve a "Table Editor" → "perfiles"
   - Deberías ver la columna `activo` con valores `true`

### Paso 2: Desplegar los Cambios

1. **Commit y Push**
   ```bash
   git add .
   git commit -m "feat: agregar funcionalidad de desactivar usuarios"
   git push
   ```

2. **Netlify se redesplegará automáticamente**
   - Los cambios estarán disponibles en https://bradatec.netlify.app

## 🎮 Cómo Usar

### Desactivar un Usuario

1. **Accede al Panel Admin**
   - Ve a https://bradatec.netlify.app/admin
   - Inicia sesión con tu cuenta admin

2. **Ve a la sección Usuarios**
   - Haz clic en la pestaña "👥 Usuarios"

3. **Busca el usuario**
   - Encuentra el usuario en la tabla

4. **Desactívalo**
   - Haz clic en el botón 🔒 **Desactivar**
   - Confirma la acción

5. **Resultado**
   - La fila del usuario se pone de color rojo
   - El estado cambia a "❌ Inactivo"
   - El usuario NO puede iniciar sesión

### Reactivar un Usuario

1. **Ve a la sección Usuarios**
   - Haz clic en la pestaña "👥 Usuarios"

2. **Busca el usuario inactivo**
   - Busca la fila con fondo rojo

3. **Actívalo**
   - Haz clic en el botón 🔓 **Activar**
   - Confirma la acción

4. **Resultado**
   - La fila vuelve al color normal
   - El estado cambia a "✅ Activo"
   - El usuario puede iniciar sesión nuevamente

### Eliminar un Usuario

1. **Ve a la sección Usuarios**
   - Haz clic en la pestaña "👥 Usuarios"

2. **Busca el usuario**
   - Encuentra el usuario en la tabla

3. **Elimínalo**
   - Haz clic en el botón 🗑️ **Eliminar**
   - Confirma la acción

4. **Resultado**
   - El usuario se elimina completamente de la base de datos
   - Se borra: nombre, email, celular, rol
   - El usuario NO puede iniciar sesión

## 📊 Tabla de Usuarios - Nuevas Columnas

La tabla ahora muestra:

| Columna | Descripción |
|---------|-------------|
| Nombre | Nombre completo del usuario |
| Email | Email de la cuenta |
| Celular | Número de teléfono |
| Rol | Usuario o Admin |
| **Estado** | ✅ Activo o ❌ Inactivo (NUEVO) |
| Fecha de Registro | Cuándo se registró |
| Acciones | Editar, Desactivar/Activar, Eliminar |

## 🔐 Seguridad

- Los usuarios desactivados NO pueden acceder a ninguna parte del sistema
- La verificación ocurre en el servidor, no en el navegador
- Los datos se validan en la base de datos
- Los usuarios eliminados se borran completamente

## 📝 Ejemplo de Flujo

### Escenario: Usuario problemático

1. **Admin ve que un usuario está causando problemas**
   - Va a Panel Admin → Usuarios
   - Encuentra al usuario en la tabla

2. **Admin lo desactiva**
   - Hace clic en 🔒 Desactivar
   - Confirma

3. **Usuario intenta iniciar sesión**
   - Ve el error: "❌ Tu cuenta ha sido desactivada. Contacta al administrador."
   - No puede acceder al sistema

4. **Después, admin lo reactiva**
   - Hace clic en 🔓 Activar
   - Confirma

5. **Usuario puede iniciar sesión nuevamente**
   - Accede sin problemas

## ❓ Preguntas Frecuentes

### ¿Qué pasa si desactivo un usuario?
- No puede iniciar sesión
- No puede acceder a la tienda
- Sus datos se mantienen en la base de datos
- Puedes reactivarlo en cualquier momento

### ¿Qué pasa si elimino un usuario?
- Se borra completamente de la base de datos
- No puede iniciar sesión
- Sus datos se pierden
- No se puede recuperar

### ¿Puedo desactivar a un admin?
- Sí, puedes desactivar a cualquier usuario, incluyendo admins
- El admin desactivado no puede iniciar sesión

### ¿Qué pasa con los pedidos de un usuario desactivado?
- Los pedidos se mantienen en la base de datos
- Puedes verlos en la sección de Pedidos
- Si reactivas al usuario, sus pedidos siguen ahí

## 🚀 Próximos Pasos

1. Aplica la migración SQL en Supabase
2. Despliega los cambios en Netlify
3. Prueba desactivando un usuario
4. Verifica que no pueda iniciar sesión
5. Reactívalo y verifica que funcione

## 📞 Soporte

Si tienes problemas:
1. Verifica que la migración SQL se ejecutó correctamente
2. Revisa que la columna `activo` existe en la tabla `perfiles`
3. Comprueba que los cambios se desplegaron en Netlify
4. Intenta limpiar el caché del navegador (Ctrl+Shift+Delete)
