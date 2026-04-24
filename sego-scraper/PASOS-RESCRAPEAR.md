# Pasos para Re-scrapear con SKU y Stock

## Problema Actual
Los productos en la base de datos tienen `sku` y `stock` vacíos porque fueron scrapeados con la versión antigua del código.

## ✅ Solución: Re-scrapear

### Paso 1: Eliminar productos existentes

Desde el Admin panel:
1. Ve a http://localhost:5173/admin
2. Haz clic en "🗑️ Eliminar Todos"
3. Confirma la eliminación

O desde Supabase SQL Editor:
```sql
DELETE FROM productos;
```

### Paso 2: Ejecutar el scraper actualizado

```bash
npm run scrape
```

**Importante:**
1. Se abrirá el navegador en la página de login de Sego
2. **Inicia sesión manualmente** con tus credenciales
3. Espera a que el script detecte la sesión (verás "✅ Sesión iniciada")
4. El scraper comenzará automáticamente

### Paso 3: Verificar resultados

Los productos ahora deberían tener:
- ✅ Nombre
- ✅ Precio con IGV ($ XX.XX)
- ✅ SKU (código del producto)
- ✅ Stock (badge de disponibilidad)
- ✅ Categoría
- ✅ Imagen

## 🔍 Verificar en Supabase

```sql
SELECT nombre, precio, sku, stock, categoria 
FROM productos 
WHERE sku IS NOT NULL AND sku != ''
LIMIT 10;
```

Si ves productos con SKU y stock, ¡funcionó! 🎉

## ⚠️ Nota sobre SKU y Stock

No todos los productos en Sego tienen SKU o stock visible:
- Si el producto no tiene SKU en la página, el campo quedará vacío ('')
- Si el producto no tiene badge de stock, el campo quedará vacío ('')
- Esto es normal y esperado

## 🚀 Alternativa: Usar el servidor backend

Si prefieres usar el botón desde el Admin panel:

1. Inicia el servidor:
```bash
npm run server
```

2. Inicia la app:
```bash
npm run dev
```

3. Ve a Admin → "📦 Importar Productos Sego"
4. Inicia sesión manualmente cuando se abra el navegador
5. El scraping continuará automáticamente con progreso en tiempo real
