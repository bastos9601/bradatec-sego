# ⚡ INICIO RÁPIDO - Scraping Real

## 🎯 Para tu Trabajo AHORA

### Opción A: Demo Rápida (2 segundos)

1. Abre http://localhost:5173/admin
2. Clic en **"📦 Importar Productos Sego"**
3. ¡Listo! 15 productos reales

---

### Opción B: Scraping Real (5 minutos)

#### Paso 1: Instalar

```bash
cd sego-scraper
npm install puppeteer @supabase/supabase-js
```

#### Paso 2: Configurar

Abre `scraper-local.js` y cambia líneas 10-11:

```javascript
const SEGO_USERNAME = 'tu_usuario@email.com';
const SEGO_PASSWORD = 'tu_contraseña';
```

#### Paso 3: Ejecutar

```bash
node scraper-local.js
```

Espera 2-5 minutos. Verás:

```
🚀 Iniciando scraping de Sego...
🔐 Iniciando sesión en Sego...
✅ Sesión iniciada

📦 Scrapeando: https://www.sego.com.pe/shop/category/cctv-108
   ✓ Encontrados: 24 productos

...

✅ SCRAPING COMPLETADO
   📦 Total encontrados: 87
   ✓ Insertados: 65
```

#### Paso 4: Ver resultados

Abre http://localhost:5173/dashboard

---

## 🐛 Si algo falla

### Error: "Cannot find module 'puppeteer'"

```bash
npm install puppeteer
```

### Error: "Login failed"

Verifica usuario y contraseña en `scraper-local.js`

### No encuentra productos

Cambia `headless: false` a `headless: true` en línea 18 de `scraper-local.js`

---

## 📚 Más Información

- **Detalles completos**: `SCRAPING-LOCAL.md`
- **Todas las soluciones**: `SOLUCION-DEFINITIVA.md`
- **Configuración general**: `README.md`

---

## ✅ Resumen

**Para demo**: Usa botón "Importar" (2 seg)  
**Para producción**: Ejecuta `node scraper-local.js` (5 min)

¡Elige la que necesites! 🚀
