# Debug: Scraping en Render no funciona

## Problema
El scraping se completa pero inserta 0 productos.

## Posibles causas

### 1. Puppeteer no puede ejecutarse en Render
Render necesita dependencias adicionales para ejecutar Puppeteer (navegador Chrome).

**Solución**: Agregar buildpack de Puppeteer en Render

### 2. Login automático falla
Las credenciales pueden no estar funcionando o el selector del formulario cambió.

**Solución**: Verificar logs en Render para ver errores de login

### 3. Timeout o errores de red
El servidor puede estar tardando demasiado y Render lo mata.

**Solución**: Aumentar timeout o usar un servicio diferente

## Cómo verificar logs en Render

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio "bradatec-sego"
3. Haz clic en la pestaña "Logs"
4. Busca errores cuando hagas clic en "Importar Productos Sego"

## Solución recomendada: Usar Puppeteer en modo local

Como Render tiene limitaciones con Puppeteer, la mejor opción es:

1. **Ejecutar el scraping localmente** cuando necesites actualizar productos
2. **Mantener el servidor en Render solo como API** (sin scraping)

### Opción A: Scraping local con script separado

Ya tienes `scraper-local.js` que puedes ejecutar en tu computadora:

```bash
cd sego-scraper
node scraper-local.js
```

Este script:
- Abre el navegador en tu computadora
- Te permite hacer login manualmente
- Scrapea todos los productos
- Los inserta directamente en Supabase

### Opción B: Usar servicio especializado

Servicios como **Apify** o **ScrapingBee** están optimizados para scraping con Puppeteer.

## Configuración de Puppeteer para Render

Si quieres intentar que funcione en Render, necesitas:

1. **Agregar dependencias del sistema** en Render:
   - Ve a Settings → Environment
   - Agrega estas variables:
   ```
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   ```

2. **Agregar buildpack de Chrome**:
   - En Settings → Build & Deploy
   - Agrega: `https://github.com/jontewks/puppeteer-heroku-buildpack`

3. **Instalar dependencias adicionales**:
   Crear archivo `render.yaml`:
   ```yaml
   services:
     - type: web
       name: bradatec-sego
       env: node
       buildCommand: npm install && apt-get update && apt-get install -y chromium
       startCommand: node server.js
   ```

## Recomendación final

**Para tu caso, lo más práctico es:**

1. Mantener el servidor en Render solo como API (sin scraping)
2. Ejecutar `scraper-local.js` en tu computadora cuando necesites actualizar productos
3. Esto te da control total y evita problemas de Puppeteer en servidores

¿Quieres que configure el sistema para que uses el scraping local?
