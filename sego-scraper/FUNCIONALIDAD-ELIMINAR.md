# 🗑️ Funcionalidad de Eliminación de Productos

## ✅ Nuevas Funcionalidades Agregadas

### 1. Eliminar Todos los Productos

Botón rojo en el panel de administración que elimina todos los productos de la base de datos.

**Características:**
- ✅ Confirmación antes de eliminar
- ✅ Mensaje de éxito/error
- ✅ Actualización automática de la lista
- ✅ Solo disponible para administradores

### 2. Eliminar Productos Individuales

Tabla con todos los productos donde puedes eliminar uno por uno.

**Características:**
- ✅ Vista de tabla con imagen, nombre, precio y fecha
- ✅ Botón de eliminar por cada producto
- ✅ Confirmación antes de eliminar
- ✅ Mensaje de éxito que desaparece automáticamente
- ✅ Actualización automática de la lista

---

## 🎯 Cómo Usar

### Eliminar Todos los Productos:

1. Ve a http://localhost:5173/admin
2. Haz clic en el botón **"🗑️ Eliminar Todos"**
3. Confirma la acción en el diálogo
4. Los productos se eliminarán y verás un mensaje de confirmación

### Eliminar un Producto Individual:

1. Ve a http://localhost:5173/admin
2. Desplázate hasta la sección **"Gestionar Productos"**
3. Busca el producto que quieres eliminar
4. Haz clic en el botón **"🗑️ Eliminar"** de ese producto
5. Confirma la acción
6. El producto se eliminará y verás un mensaje de confirmación

---

## 🔒 Seguridad

### Políticas RLS (Row Level Security):

Las políticas de Supabase ya permiten que los administradores eliminen productos:

```sql
-- Solo admins pueden eliminar productos
CREATE POLICY "Solo admins pueden eliminar productos"
  ON productos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol = 'admin'
    )
  );
```

### Confirmaciones:

- ✅ Diálogo de confirmación antes de eliminar
- ✅ Mensajes claros de advertencia
- ✅ No se puede deshacer la acción

---

## 📋 Interfaz

### Panel de Administración:

```
┌─────────────────────────────────────────┐
│ Panel de Administración                 │
├─────────────────────────────────────────┤
│ Actualizar Productos                    │
│ [🔄 Actualizar Productos] [🗑️ Eliminar Todos] │
├─────────────────────────────────────────┤
│ Estadísticas                            │
│ Total: 10 | Última: 20/04/2026 | Activo│
├─────────────────────────────────────────┤
│ Gestionar Productos (10)                │
│ ┌────────────────────────────────────┐ │
│ │ Img │ Nombre │ Precio │ Fecha │ ⚙️ │ │
│ │ 📦  │ Cemento│ S/28.50│ 20/04 │🗑️│ │
│ │ 📦  │ Fierro │ S/35.00│ 20/04 │🗑️│ │
│ └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🎨 Estilos

### Botones:

- **Actualizar Productos**: Verde (bg-green-600)
- **Eliminar Todos**: Rojo (bg-red-600)
- **Eliminar Individual**: Rojo (bg-red-500)

### Tabla:

- Hover effect en las filas
- Imágenes de 64x64px
- Responsive con scroll horizontal
- Bordes sutiles

---

## 🔧 Código Técnico

### Función para Eliminar Todos:

```javascript
const eliminarTodosProductos = async () => {
  if (!confirm('¿Estás seguro?')) return
  
  const { error } = await supabase
    .from('productos')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  
  if (!error) {
    setMensaje('✓ Todos los productos eliminados')
    obtenerProductos()
  }
}
```

### Función para Eliminar Individual:

```javascript
const eliminarProducto = async (id) => {
  if (!confirm('¿Estás seguro?')) return
  
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id)
  
  if (!error) {
    setMensaje('✓ Producto eliminado')
    obtenerProductos()
    setTimeout(() => setMensaje(''), 3000)
  }
}
```

---

## ✅ Pruebas

### Para Probar:

1. Inicia el servidor: `npm run dev`
2. Ve a http://localhost:5173/admin
3. Prueba eliminar un producto individual
4. Prueba eliminar todos los productos
5. Verifica que los productos desaparezcan del dashboard

---

## 📝 Notas

- Los productos eliminados NO se pueden recuperar
- Solo los administradores pueden eliminar productos
- Los usuarios normales solo pueden ver productos
- La eliminación es instantánea

---

## 🚀 Próximas Mejoras (Opcionales)

- [ ] Papelera de reciclaje (soft delete)
- [ ] Restaurar productos eliminados
- [ ] Eliminar múltiples productos seleccionados
- [ ] Exportar productos antes de eliminar
- [ ] Historial de eliminaciones

¡Listo! Ahora puedes gestionar completamente los productos. 🎉
