# Aplicar Política de Eliminación de Pedidos

## Problema
El botón "Eliminar" en el panel de administración de pedidos no funciona porque falta una política RLS (Row Level Security) que permita a los administradores eliminar pedidos.

## Solución

### Paso 1: Abrir Supabase Dashboard
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a la sección **SQL Editor** en el menú lateral

### Paso 2: Ejecutar la Migración
1. Copia el contenido del archivo `supabase/migration-add-delete-pedidos-policy.sql`
2. Pégalo en el SQL Editor
3. Haz clic en **Run** (Ejecutar)

### Paso 3: Verificar
Deberías ver el mensaje: "Success. No rows returned"

### Código SQL a Ejecutar:
```sql
-- Agregar política para que los admins puedan eliminar pedidos
CREATE POLICY "Los admins pueden eliminar pedidos"
ON pedidos
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM perfiles
    WHERE perfiles.id = auth.uid()
    AND perfiles.rol = 'admin'
  )
);
```

## ¿Qué hace esta política?
- Permite que los usuarios con rol 'admin' puedan eliminar pedidos de la tabla `pedidos`
- Verifica que el usuario esté autenticado
- Verifica que el usuario tenga el rol 'admin' en la tabla `perfiles`

## Después de Aplicar
Una vez aplicada la migración, el botón "🗑️ Eliminar" en el panel de administración funcionará correctamente y los administradores podrán eliminar pedidos.

## Verificar que Funciona
1. Ve al panel de administración: http://localhost:5173/admin
2. Ve a la pestaña "🛒 Pedidos"
3. Haz clic en el botón "🗑️ Eliminar" de cualquier pedido
4. Confirma la eliminación
5. El pedido debería desaparecer de la lista
