# 🚂 Desplegar en Railway con Puppeteer

Railway tiene mejor soporte para Puppeteer que Render.

## Pasos para desplegar en Railway

### 1. Crear cuenta en Railway
- Ve a https://railway.app
- Regístrate con GitHub (gratis)
- Plan gratuito: $5 de crédito mensual

### 2. Crear nuevo proyecto
1. Haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio: `bastos9601/bradatec-sego`
4. Railway detectará automáticamente que es Node.js

### 3. Configurar variables de entorno
En el dashboard de Railway, ve a "Variables" y agrega:

```
NODE_ENV=production
```

### 4. Configurar Root Directory
1. Ve a "Settings"
2. En "Root Directory" pon: `sego-scraper`
3. Guarda los cambios

### 5. Desplegar
Railway desplegará automáticamente. Espera unos minutos.

### 6. Obtener URL
1. Ve a "Settings" → "Networking"
2. Haz clic en "Generate Domain"
3. Copia la URL (ejemplo: `bradatec-sego.up.railway.app`)

### 7. Actualizar frontend
Actualiza la URL en `Admin.jsx`:
```javascript
const response = await fetch('https://TU-URL.up.railway.app/api/scrape', {
```

## Ventajas de Railway vs Render

✅ **Mejor soporte para Puppeteer**: Chromium preinstalado
✅ **Más fácil de configurar**: Detecta automáticamente
✅ **Logs en tiempo real**: Mejor debugging
✅ **Plan gratuito generoso**: $5/mes de crédito

## Verificar que funciona

1. Visita: `https://TU-URL.up.railway.app/`
   - Deberías ver: `{"status":"ok","message":"Servidor funcionando..."}`

2. Prueba el scraping desde tu panel admin

## Troubleshooting

Si el scraping falla:
1. Revisa los logs en Railway
2. Verifica que `nixpacks.toml` esté en la raíz de `sego-scraper/`
3. Asegúrate de que el Root Directory esté configurado correctamente
