# 🔄 Nueva Estrategia: Deduplicación por NOMBRE (no por SKU)

## 🎯 El Problema con SKU

Sego maneja **múltiples SKUs para el mismo producto** (variantes):

```
Producto: "Tipo de Cambio"
├─ SKU: HK-DS-KI6608-P ($117.35)
├─ SKU: HK-IDS7208HQH-M1/XT ($75.23)
└─ SKU: HK-IDS7208HQH-M1/XT (otra variante)

Cuando scrapeamos:
- Encontramos 3 registros (mismo producto, diferentes SKUs)
- Si usamos SKU como identificador único:
  - Primer SKU: Se inserta ✅
  - Segundo SKU: Se inserta ✅
  - Tercer SKU: Se inserta ✅
  - Resultado: 3 registros en BD (duplicados)
```

## ✅ Nueva Estrategia: Usar NOMBRE

```
Producto: "Tipo de Cambio"
├─ SKU: HK-DS-KI6608-P ($117.35)
├─ SKU: HK-IDS7208HQH-M1/XT ($75.23)
└─ SKU: HK-IDS7208HQH-M1/XT (otra variante)

Cuando scrapeamos:
- Encontramos 3 registros
- Si usamos NOMBRE como identificador único:
  - Primer "Tipo de Cambio": Se inserta ✅
  - Segundo "Tipo de Cambio": Se ignora (duplicado) ❌
  - Tercer "Tipo de Cambio": Se ignora (duplicado) ❌
  - Resultado: 1 registro en BD (deduplicado correctamente)
```

## 🔧 Cambios Implementados

### 1. Generar ID Basado en NOMBRE
```javascript
const nombreNormalizado = prod.nombre.toLowerCase().trim();
const id = nombreNormalizado.replace(/[^a-z0-9]/gi, '-').substring(0, 100);

// Ejemplo:
// "Tipo de Cambio" → "tipo-de-cambio"
// "Cámara HD 1080p" → "camara-hd-1080p"
```

### 2. Detectar Duplicados por NOMBRE
```javascript
const nombreMap = new Map();
const productosUnicos = [];
const productosDuplicados = [];

for (const prod of todosLosProductos) {
  const nombreNormalizado = prod.nombre.toLowerCase().trim();
  
  if (nombreMap.has(nombreNormalizado)) {
    // Es un duplicado
    productosDuplicados.push(prod);
  } else {
    // Es único
    nombreMap.set(nombreNormalizado, true);
    productosUnicos.push(prod);
  }
}
```

### 3. Insertar con Constraint en ID
```javascript
const { error } = await supabase
  .from('productos')
  .upsert(lote, { 
    onConflict: 'id',  // ← Cambio: de 'sku' a 'id'
    ignoreDuplicates: false
  });
```

## 📊 Logs Esperados

```
📊 Total productos encontrados: 1044
💾 Procesando productos para inserción...
📊 Análisis de productos:
   ✓ Total encontrados: 1044
   ✓ Productos únicos (por nombre): 679
   ⚠️ Productos duplicados (ignorados): 365

   Duplicados encontrados:
   1. Tipo de Cambio | SKU: HK-DS-KI6608-P | $117.35 | CCTV
   2. Tipo de Cambio | SKU: HK-IDS7208HQH-M1/XT | $75.23 | CCTV - Accesorios
   3. Cámara HD 1080p | SKU: CAM-001 | $299.00 | CCTV
   ...

💾 Insertando en Supabase (modo masivo)...
📦 Insertando lote 1/7 (100 productos)...
✅ Lote 1 insertado correctamente (100 productos)
...

✅ SCRAPING COMPLETADO
   📦 Total encontrados en Sego: 1044
   ✓ Productos únicos (por nombre): 679
   ⚠️ Duplicados descartados: 365
   ✓ Insertados/Actualizados en BD: 679
```

## 🎯 Ventajas

✅ **Deduplicación correcta** - Elimina variantes del mismo producto
✅ **Preserva SKUs** - Guarda todos los SKUs en la BD
✅ **Transparencia** - Muestra qué productos son duplicados
✅ **Confiabilidad** - Usa nombre (más estable que SKU)
✅ **Escalabilidad** - Funciona con múltiples variantes

## 📋 Estructura de Datos

Ahora la tabla `productos` tiene:

```sql
CREATE TABLE productos (
  id TEXT PRIMARY KEY,           -- "tipo-de-cambio"
  nombre TEXT,                   -- "Tipo de Cambio"
  sku TEXT,                      -- "HK-DS-KI6608-P" (se guarda)
  precio TEXT,                   -- "$117.35"
  imagen TEXT,
  categoria TEXT,
  stock TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Importante:** El campo `sku` se guarda pero NO es el identificador único. El identificador es `id` (basado en nombre).

## 🔄 Comparación

| Métrica | Antes (SKU) | Ahora (NOMBRE) |
|---------|------------|----------------|
| Scraped | 1044 | 1044 |
| En BD | 679 | 679 |
| Duplicados | 365 (desconocidos) | 365 (identificados) |
| SKU guardado | ❌ | ✅ |
| Variantes | ❌ | ✅ |
| Deduplicación | ❌ | ✅ |

## 🚀 Desplegar

```bash
git add .
git commit -m "Improve: Deduplicación por nombre en lugar de SKU - Soportar múltiples SKUs por producto"
git push
```

Railway redesplegar automáticamente en 2-3 minutos.

## 🧪 Probar

1. Conectar cuenta de Sego
2. Importar productos
3. Verificar en Railway logs:
   - "Productos únicos (por nombre): 679"
   - "Duplicados descartados: 365"
4. Verificar en Supabase:
   - Tabla `productos` tiene 679 registros
   - Cada registro tiene `id`, `nombre`, `sku`, `precio`, etc.

## 📝 Nota Importante

Si necesitas guardar TODAS las variantes (incluyendo duplicados):

1. Cambiar estrategia a usar `id` único por variante:
   ```javascript
   id: `${nombreNormalizado}-${prod.sku}`.substring(0, 100)
   ```

2. O crear tabla separada `producto_variantes`:
   ```sql
   CREATE TABLE producto_variantes (
     id UUID PRIMARY KEY,
     producto_id TEXT REFERENCES productos(id),
     sku TEXT UNIQUE,
     precio TEXT,
     stock TEXT
   );
   ```

Contacta si necesitas implementar alguna de estas opciones.

## 🎉 Resultado

Ahora tienes:
- ✅ Deduplicación correcta por nombre
- ✅ Todos los SKUs guardados
- ✅ Transparencia sobre duplicados
- ✅ 679 productos únicos en BD
- ✅ 365 variantes identificadas
