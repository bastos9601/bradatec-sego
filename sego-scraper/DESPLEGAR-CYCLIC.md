# ⚡ Desplegar en Cyclic con Puppeteer

Cyclic es una plataforma serverless muy fácil de usar.

## ⚠️ Limitación importante

Cyclic usa AWS Lambda, que tiene limitaciones para Puppeteer:
- Tamaño máximo de deployment: 250 MB
- Chromium comprimido: ~50 MB
- **Solución**: Usar `chrome-aws-lambda` en lugar de `puppeteer`

## 📦 Configuración necesaria

### 1. Instalar chrome-aws-lambda

```bash
cd sego-scraper
npm install chrome-aws-lambda puppeteer-core
```

### 2. Modificar server.js

Reemplazar:
```javascript
import puppeteer from 'puppeteer';
```

Por:
```javascript
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
```

Y cambiar el launch:
```javascript
const browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});
```

## 🚀 Pasos para desplegar

### 1. Crear cuenta
- Ve a https://www.cyclic.sh
- Regístrate con GitHub (gratis)

### 2. Conectar repositorio
1. Haz clic en "Link Your Own"
2. Selecciona tu repositorio
3. Cyclic detectará automáticamente Node.js

### 3. Configurar
- Root Directory: `sego-scraper`
- Build Command: `npm install`
- Start Command: `node server.js`

### 4. Desplegar
- Cyclic desplegará automáticamente
- Obtendrás una URL: `https://tu-app.cyclic.app`

## ⚠️ Limitaciones

- **Timeout**: 10 segundos para requests HTTP
- **Memoria**: 1 GB
- **Ejecución**: Máximo 15 minutos

**Problema**: El scraping completo puede tardar más de 10 segundos, causando timeout en el request HTTP.

**Solución**: Ya implementada en `server.js` - el scraping se ejecuta en background.

## 🎯 Recomendación

Cyclic NO es ideal para scraping pesado con Puppeteer debido a:
- Limitaciones de AWS Lambda
- Timeouts cortos
- Configuración más compleja

**Mejor usar**: Koyeb o Railway
