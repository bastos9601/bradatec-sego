# 🖥️ Scraping Local con Puppeteer (Node.js)

## ¿Por qué esta solución?

Supabase Edge Functions usan Deno (serverless):
- ❌ No hay Chrome real
- ❌ Puppeteer no funciona
- ❌ Browserless da error 404

**Solución**: Ejecutar Puppeteer en tu computadora local y subir a Supabase.

---

## 📋 Instalación

### 1. Instalar Puppeteer

```bash
cd sego-scraper
npm install puppeteer @supabase/supabase-js
```

### 2. Configurar credenciales

Edita `scraper-local.js` y cambia:

```javascript
const SEGO_USERNAME = 'tu_usuario@email.com';
const SEGO_PASSWORD = 'tu_contraseña';
```

---

## 🚀 Uso

### Ejecutar scraping:

```bash
node scraper-local.js
```

### Lo que hace:

1. ✅ Abre Chrome en tu computadora
2. ✅ Inicia sesión en Sego con tus credenciales
3. ✅ Visita cada categoría de productos
4. ✅ Extrae nombre, precio e imagen
5. ✅ Sube los productos a Supabase
6. ✅ Evita duplicados

---

## 📊 Salida Esperada

```
🚀 Iniciando scraping de Sego...
🔐 Iniciando sesión en Sego...
✅ Sesión iniciada

📦 Scrapeando: https://www.sego.com.pe/shop/category/cctv-108
   ✓ Encontrados: 24 productos

📦 Scrapeando: https://www.sego.com.pe/shop/category/alarmas-contra-incendio-158
   ✓ Encontrados: 18 productos

...

📊 Total productos encontrados: 87

💾 Insertando en Supabase...
   ✓ Insertado: Cámara Domo IP 2MP...
   ✓ Insertado: DVR 8 Canales...
   ⊘ Duplicado: Kit 4 Cámaras...

✅ SCRAPING COMPLETADO
   📦 Total encontrados: 87
   ✓ Insertados: 65
   ⊘ Duplicados: 22

🎉 Proceso finalizado
```

---

## ⚙️ Opciones

### Modo invisible (sin ver el navegador):

En `scraper-local.js`, cambia:

```javascript
headless: false  →  headless: true
```

### Agregar más categorías:

```javascript
const categorias = [
  'https://www.sego.com.pe/shop/category/cctv-108',
  'https://www.sego.com.pe/shop/category/tu-nueva-categoria',
  // ...
];
```

---

## 🔄 Automatización (Opcional)

### Windows - Tarea Programada:

1. Abre "Programador de tareas"
2. Crear tarea básica
3. Acción: Iniciar programa
   - Programa: `node`
   - Argumentos: `C:\ruta\a\sego-scraper\scraper-local.js`
4. Configurar horario (ej: cada día a las 8am)

### Linux/Mac - Cron:

```bash
# Editar crontab
crontab -e

# Agregar línea (ejecutar cada día a las 8am)
0 8 * * * cd /ruta/a/sego-scraper && node scraper-local.js
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'puppeteer'"

```bash
npm install puppeteer
```

### Error: "Login failed"

- Verifica usuario y contraseña en `scraper-local.js`
- Asegúrate de poder iniciar sesión manualmente en Sego

### Error: "Timeout waiting for selector"

- Sego cambió su HTML
- Abre el navegador en modo visible (`headless: false`)
- Inspecciona los selectores y ajústalos

### No encuentra productos:

- Verifica que estés logueado correctamente
- Los selectores pueden haber cambiado
- Revisa el HTML de Sego y actualiza los selectores en `page.evaluate()`

---

## 💡 Ventajas vs Edge Function

| Característica | Edge Function | Script Local |
|----------------|---------------|--------------|
| Chrome real | ❌ No | ✅ Sí |
| Puppeteer | ❌ No funciona | ✅ Funciona |
| JavaScript de Sego | ❌ No carga | ✅ Carga completo |
| Configuración | Compleja | Simple |
| Costo | Gratis | Gratis |
| Velocidad | N/A | Rápido |

---

## 📝 Resumen

1. Instala Puppeteer: `npm install puppeteer @supabase/supabase-js`
2. Configura credenciales en `scraper-local.js`
3. Ejecuta: `node scraper-local.js`
4. ¡Listo! Productos reales de Sego en tu base de datos

**Esta es la solución más confiable para tu trabajo.** 🚀

