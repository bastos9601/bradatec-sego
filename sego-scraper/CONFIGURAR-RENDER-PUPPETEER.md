# 🔧 Configurar Render para Puppeteer

Render necesita configuración especial para ejecutar Puppeteer.

## Opción A: Usar archivo render.yaml (Recomendado)

Ya creé el archivo `render.yaml` en la raíz de `sego-scraper/`.

### Pasos:

1. **Elimina el servicio actual en Render**:
   - Ve a tu dashboard de Render
   - Selecciona "bradatec-sego"
   - Settings → Delete Service

2. **Crea nuevo servicio desde render.yaml**:
   - En Render dashboard, haz clic en "New +"
   - Selecciona "Blueprint"
   - Conecta tu repositorio GitHub
   - Render detectará automáticamente `render.yaml`
   - Haz clic en "Apply"

3. **Espera el despliegue**:
   - Render instalará Chromium automáticamente
   - Puede tardar 5-10 minutos la primera vez

## Opción B: Configuración manual

Si prefieres configurar manualmente:

### 1. En Render Dashboard → Settings:

**Build Command**:
```bash
npm install && npx puppeteer browsers install chrome
```

**Start Command**:
```bash
node server.js
```

### 2. Variables de entorno:

Agrega estas variables en Settings → Environment:

```
NODE_VERSION=20.19.0
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
```

### 3. Actualizar server.js

El archivo `server.js` ya está configurado con los argumentos correctos para Render:
```javascript
args: [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu'
]
```

## Verificar instalación

1. Ve a Logs en Render
2. Busca líneas como:
   ```
   Installing Chromium...
   Chromium downloaded to /opt/render/.cache/puppeteer
   ```

3. Prueba el endpoint:
   ```
   curl https://bradatec-sego.onrender.com/
   ```

## Limitaciones de Render Free Tier

⚠️ **Importante**: El plan gratuito de Render tiene limitaciones:

- **Memoria**: 512 MB (Puppeteer usa ~200-300 MB)
- **CPU**: Compartida (puede ser lento)
- **Timeout**: 30 segundos para requests HTTP
- **Sleep**: El servicio se duerme después de 15 min de inactividad

**Problema**: El scraping completo puede tardar varios minutos, lo que puede causar timeouts.

## Solución al timeout

Modifica `server.js` para que el scraping sea asíncrono:

El código actual ya hace esto:
```javascript
// Responder inmediatamente
res.json({ message: 'Scraping iniciado' });

// Ejecutar scraping en background
ejecutarScraping().catch(error => {
  console.error('Error en scraping:', error);
});
```

Esto permite que el request HTTP termine rápido, mientras el scraping continúa en background.

## Recomendación

Si Render sigue dando problemas, **Railway es mejor opción** porque:
- Tiene Chromium preinstalado
- Mejor soporte para Puppeteer
- Configuración más simple
- Plan gratuito más generoso ($5/mes de crédito)

Ver: `DESPLEGAR-RAILWAY.md`
