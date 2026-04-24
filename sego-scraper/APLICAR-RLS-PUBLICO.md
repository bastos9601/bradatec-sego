# Aplicar Políticas RLS para Lectura Pública

## Problema
Los productos no se muestran en la tienda pública porque las políticas RLS (Row Level Security) de Supabase están bloqueando el acceso.

## Solución
Necesitas actualizar las políticas RLS para permitir que usuarios NO autenticados puedan VER los productos (pero la aplicación ocultará los precios en el frontend).

## Pasos para Aplicar

### 1. Ve a Supabase Dashboard
1. Abre https://supabase.com
2. Selecciona tu proyecto: `bradatec-sego`
3. Ve a **SQL Editor** en el menú lateral

### 2. Ejecuta el SQL
1. Copia todo el contenido del archivo `supabase/migration-rls-public-read.sql`
2. Pégalo en el SQL Editor
3. Haz clic en **Run** o presiona `Ctrl+Enter`

### 3. Verifica que Funcionó
Deberías ver un mensaje de éxito y una tabla mostrando las políticas creadas:

```
Permitir lectura pública de productos
Permitir inserción solo a usuarios autenticados
Permitir actualización solo a usuarios autenticados
Permitir eliminación solo a usuarios autenticados
```

### 4. Recarga la Tienda
1. Ve a http://localhost:5173
2. Recarga la página (F5)
3. Ahora deberías ver los productos SIN precios
4. Los precios solo aparecerán cuando inicies sesión

## ¿Qué Hace Esta Migración?

**Políticas RLS Configuradas:**

1. **Lectura Pública (SELECT)** ✅
   - Cualquiera puede VER los productos
   - No requiere autenticación
   - Los precios se ocultan en el frontend

2. **Inserción (INSERT)** 🔒
   - Solo usuarios autenticados
   - Para agregar nuevos productos

3. **Actualización (UPDATE)** 🔒
   - Solo usuarios autenticados
   - Para modificar productos existentes

4. **Eliminación (DELETE)** 🔒
   - Solo usuarios autenticados
   - Para eliminar productos

## Seguridad

✅ **Seguro**: Los productos son visibles públicamente (como en cualquier tienda online)
✅ **Protegido**: Solo usuarios autenticados pueden modificar datos
✅ **Frontend**: La aplicación oculta los precios si no hay sesión activa

## Alternativa: Deshabilitar RLS Temporalmente

Si prefieres deshabilitar RLS completamente (menos seguro):

```sql
ALTER TABLE productos DISABLE ROW LEVEL SECURITY;
```

**⚠️ No recomendado**: Esto permite que cualquiera pueda modificar/eliminar productos.

## Verificar Políticas Actuales

Para ver las políticas actuales de la tabla productos:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'productos';
```

## Solución de Problemas

**Si los productos aún no aparecen:**

1. Verifica en la consola del navegador (F12) si hay errores
2. Revisa que las políticas se aplicaron correctamente
3. Asegúrate de que hay productos en la base de datos (635 registros)
4. Recarga la página con Ctrl+F5 (recarga forzada)

**Si aparece error de permisos:**

```
Error: new row violates row-level security policy
```

Significa que las políticas están muy restrictivas. Ejecuta el SQL de migración nuevamente.
