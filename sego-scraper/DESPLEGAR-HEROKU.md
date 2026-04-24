# 🟣 Desplegar en Heroku con Puppeteer

Heroku es una plataforma clásica y muy confiable.

## ⚠️ Importante: Ya no tiene plan gratuito

Desde noviembre 2022, Heroku eliminó su plan gratuito.

**Precio mínimo**: $5/mes (Eco Dynos)

## ✅ Ventajas de Heroku

- ✅ **Muy estable y confiable**
- ✅ **Excelente documentación**
- ✅ **Buildpacks para Puppeteer** bien mantenidos
- ✅ **Fácil de configurar**
- ✅ **No se duerme** (en planes pagos)

## 📋 Pasos para desplegar

### 1. Crear cuenta
- Ve a https://www.heroku.com
- Regístrate (requiere tarjeta de crédito)
- Plan Eco: $5/mes

### 2. Instalar Heroku CLI
```bash
# Windows (con Chocolatey)
choco install heroku-cli

# O descarga desde: https://devcenter.heroku.com/articles/heroku-cli
```

### 3. Login
```bash
heroku login
```

### 4. Crear aplicación
```bash
cd sego-scraper
heroku create bradatec-sego
```

### 5. Agregar buildpacks para Puppeteer

Heroku necesita buildpacks especiales para Chromium:

```bash
heroku buildpacks:add --index 1 https://github.com/jontewks/puppeteer-heroku-buildpack
heroku buildpacks:add --index 2 heroku/nodejs
```

### 6. Configurar variables de entorno
```bash
heroku config:set NODE_ENV=production
heroku config:set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
heroku config:set PUPPETEER_EXECUTABLE_PATH=/app/.apt/usr/bin/google-chrome-stable
```

### 7. Crear Procfile

Crear archivo `Procfile` en `sego-scraper/`:
```
web: node server.js
```

### 8. Desplegar
```bash
git add .
git commit -m "Configure for Heroku"
git push heroku main
```

### 9. Verificar
```bash
heroku open
heroku logs --tail
```

## 🔧 Configuración de server.js para Heroku

El `server.js` ya tiene la configuración correcta:

```javascript
const PORT = process.env.PORT || 3001;

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

## 💰 Costos

- **Eco Dynos**: $5/mes
  - 512 MB RAM
  - Se duerme después de 30 min de inactividad
  
- **Basic Dynos**: $7/mes
  - 512 MB RAM
  - No se duerme
  
- **Standard Dynos**: $25/mes
  - 1 GB RAM
  - No se duerme
  - Mejor rendimiento

## 🆚 Heroku vs Alternativas gratuitas

| Característica | Heroku | Koyeb | Railway |
|---------------|--------|-------|---------|
| **Precio** | $5/mes | Gratis | $5 crédito/mes |
| **Chromium** | ✅ Buildpack | ✅ Preinstalado | ✅ Preinstalado |
| **Estabilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Documentación** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Soporte** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🎯 Recomendación

**Heroku es excelente SI**:
- Puedes pagar $5-7/mes
- Necesitas máxima estabilidad
- Quieres soporte profesional

**Pero para tu caso, mejor usar**:
- **Koyeb**: Gratis permanente, no se duerme
- **Railway**: $5 gratis/mes, muy fácil

## 📚 Recursos

- Documentación: https://devcenter.heroku.com/articles/puppeteer
- Buildpack: https://github.com/jontewks/puppeteer-heroku-buildpack
- Pricing: https://www.heroku.com/pricing
