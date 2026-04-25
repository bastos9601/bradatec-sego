# Fix: Datos de Usuarios en Registro

## 🐛 Problema
Los usuarios que se registran no mostraban nombre, email ni celular en el Admin Panel. Aparecía "Sin nombre" y "Sin celular".

## 🔍 Causa
1. **Usuarios antiguos**: Los usuarios registrados antes de implementar esta funcionalidad no tienen datos en la tabla `perfiles`
2. **Validación faltante**: El formulario de registro no validaba que los campos estuvieran llenos
3. **Errores silenciosos**: Si había error al crear el perfil, no se mostraba al usuario

## ✅ Solución Implementada

### 1. Validación Mejorada en Registro.jsx
Se agregaron validaciones para asegurar que:
- ✅ El nombre no esté vacío
- ✅ El celular no esté vacío
- ✅ Las contraseñas coincidan
- ✅ La contraseña tenga al menos 6 caracteres

```javascript
if (!nombre || !nombre.trim()) {
  setError('El nombre es requerido')
  return
}

if (!celular || !celular.trim()) {
  setError('El celular es requerido')
  return
}
```

### 2. Limpieza de Espacios
Se trimean todos los datos antes de guardar:
```javascript
nombre: nombre.trim(),
celular: celular.trim(),
email: email.trim()
```

### 3. Manejo de Errores
Se muestra el error al usuario si falla la creación del perfil:
```javascript
if (perfilError) {
  setError(`Error al crear perfil: ${perfilError.message}`)
  return
}
```

### 4. Migración SQL para Usuarios Antiguos
Se proporciona un script SQL para actualizar usuarios existentes:
```sql
UPDATE perfiles
SET nombre = COALESCE(NULLIF(nombre, ''), NULLIF(nombre, 'Sin nombre'), email)
WHERE nombre IS NULL OR nombre = '' OR nombre = 'Sin nombre';
```

## 📋 Pasos para Aplicar

### Paso 1: Actualizar Usuarios Existentes

1. **Accede a Supabase**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto `bradatec-sego`

2. **Abre SQL Editor**
   - En el panel izquierdo, haz clic en "SQL Editor"
   - Haz clic en "New Query"

3. **Copia y Ejecuta el SQL**
   ```sql
   -- Actualizar usuarios que tienen "Sin nombre" o nombre vacío
   UPDATE perfiles
   SET nombre = COALESCE(NULLIF(nombre, ''), NULLIF(nombre, 'Sin nombre'), email)
   WHERE nombre IS NULL OR nombre = '' OR nombre = 'Sin nombre';

   -- Actualizar usuarios que tienen "Sin celular" o celular vacío
   UPDATE perfiles
   SET celular = NULL
   WHERE celular = '' OR celular = 'Sin celular';
   ```

4. **Verifica que se actualizaron correctamente**
   - Ejecuta esta query para verificar:
   ```sql
   SELECT id, nombre, email, celular, rol, created_at
   FROM perfiles
   ORDER BY created_at DESC;
   ```

### Paso 2: Desplegar los Cambios

1. **Commit y Push**:
   ```bash
   git add .
   git commit -m "fix: validación y limpieza de datos en registro de usuarios"
   git push
   ```

2. **Netlify se redesplegará automáticamente**

### Paso 3: Prueba

1. **Crea una nueva cuenta**:
   - Ve a https://bradatec.netlify.app/registro
   - Completa el formulario con:
     - Nombre: Juan Pérez
     - Email: juan@ejemplo.com
     - Celular: 999999999
     - Contraseña: 123456

2. **Verifica en Admin Panel**:
   - Ve a https://bradatec.netlify.app/admin
   - Deberías ver el nuevo usuario con todos los datos

## 📊 Resultados Esperados

### Antes (Problema)
```
Nombre: Sin nombre
Email: ID: d1a98ac4...
Celular: Sin celular
```

### Después (Solución)
```
Nombre: Juan Pérez
Email: juan@ejemplo.com
Celular: 999999999
```

## 💡 Ventajas

- ✅ **Validación completa**: Se validan todos los campos
- ✅ **Datos limpios**: Se trimean espacios en blanco
- ✅ **Errores claros**: Se muestran errores al usuario
- ✅ **Usuarios actualizados**: Se pueden actualizar usuarios antiguos
- ✅ **Sin duplicados**: Cada usuario tiene datos únicos

## 🔒 Seguridad

- ✅ Se validan todos los campos
- ✅ Se limpian espacios en blanco
- ✅ Se valida el email
- ✅ Se valida la contraseña

## 📝 Archivos Modificados
- `sego-scraper/src/paginas/Registro.jsx` - Validación mejorada
- `sego-scraper/supabase/migration-fix-usuarios-sin-datos.sql` - Migración SQL

## 🧪 Testing

Para probar:
1. Crea una nueva cuenta con todos los datos
2. Verifica que aparezca en el Admin Panel
3. Verifica que los datos sean correctos
4. Ejecuta la migración SQL para actualizar usuarios antiguos

## ⚠️ Notas Importantes

- La migración SQL actualiza usuarios existentes
- Se usa el email como nombre si no tienen uno
- El celular se pone como NULL si está vacío
- Los nuevos usuarios deben llenar todos los campos

## 🚀 Próximos Pasos

1. Aplica la migración SQL en Supabase
2. Despliega los cambios en Netlify
3. Prueba el registro con un nuevo usuario
4. Verifica que aparezca en el Admin Panel
