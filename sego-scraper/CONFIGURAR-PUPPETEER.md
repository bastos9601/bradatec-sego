# 🤖 Configurar Scraping con Puppeteer (JavaScript)

## ¿Qué es esto?

Puppeteer permite scrapear sitios web que usan JavaScript para cargar contenido (como Sego). Usa un navegador real headless.

---

## 🎯 OPCIÓN 1: Usar sin Browserless (Productos de Ejemplo)

La función ya está configurada para funcionar **sin Browserless**. Si no configuras el token, usará productos de ejemplo de Sego.

### Pasos:

1. Despliega la función:
```bash
cd sego-scraper
npx supabase functions deploy scrape_productos_puppeteer
```

2. Ve a http://localhost:5173/admin

3. Haz clic en **"🔄 Scrapear Sego (Puppeteer)"**

4. Obtendrás 15 productos de ejemplo de Sego

---

## 🚀 OPCIÓN 2: Configurar Browserless (Scraping Real)

Para scrapear productos REALES con JavaScript de Sego:

### Paso 1: Crear cuenta en Browserless

1. Ve a https://www.browserless.io/
2. Haz clic en **"Sign Up"** o **"Get Started"**
3. Crea una cuenta gratuita (no requiere tarjeta)
4. Plan gratuito: 6 horas/mes de uso

### Paso 2: Obtener Token

1. Inicia sesión en Browserless
2. Ve a **Dashboard**
3. Copia tu **API Token** (algo como: `abc123-def456-ghi789`)

### Paso 3: Configurar en Supabase

1. Ve a https://supabase.com
2. Tu proyecto > **Edge Functions** > **scrape_productos_puppeteer**
3. Pestaña **Settings** > **Secrets**
4. Agrega un nuevo secret:
   - Name: `BROWSERLESS_TOKEN`
   - Value: [tu_token_de_browserless]
5. Guarda

### Paso 4: Redesplegar

```bash
cd sego-scraper
npx supabase functions deploy scrape_productos_puppeteer
```

### Paso 5: Probar

1. Ve a http://localhost:5173/admin
2. Haz clic en **"🔄 Scrapear Sego (Puppeteer)"**
3. Espera 30-60 segundos (el navegador está cargando)
4. ¡Productos reales de Sego con precios!

---

## 📊 Comparación de Opciones

| Opción | Productos | Velocidad | Configuración |
|--------|-----------|-----------|---------------|
| **Importar Productos** | 15 reales | Instantáneo | Ninguna |
| **Puppeteer sin Browserless** | 15 ejemplo | Rápido | Ninguna |
| **Puppeteer con Browserless** | Reales scrapeados | 30-60s | Token requerido |

---

## 💡 Recomendación para tu Trabajo

### Para Demostración Rápida:
Usa **"📦 Importar Productos Sego"** - Instantáneo, 15 productos reales

### Para Scraping Real:
1. Usa Puppeteer sin Browserless (productos de ejemplo)
2. O configura Browserless para scraping real

---

## 🔧 Cómo Funciona

### Sin Browserless:
```
Usuario → Edge Function → Productos de Ejemplo → Base de Datos
```

### Con Browserless:
```
Usuario → Edge Function → Browserless (Puppeteer) → Sego.com.pe → Productos Reales → Base de Datos
```

---

## 🐛 Solución de Problemas

### "Browserless error: 401"
- Token incorrecto o expirado
- Verifica el token en Browserless Dashboard
- Reconfigura el secret en Supabase

### "Timeout"
- El scraping toma tiempo (30-60s)
- Espera pacientemente
- Revisa los logs en Supabase

### "No se pudieron obtener productos"
- Browserless no configurado → Usa productos de ejemplo
- O configura BROWSERLESS_TOKEN

---

## ✅ Verificar que Funciona

En los logs de Supabase deberías ver:

**Sin Browserless:**
```
⚠️ BROWSERLESS_TOKEN no configurado
Usando método alternativo con API de Sego...
Productos encontrados: 15
```

**Con Browserless:**
```
Usando Browserless para scraping...
Productos encontrados: X
```

---

## 📝 Resumen

1. **Más Rápido**: Usa "📦 Importar Productos Sego"
2. **Scraping Básico**: Usa Puppeteer sin Browserless
3. **Scraping Real**: Configura Browserless (opcional)

¡Elige la opción que mejor se adapte a tu trabajo! 🚀
