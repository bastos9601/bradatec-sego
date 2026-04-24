# 🎯 CÓMO SCRAPEAR PRODUCTOS DE SEGO

## ⚡ OPCIÓN 1: Rápido (2 segundos)

### Para demos y pruebas

1. Ejecuta el proyecto:
   ```bash
   npm run dev
   ```

2. Abre: http://localhost:5173/admin

3. Clic en botón morado: **"📦 Importar Productos Sego"**

4. ¡Listo! 15 productos reales de Sego

---

## 🚀 OPCIÓN 2: Scraping Real (5 minutos)

### Para obtener TODOS los productos actualizados

### Paso 1: Instalar Puppeteer

```bash
cd sego-scraper
npm install puppeteer @supabase/supabase-js
```

### Paso 2: Configurar tus credenciales

Abre el archivo `scraper-local.js` y busca las líneas 10-11:

```javascript
const SEGO_USERNAME = 'tu_usuario@email.com';  // ← Cambia esto
const SEGO_PASSWORD = 'tu_contraseña';         // ← Cambia esto
```

Reemplaza con tus credenciales de Sego.

### Paso 3: Ejecutar el scraper

```bash
npm run scrape
```

O también:

```bash
node scraper-local.js
```

### Paso 4: Esperar

Verás algo como:

```
🚀 Iniciando scraping de Sego...
🔐 Iniciando sesión en Sego...
✅ Sesión iniciada

📦 Scrapeando: https://www.sego.com.pe/shop/category/cctv-108
   ✓ Encontrados: 24 productos

📦 Scrapeando: https://www.sego.com.pe/shop/category/alarmas-contra-incendio-158
   ✓ Encontrados: 18 productos

📦 Scrapeando: https://www.sego.com.pe/shop/category/alarmas-contra-robo-113
   ✓ Encontrados: 15 productos

📦 Scrapeando: https://www.sego.com.pe/shop/category/networking-103
   ✓ Encontrados: 12 productos

📦 Scrapeando: https://www.sego.com.pe/shop/category/videoporteros-e-intercomunicadores-213
   ✓ Encontrados: 8 productos

📊 Total productos encontrados: 77

💾 Insertando en Supabase...
   ✓ Insertado: Cámara Domo IP 2MP 1080P Hikvision...
   ✓ Insertado: DVR 8 Canales 1080P Hikvision...
   ✓ Insertado: Panel de Alarma DSC PC1616...
   ⊘ Duplicado: Kit 4 Cámaras + DVR...
   ...

✅ SCRAPING COMPLETADO
   📦 Total encontrados: 77
   ✓ Insertados: 65
   ⊘ Duplicados: 12

🎉 Proceso finalizado
```

### Paso 5: Ver los productos

Abre: http://localhost:5173/dashboard

---

## 🔄 Automatizar (Opcional)

### Para ejecutar automáticamente cada día

#### Windows:

1. Busca "Programador de tareas" en el menú inicio
2. Clic en "Crear tarea básica"
3. Nombre: "Scraper Sego"
4. Desencadenador: "Diariamente" a las 8:00 AM
5. Acción: "Iniciar un programa"
   - Programa: `node`
   - Argumentos: `C:\ruta\completa\a\sego-scraper\scraper-local.js`
6. Finalizar

#### Linux/Mac:

```bash
# Editar crontab
crontab -e

# Agregar esta línea (ejecutar cada día a las 8am)
0 8 * * * cd /ruta/a/sego-scraper && node scraper-local.js
```

---

## 🐛 Problemas Comunes

### "Cannot find module 'puppeteer'"

```bash
npm install puppeteer
```

### "Login failed" o "Timeout"

- Verifica que tu usuario y contraseña sean correctos
- Prueba iniciar sesión manualmente en https://www.sego.com.pe/web/login
- Asegúrate de tener internet estable

### No encuentra productos

1. Abre `scraper-local.js`
2. Cambia línea 18:
   ```javascript
   headless: false,  // ← Cambia a true si quieres modo invisible
   ```
3. Ejecuta de nuevo y observa qué pasa en el navegador

### El navegador se abre pero no hace nada

- Sego puede haber cambiado su HTML
- Inspecciona la página y actualiza los selectores en `scraper-local.js`

---

## 📊 Comparación

| Método | Productos | Tiempo | Configuración |
|--------|-----------|--------|---------------|
| **Importar** | 15 reales | 2 seg | ✅ Ninguna |
| **Scraper Local** | Todos (70-100) | 3-5 min | ⚙️ Credenciales |

---

## ✅ Recomendación

- **Para tu trabajo/demo**: Usa "Importar" (botón morado)
- **Para producción**: Usa scraper local con `npm run scrape`

---

## 📚 Más Ayuda

- **Detalles técnicos**: `SCRAPING-LOCAL.md`
- **Todas las soluciones**: `SOLUCION-DEFINITIVA.md`
- **Inicio rápido**: `INICIO-RAPIDO-SCRAPING.md`

¡Éxito con tu proyecto! 🚀
