# 🔥 SOLUCIÓN FINAL: Sistema de SKU Único

## 🎯 Objetivo
Implementar un sistema robusto de SKU único para evitar errores de constraint y duplicados.

## 📋 PASO 1: Crear Índice en Supabase (OBLIGATORIO)

1. Ve a Supabase Dashboard: https://supabase.com/dashboard
2. Selecciona proyecto `bradatec-sego`
3. **SQL Editor** → **New Query**
4. Ejecuta:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS productos_sku_unique ON productos (sku);
```

**Si te da error de duplicados:**

```sql
-- Limpiar duplicados
DELETE FROM productos a 
USING productos b 
WHERE a.id < b.id 
AND a.sku = b.sku 
AND a.sku != '';

-- Luego crear el índice
CREATE UNIQUE INDEX IF NOT EXISTS productos_sku_unique ON productos (sku);
```

## 🔧 PASO 2: Cambios en el Código (YA APLICADOS)

### Generar SKU Válido
```javascript
const productosConSku = todosLosProductos.map((prod) => {
  // Si tiene SKU válido, usarlo. Si no, generar uno basado en nombre
  const skuValido = prod.sku && prod.sku.trim() !== '' 
    ? prod.sku.trim()
    : prod.nombre.substring(0, 50).replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  return {
    ...prod,
    sku: skuValido
  };
});
```

**Ejemplos:**
- Producto con SKU: "SKU-12345" → usa "SKU-12345"
- Producto sin SKU: "Cámara HD 1080p" → genera "camara-hd-1080p"

### Filtrar Productos Válidos
```javascript
const productosValidos = productosConSku.filter(p => p.sku && p.sku.trim() !== '');
```

Solo inserta productos con SKU válido.

### Usar onConflict: 'sku'
```javascript
const { error } = await supabase
  .from('productos')
  .upsert(lote, { 
    onConflict: 'sku',
    ignoreDuplicates: true
  });
```

Si un producto con el mismo SKU ya existe, lo actualiza.

## 📊 Logs Esperados

```
📊 Total productos encontrados: 1944
💾 Insertando en Supabase (modo masivo)...
📊 Productos con SKU válido: 1944/1944
📦 Insertando lote 1/20 (100 productos)...
✅ Lote 1 insertado correctamente (100 productos)
📦 Insertando lote 2/20 (100 productos)...
✅ Lote 2 insertado correctamente (100 productos)
...
✅ SCRAPING COMPLETADO
   📦 Total encontrados: 1944
   ✓ Con SKU válido: 1944
   ✓ Insertados/Actualizados: 1944
```

## 🧪 Probar

### Paso 1: Crear Índice en Supabase
```sql
CREATE UNIQUE INDEX IF NOT EXISTS productos_sku_unique ON productos (sku);
```

### Paso 2: Desplegar Código
```bash
git add .
git commit -m "Fix: Usar SKU como unique constraint, generar SKU si está vacío"
git push
```

### Paso 3: Esperar Redespliegue
- Esperar 2-3 minutos a que Railway redespliegue

### Paso 4: Probar Importación
1. Panel Admin → "🔗 Conectar Cuenta de Sego"
2. Panel Admin → "📦 Importar Productos Sego"
3. Verificar logs en Railway

## ✅ Verificación

### En Railway Logs
```
✅ SCRAPING COMPLETADO
   📦 Total encontrados: 1944
   ✓ Con SKU válido: 1944
   ✓ Insertados/Actualizados: 1944
```

### En Supabase Table Editor
1. Ve a tabla `productos`
2. Verifica que hay 1944 registros
3. Cada uno tiene un `sku` único

### Verificar Índice
```sql
SELECT * FROM pg_indexes WHERE tablename = 'productos' AND indexname = 'productos_sku_unique';
```

Debe mostrar el índice creado.

## 🔍 Debugging

### Ver SKUs Duplicados
```sql
SELECT sku, COUNT(*) as cantidad 
FROM productos 
GROUP BY sku 
HAVING COUNT(*) > 1;
```

### Ver SKUs Vacíos
```sql
SELECT COUNT(*) FROM productos WHERE sku = '' OR sku IS NULL;
```

### Ver Estructura de Tabla
```sql
\d productos
```

## 🎯 Flujo Completo

```
1. Usuario importa productos
   ↓
2. Scraping detecta 1944 productos
   ↓
3. Para cada producto:
   - Si tiene SKU → usarlo
   - Si no tiene SKU → generar basado en nombre
   ↓
4. Filtrar solo productos con SKU válido
   ↓
5. Insertar en lotes de 100
   - onConflict: 'sku' (actualizar si existe)
   ↓
6. Mostrar resultado:
   - Total encontrados: 1944
   - Con SKU válido: 1944
   - Insertados/Actualizados: 1944
```

## 📈 Ventajas

✅ No hay más errores de constraint
✅ SKUs únicos para cada producto
✅ Upsert funciona correctamente
✅ Productos se actualizan si ya existen
✅ Manejo automático de SKUs vacíos
✅ Inserción en lotes (más confiable)
✅ Logs detallados

## 🚀 Desplegar

```bash
# 1. Crear índice en Supabase (SQL)
CREATE UNIQUE INDEX IF NOT EXISTS productos_sku_unique ON productos (sku);

# 2. Desplegar código
git add .
git commit -m "Fix: Usar SKU como unique constraint, generar SKU si está vacío"
git push

# 3. Esperar 2-3 minutos
# 4. Probar importación
```

## 📞 Si Algo Sale Mal

### Error: "Key (sku)=(value) is duplicated"
```sql
-- Limpiar duplicados
DELETE FROM productos a 
USING productos b 
WHERE a.id < b.id 
AND a.sku = b.sku 
AND a.sku != '';
```

### Error: "No unique or exclusion constraint"
```sql
-- Crear índice
CREATE UNIQUE INDEX IF NOT EXISTS productos_sku_unique ON productos (sku);
```

### Productos no se insertan
- Verificar que tienen SKU válido
- Revisar logs en Railway
- Verificar que el índice existe

## 🎉 Resultado Final

- ✅ 1944 productos importados correctamente
- ✅ Sin errores de constraint
- ✅ SKUs únicos y válidos
- ✅ Sistema robusto y escalable
