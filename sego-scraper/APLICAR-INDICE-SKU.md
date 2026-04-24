# 🔥 SOLUCIÓN: Crear Índice Único en SKU

## 🎯 Objetivo
Crear un índice único en la columna `sku` para evitar duplicados y mejorar el upsert.

## 📋 PASO 1: Ejecutar SQL en Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto `bradatec-sego`
3. Ve a **SQL Editor** → **New Query**
4. Copia y pega esto:

```sql
-- Crear índice único en SKU
CREATE UNIQUE INDEX IF NOT EXISTS productos_sku_unique ON productos (sku);
```

5. Haz clic en **Run** (o Ctrl+Enter)

## ⚠️ SI TE DA ERROR

Si ves error como:
```
ERROR: could not create unique index "productos_sku_unique"
DETAIL: Key (sku)=(some_value) is duplicated.
```

Significa que tienes SKUs duplicados. Sigue estos pasos:

### Paso 1: Limpiar Duplicados

```sql
-- Eliminar productos duplicados (mantener el más reciente)
DELETE FROM productos a 
USING productos b 
WHERE a.id < b.id 
AND a.sku = b.sku 
AND a.sku != '';
```

### Paso 2: Limpiar SKUs Vacíos

```sql
-- Ver cuántos productos tienen SKU vacío
SELECT COUNT(*) FROM productos WHERE sku = '' OR sku IS NULL;

-- Si hay muchos, puedes eliminarlos o generar SKU
-- Opción 1: Eliminar
DELETE FROM productos WHERE sku = '' OR sku IS NULL;

-- Opción 2: Generar SKU basado en nombre
UPDATE productos 
SET sku = SUBSTRING(REPLACE(LOWER(nombre), ' ', '-'), 1, 50)
WHERE sku = '' OR sku IS NULL;
```

### Paso 3: Crear el Índice

```sql
CREATE UNIQUE INDEX IF NOT EXISTS productos_sku_unique ON productos (sku);
```

## ✅ VERIFICAR QUE FUNCIONÓ

```sql
-- Ver el índice creado
SELECT * FROM pg_indexes WHERE tablename = 'productos';

-- Debe mostrar: productos_sku_unique
```

## 🔧 PASO 2: Modificar Código

El código ya está modificado para:
1. Generar SKU si está vacío
2. Usar `onConflict: 'sku'` en lugar de `onConflict: 'id'`
3. Filtrar productos sin SKU válido

## 📊 Cambios en server.js

```javascript
// Generar SKU si está vacío
const productosConSku = todosLosProductos.map(prod => ({
  ...prod,
  sku: prod.sku && prod.sku.trim() !== '' 
    ? prod.sku 
    : prod.nombre.substring(0, 50).replace(/[^a-z0-9]/gi, '-').toLowerCase()
}));

// Filtrar productos con SKU válido
const productosValidos = productosConSku.filter(p => p.sku && p.sku.trim() !== '');

// Insertar con onConflict: 'sku'
const { error } = await supabase
  .from('productos')
  .upsert(lote, { 
    onConflict: 'sku',
    ignoreDuplicates: true
  });
```

## 🧪 Probar

1. Ejecutar SQL en Supabase (crear índice)
2. Desplegar código:
```bash
git add .
git commit -m "Fix: Usar SKU como unique constraint, generar SKU si está vacío"
git push
```
3. Esperar 2-3 minutos
4. Importar productos nuevamente
5. Verificar en Railway logs: "✅ SCRAPING COMPLETADO"

## 📈 Resultado

- ✅ No hay más errores de constraint
- ✅ SKUs únicos para cada producto
- ✅ Upsert funciona correctamente
- ✅ Productos se actualizan si ya existen

## 🔍 Debugging

Si aún hay errores:

```sql
-- Ver productos con SKU duplicado
SELECT sku, COUNT(*) as cantidad 
FROM productos 
GROUP BY sku 
HAVING COUNT(*) > 1;

-- Ver productos con SKU vacío
SELECT COUNT(*) FROM productos WHERE sku = '' OR sku IS NULL;

-- Ver estructura de la tabla
\d productos
```

## 📞 Próximos Pasos

1. ✅ Ejecutar SQL para crear índice
2. ✅ Desplegar código
3. ✅ Probar importación
4. ✅ Verificar que funciona
