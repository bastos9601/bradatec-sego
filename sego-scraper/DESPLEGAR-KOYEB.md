# 🚀 Desplegar en Koyeb con Puppeteer

Koyeb es una excelente alternativa a Render con mejor soporte para Puppeteer.

## ✅ Ventajas de Koyeb

- ✅ **Plan gratuito permanente** (no solo créditos)
- ✅ **Chromium preinstalado** en las imágenes Docker
- ✅ **No se duerme** (siempre activo)
- ✅ **Despliegue desde GitHub** automático
- ✅ **Más memoria** que Render (512 MB - 2 GB)
- ✅ **Sin tarjeta de crédito** requerida

## 📋 Pasos para desplegar

### 1. Crear cuenta
- Ve a https://www.koyeb.com
- Regístrate con GitHub (gratis, sin tarjeta)

### 2. Crear nueva aplicación
1. Haz clic en "Create App"
2. Selecciona "GitHub" como fuente
3. Conecta tu repositorio: `bastos9601/bradatec-sego`
4. Autoriza Koyeb en GitHub

### 3. Configurar el servicio

**Builder**: Docker

**Dockerfile path**: Déjalo vacío (usaremos Buildpack)

**Build command**:
```bash
npm install
```

**Run command**:
```bash
node server.js
```

**Port**: 3001 (o usa variable PORT)

**Working directory**: `sego-scraper`

### 4. Variables de entorno

Agrega estas variables:

```
NODE_VERSION=20
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
```

### 5. Seleccionar región
- Elige "Frankfurt" o "Washington" (más cercano a Perú)

### 6. Desplegar
- Haz clic en "Deploy"
- Espera 3-5 minutos

### 7. Obtener URL
Una vez desplegado, verás la URL pública:
```
https://tu-app.koyeb.app
```

### 8. Actualizar frontend
En `Admin.jsx`, cambia la URL:
```javascript
const response = await fetch('https://tu-app.koyeb.app/api/scrape', {
```

## 🔧 Configuración adicional para Puppeteer

Koyeb usa contenedores Docker, así que necesitamos asegurarnos de que Puppeteer funcione.

El `server.js` ya tiene la configuración correcta:
```javascript
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ]
});
```

## ✅ Verificar que funciona

1. Visita tu URL: `https://tu-app.koyeb.app/`
   - Deberías ver: `{"status":"ok",...}`

2. Revisa los logs en Koyeb dashboard

3. Prueba el scraping desde tu panel admin

## 🆚 Koyeb vs Render vs Railway

| Característica | Koyeb | Render | Railway |
|---------------|-------|--------|---------|
| **Precio** | Gratis permanente | Gratis | $5 crédito/mes |
| **Chromium** | ✅ Preinstalado | ❌ Manual | ✅ Preinstalado |
| **Se duerme** | ❌ No | ✅ Sí (15 min) | ❌ No |
| **Memoria** | 512 MB - 2 GB | 512 MB | 512 MB |
| **Tarjeta** | ❌ No requiere | ❌ No requiere | ❌ No requiere |
| **Dificultad** | ⭐ Fácil | ⭐⭐⭐ Difícil | ⭐ Fácil |

## 🎯 Recomendación

**Koyeb es excelente para tu caso** porque:
- Plan gratuito permanente (no solo créditos)
- No se duerme (siempre disponible)
- Chromium funciona sin configuración extra
- Más memoria que Render

## 🐛 Troubleshooting

### Si el scraping falla:

1. **Revisa los logs** en Koyeb dashboard
2. **Verifica la memoria**: Si usa más de 512 MB, actualiza el plan
3. **Aumenta timeout**: El scraping puede tardar varios minutos

### Error común: "Failed to launch browser"

Solución: Asegúrate de que `server.js` tenga estos args:
```javascript
args: [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu'
]
```

Ya está configurado en tu `server.js` ✅

## 📚 Recursos

- Dashboard: https://app.koyeb.com
- Documentación: https://www.koyeb.com/docs
- Soporte: https://www.koyeb.com/support
