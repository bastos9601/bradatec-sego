# ✨ Desplegar en Glitch con Puppeteer

Glitch es una plataforma muy fácil de usar, ideal para prototipos.

## ⚠️ Limitaciones importantes

- **Memoria**: 512 MB (puede ser insuficiente para Puppeteer)
- **Disco**: 200 MB (Chromium ocupa ~150 MB)
- **Se duerme**: Después de 5 minutos de inactividad
- **Puppeteer**: Requiere configuración especial

## 📋 Pasos para desplegar

### 1. Crear cuenta
- Ve a https://glitch.com
- Regístrate con GitHub (gratis)

### 2. Importar desde GitHub
1. Haz clic en "New Project"
2. Selecciona "Import from GitHub"
3. Pega la URL: `https://github.com/bastos9601/bradatec-sego`
4. Espera a que importe

### 3. Configurar
1. Edita `.glitch-assets` para incluir:
```json
{
  "name": "bradatec-sego",
  "version": "1.0.0",
  "scripts": {
    "start": "cd sego-scraper && node server.js"
  }
}
```

### 4. Instalar Puppeteer
En la terminal de Glitch:
```bash
cd sego-scraper
npm install
```

## 🔧 Configuración de Puppeteer para Glitch

Glitch requiere usar `puppeteer-core` con Chromium preinstalado.

Modificar `package.json`:
```json
{
  "dependencies": {
    "puppeteer-core": "^21.0.0",
    "@sparticuz/chromium": "^119.0.0"
  }
}
```

Modificar `server.js`:
```javascript
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});
```

## ❌ Problemas con Glitch

1. **Memoria insuficiente**: Puppeteer + Chromium pueden usar más de 512 MB
2. **Se duerme**: Después de 5 min sin actividad
3. **Disco limitado**: 200 MB puede no ser suficiente
4. **Configuración compleja**: Requiere modificar código

## 🎯 Recomendación

**NO recomiendo Glitch para tu caso** porque:
- Limitaciones de memoria muy estrictas
- Se duerme frecuentemente
- Configuración compleja para Puppeteer

**Mejor usar**: Koyeb (gratis, no se duerme, más memoria)
