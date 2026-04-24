# 🚀 Inicio Rápido - Sego Scraper

## ⚡ USAR AHORA (30 segundos)

```bash
cd sego-scraper
npm run dev
```

Abre http://localhost:5173/admin y clic en **"📦 Importar Productos Sego"**

¡Listo! 15 productos reales en 2 segundos.

---

## 🎯 SCRAPING REAL (5 minutos)

```bash
cd sego-scraper

# 1. Instalar Puppeteer
npm install puppeteer @supabase/supabase-js

# 2. Editar scraper-local.js
# Cambiar líneas 10-11 con tus credenciales de Sego

# 3. Ejecutar
npm run scrape
```

Espera 3-5 minutos. ¡70-100 productos reales!

---

## 📚 DOCUMENTACIÓN

### Lee primero:
- **`SOLUCION-RAPIDA.md`** ← Resumen ejecutivo
- **`sego-scraper/LEEME-PRIMERO.md`** ← Guía visual
- **`sego-scraper/COMO-SCRAPEAR.md`** ← Paso a paso

### Detalles técnicos:
- **`sego-scraper/SCRAPING-LOCAL.md`** ← Cómo funciona
- **`sego-scraper/SOLUCION-DEFINITIVA.md`** ← Todas las opciones
- **`sego-scraper/README.md`** ← Documentación completa
- **`sego-scraper/INSTRUCCIONES.md`** ← Configuración inicial

---

## 📁 Estructura del Proyecto

```
bradatec-catalogo-web-sego/
├── SOLUCION-RAPIDA.md          ← Empieza aquí
├── INICIO-RAPIDO.md            ← Este archivo
└── sego-scraper/
    ├── scraper-local.js        ← Script de scraping real
    ├── LEEME-PRIMERO.md        ← Guía visual
    ├── COMO-SCRAPEAR.md        ← Paso a paso
    ├── SCRAPING-LOCAL.md       ← Detalles técnicos
    ├── SOLUCION-DEFINITIVA.md  ← Todas las opciones
    ├── src/                    ← Código React
    ├── supabase/               ← Edge Functions
    └── package.json
```

---

## ⚠️ IMPORTANTE

### Edge Functions NO funcionan con Puppeteer
- ❌ Supabase Edge Functions usan Deno (serverless)
- ❌ No pueden ejecutar Chrome/Puppeteer
- ❌ Browserless da error 404

### ✅ Soluciones que SÍ funcionan:
1. **Importar Productos** (botón morado en admin) - 2 segundos
2. **Scraper Local** (`npm run scrape`) - 3-5 minutos

---

## 🎯 3 OPCIONES DISPONIBLES

| Opción | Productos | Tiempo | Cuándo usar |
|--------|-----------|--------|-------------|
| **📦 Importar** | 15 reales | 2 seg | ✅ Demo/Trabajo |
| **🚀 Scraper Local** | 70-100 reales | 3-5 min | ✅ Producción |
| **➕ Manual** | Los que quieras | Variable | Casos específicos |

---

## 🐛 Solución de Problemas

### No veo productos
```bash
cd sego-scraper
npm run dev
# Abre http://localhost:5173/admin
# Clic en "Importar Productos"
```

### Quiero scraping real
```bash
cd sego-scraper
npm install puppeteer
# Edita scraper-local.js con tus credenciales
npm run scrape
```

### Error al scrapear
Lee `sego-scraper/COMO-SCRAPEAR.md` sección "Problemas Comunes"

---

## 📖 Configuración Inicial (Si empiezas desde cero)

### 1. Instalar dependencias
```bash
cd sego-scraper
npm install
```

### 2. Configurar Supabase

Edita `.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. Crear tablas

En Supabase SQL Editor, ejecuta `supabase/schema.sql`

### 4. Crear usuario admin

```sql
-- Primero crea usuario en Authentication > Users
-- Luego ejecuta:
UPDATE perfiles SET rol = 'admin' 
WHERE id = 'TU_USER_ID';
```

### 5. Ejecutar

```bash
npm run dev
```

---

## ✅ RESUMEN

1. **Para tu trabajo AHORA**: Usa "Importar Productos" (2 seg)
2. **Para scraping real**: Usa `npm run scrape` (5 min)
3. **Lee**: `SOLUCION-RAPIDA.md` para más detalles

¡Éxito! 🚀
