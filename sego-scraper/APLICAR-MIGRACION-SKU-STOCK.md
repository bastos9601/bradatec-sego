# Aplicar Migración: SKU y Stock

## ✅ Cambios Realizados

1. **Base de datos**: Agregadas columnas `sku` y `stock` a la tabla `productos`
2. **Scraper local**: Actualizado para extraer precio con IGV, SKU y stock
3. **Scraper servidor**: Ya tenía la lógica correcta de precio con IGV, SKU y stock

## 📋 Pasos para Aplicar la Migración

### Opción 1: Desde Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en https://supabase.com
2. Navega a **SQL Editor**
3. Copia y pega el contenido de `supabase/migration-add-sku-stock.sql`
4. Ejecuta el SQL

### Opción 2: Desde Supabase CLI

```bash
# Si tienes Supabase CLI instalado
supabase db push
```

## 🧪 Probar el Scraper

### Scraper Local (Recomendado para pruebas)

```bash
npm run scrape
```

**Pasos:**
1. Se abrirá el navegador en la página de login de Sego
2. Inicia sesión manualmente con tus credenciales
3. Espera a que el script detecte la sesión
4. El scraper comenzará automáticamente

### Scraper desde Admin Panel

1. Inicia el servidor backend:
```bash
npm run server
```

2. Abre la aplicación web:
```bash
npm run dev
```

3. Ve a la página de Admin
4. Haz clic en "📦 Importar Productos Sego"
5. Inicia sesión manualmente cuando se abra el navegador
6. El scraping continuará automáticamente

## 🔍 Qué Extrae Ahora

Cada producto incluye:
- **Nombre**: Título del producto
- **Precio con IGV**: El precio final que ve el cliente (selector: `.fw-bold.m-0.inline-block`)
- **SKU**: Código del producto (selector: `.text-muted` con texto "SKU:")
- **Stock**: Badge de disponibilidad (selector: `.tp-product-badge`)
- **Imagen**: URL de la imagen del producto
- **Categoría**: Categoría asignada según la URL scrapeada

## ⚠️ Notas Importantes

- El precio extraído es el **precio CON IGV** (el segundo precio que aparece)
- Si no encuentra el precio con IGV, usa el precio base como fallback
- SKU y stock pueden estar vacíos si no están disponibles en la página
- El scraping requiere login manual para ver los precios

## 📊 Verificar Resultados

Después del scraping, verifica en Supabase:

```sql
SELECT nombre, precio, sku, stock, categoria 
FROM productos 
LIMIT 10;
```

Deberías ver productos con todos los campos poblados.
