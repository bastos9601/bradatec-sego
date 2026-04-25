# Sincronizar Usuarios de Auth con Perfiles

## 🐛 Problema
Hay usuarios en Supabase Auth que no tienen datos en la tabla `perfiles`, o tienen datos NULL/incompletos.

**Usuarios en Auth**: 4
- bastoshugo01@gmail.com
- bradatecsr@gmail.com
- prometheron66@gmail.com
- neogld000@gmail.com

**Usuarios en Perfiles**: 4 (pero algunos con NULL)

## ✅ Solución

### Opción 1: Actualizar Manualmente (Recomendado)

Ejecuta este SQL en Supabase para llenar los datos faltantes:

```sql
-- Actualizar usuario 1
UPDATE perfiles
SET 
  nombre = 'Hugo Bastos',
  email = 'bastoshugo01@gmail.com',
  celular = '936185088'
WHERE id = 'f607f88-f8b0-4150-bf53-4ff44edbf5f5';

-- Actualizar usuario 2
UPDATE perfiles
SET 
  nombre = 'Bradatec',
  email = 'bradatecsr@gmail.com',
  celular = '936185088'
WHERE id = '32693325-1b61-4c82-b0ba-18e9a9959997';

-- Actualizar usuario 3
UPDATE perfiles
SET 
  nombre = 'Prometheron',
  email = 'prometheron66@gmail.com',
  celular = 'No proporcionado'
WHERE id = 'd50b6fd1-ecdb-44f7-e1ff-0f21f0753d19';

-- Actualizar usuario 4
UPDATE perfiles
SET 
  nombre = 'Neogld',
  email = 'neogld000@gmail.com',
  celular = 'No proporcionado'
WHERE id = '5fa59a8c-c597-45db-b855-9240fffc40f0';
```

### Opción 2: Llenar con Valores por Defecto

```sql
UPDATE perfiles
SET 
  nombre = COALESCE(nombre, 'Usuario ' || SUBSTRING(id::text, 1, 8)),
  email = COALESCE(email, 'usuario-' || SUBSTRING(id::text, 1, 8) || '@bradatec.local'),
  celular = COALESCE(celular, 'No proporcionado')
WHERE nombre IS NULL OR email IS NULL OR celular IS NULL;
```

### Opción 3: Eliminar y Recrear (Nuclear)

Si prefieres empezar de cero:

```sql
-- Eliminar usuarios incompletos
DELETE FROM perfiles
WHERE nombre IS NULL OR email IS NULL OR celular IS NULL;

-- Los usuarios deberán registrarse nuevamente
```

## 📋 Pasos

1. **Accede a Supabase**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Abre SQL Editor**
   - Haz clic en "SQL Editor"
   - Haz clic en "New Query"

3. **Copia y Ejecuta el SQL**
   - Elige la opción que prefieras
   - Ejecuta el query

4. **Verifica**
   ```sql
   SELECT id, nombre, email, celular, rol, created_at
   FROM perfiles
   ORDER BY created_at DESC;
   ```

## 🎯 Resultado Esperado

Después de ejecutar:

```
ID                                  | Nombre        | Email                    | Celular
f607f88-f8b0-4150-bf53-4ff44edbf5f5 | Hugo Bastos   | bastoshugo01@gmail.com   | 936185088
32693325-1b61-4c82-b0ba-18e9a9959997| Bradatec      | bradatecsr@gmail.com     | 936185088
d50b6fd1-ecdb-44f7-e1ff-0f21f0753d19| Prometheron   | prometheron66@gmail.com  | No proporcionado
5fa59a8c-c597-45db-b855-9240fffc40f0| Neogld        | neogld000@gmail.com      | No proporcionado
```

## 🚀 Próximos Pasos

1. Ejecuta el SQL que prefieras
2. Verifica que los datos se actualizaron
3. Accede al Admin Panel
4. Deberías ver todos los usuarios con sus datos

## 💡 Prevención Futura

Para evitar esto en el futuro:
- ✅ La validación en Registro.jsx ahora requiere nombre y celular
- ✅ Se muestran errores si faltan datos
- ✅ Los nuevos usuarios deben llenar todos los campos

## ⚠️ Notas

- Los IDs de usuario son los que ves en Supabase Auth
- Reemplaza los IDs con los correctos si son diferentes
- Puedes obtener los IDs exactos de la tabla `perfiles`
