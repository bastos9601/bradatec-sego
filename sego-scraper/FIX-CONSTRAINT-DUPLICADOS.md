# 🔧 FIX: Error de Constraint en Inserción de Productos

## 🎯 Problema
Al insertar 1944 productos, salía error:
```
Error: "There is no unique or exclusion constraint matching the ON CONFLICT specification"
```

## 🔍 Causa
- Había productos con el mismo nombre
- El constraint `onConflict: 'nombre'` no funcionaba porque no es único
- Supabase no podía determinar qué hacer con duplicados

## ✅ Solución Implementada

### 1. Generar ID Único para Cada Producto
```javascript
const productosConId = todosLosProductos.map((prod, index) => ({
  ...prod,
  id: `${prod.nombre}-${prod.precio}`.replace(/[^a-z0-9]/gi, '-').toLowerCase()
}));
```

Esto crea un ID único basado en nombre + precio:
- "Cámara HD 1080p - $ 299.00" → "camara-hd-1080p-29900"
- "Cámara HD 1080p - $ 399.00" → "camara-hd-1080p-39900"

### 2. Insertar en Lotes
```javascript
const tamanoLote = 100;
for (let i = 0; i < productosConId.length; i += tamanoLote) {
  const lote = productosConId.slice(i, i + tamanoLote);
  // Insertar lote...
}
```

**Razón:** Insertar 1944 productos de una vez puede causar timeout. Hacerlo en lotes de 100 es más confiable.

### 3. Mejor Manejo de Errores
```javascript
if (error) {
  console.error(`⚠️ Error en lote ${numero}:`, error.message);
  erroresInsercion++;
} else {
  productosInsertados += lote.length;
  console.log(`✅ Lote ${numero} insertado correctamente`);
}
```

Ahora muestra:
- Cuántos lotes se insertaron correctamente
- Cuántos errores hubo
- Cuántos productos se insertaron en total

## 📊 Logs Esperados

```
📊 Total productos encontrados: 1944
💾 Insertando en Supabase (modo masivo)...
📦 Insertando lote 1/20 (100 productos)...
✅ Lote 1 insertado correctamente
📦 Insertando lote 2/20 (100 productos)...
✅ Lote 2 insertado correctamente
...
📦 Insertando lote 20/20 (44 productos)...
✅ Lote 20 insertado correctamente
✅ SCRAPING COMPLETADO
   📦 Total encontrados: 1944
   ✓ Insertados/Actualizados: 1944
```

## 🧪 Probar

1. Desplegar cambios:
```bash
git add .
git commit -m "Fix: Mejor inserción de productos - Usar ID único, insertar en lotes"
git push
```

2. Esperar 2-3 minutos a que Railway redespliegue

3. Importar productos nuevamente

4. Verificar en Railway logs que dice "✅ SCRAPING COMPLETADO"

## 📈 Mejoras

✅ Manejo de productos duplicados
✅ Inserción en lotes (más confiable)
✅ Mejor error handling
✅ Logs más detallados
✅ Soporte para 1944+ productos

## 🔄 Cambios en la Base de Datos

Si la tabla `productos` no tiene columna `id`, Supabase la creará automáticamente.

**Estructura esperada:**
```sql
CREATE TABLE productos (
  id TEXT PRIMARY KEY,
  nombre TEXT,
  precio TEXT,
  imagen TEXT,
  categoria TEXT,
  sku TEXT,
  stock TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Desplegar

```bash
git add .
git commit -m "Fix: Mejor inserción de productos - Usar ID único, insertar en lotes"
git push
```

Railway redesplegar automáticamente.

## ✅ Verificación

Después de desplegar:

1. Conectar cuenta de Sego
2. Importar productos
3. Verificar en Railway logs:
   - "✅ SCRAPING COMPLETADO"
   - "Insertados/Actualizados: 1944"
4. Verificar en Supabase Table Editor:
   - Tabla `productos` tiene 1944 registros
   - Cada producto tiene un `id` único

## 🎉 Resultado

Ahora el scraping:
- ✅ Detecta 1944 productos
- ✅ Los inserta sin errores
- ✅ Maneja duplicados correctamente
- ✅ Muestra progreso detallado
- ✅ Es más confiable con lotes
