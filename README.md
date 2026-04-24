# 🛒 Sego Scraper - Sistema de Web Scraping

Sistema completo de web scraping para productos de Sego Perú con React + Supabase.

---

## ⚡ INICIO RÁPIDO

### Opción 1: Demo Rápida (2 segundos)

```bash
cd sego-scraper
npm run dev
```

Abre http://localhost:5173/admin → Clic en **"📦 Importar Productos Sego"**

### Opción 2: Scraping Real (5 minutos)

```bash
cd sego-scraper
npm install puppeteer @supabase/supabase-js

# Edita scraper-local.js con tus credenciales de Sego
npm run scrape
```

---

## 📚 DOCUMENTACIÓN

### 🎯 Empieza aquí:
- **[SOLUCION-RAPIDA.md](SOLUCION-RAPIDA.md)** - Resumen ejecutivo
- **[INICIO-RAPIDO.md](INICIO-RAPIDO.md)** - Guía de inicio

### 📖 Guías detalladas:
- **[sego-scraper/LEEME-PRIMERO.md](sego-scraper/LEEME-PRIMERO.md)** - Guía visual
- **[sego-scraper/COMO-SCRAPEAR.md](sego-scraper/COMO-SCRAPEAR.md)** - Paso a paso
- **[sego-scraper/SCRAPING-LOCAL.md](sego-scraper/SCRAPING-LOCAL.md)** - Detalles técnicos
- **[sego-scraper/SOLUCION-DEFINITIVA.md](sego-scraper/SOLUCION-DEFINITIVA.md)** - Todas las opciones

---

## 🎯 3 MÉTODOS DISPONIBLES

| Método | Productos | Tiempo | Configuración | Uso |
|--------|-----------|--------|---------------|-----|
| **📦 Importar** | 15 reales | 2 seg | Ninguna | ✅ Demo/Trabajo |
| **🚀 Scraper Local** | 70-100 reales | 3-5 min | Credenciales | ✅ Producción |
| **➕ Manual** | Los que quieras | Variable | Ninguna | Casos específicos |

---

## ⚠️ IMPORTANTE

### Edge Functions NO soportan Puppeteer

Supabase Edge Functions usan Deno (serverless) y **NO pueden ejecutar Puppeteer**:
- ❌ No hay Chrome/navegador real
- ❌ Browserless da error 404
- ❌ JavaScript de Sego no se ejecuta

### ✅ Soluciones que funcionan:

1. **Importar Productos** (botón en admin) - Instantáneo
2. **Scraper Local** (`npm run scrape`) - Scraping real con Puppeteer

---

## 🚀 Tecnologías

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + Edge Functions)
- **Scraping**: Puppeteer (Node.js local)
- **Autenticación**: Supabase Auth con roles (admin/usuario)

---

## 📁 Estructura del Proyecto

```
bradatec-catalogo-web-sego/
├── README.md                   ← Este archivo
├── SOLUCION-RAPIDA.md          ← Resumen ejecutivo
├── INICIO-RAPIDO.md            ← Guía de inicio
└── sego-scraper/
    ├── scraper-local.js        ← Script de scraping real
    ├── LEEME-PRIMERO.md        ← Guía visual
    ├── COMO-SCRAPEAR.md        ← Paso a paso
    ├── SCRAPING-LOCAL.md       ← Detalles técnicos
    ├── SOLUCION-DEFINITIVA.md  ← Todas las opciones
    ├── README.md               ← Documentación completa
    ├── INSTRUCCIONES.md        ← Configuración inicial
    ├── src/                    ← Código React
    │   ├── componentes/
    │   ├── paginas/
    │   └── supabase/
    ├── supabase/               ← Edge Functions y schema
    ├── package.json
    └── .env                    ← Credenciales Supabase
```

---

## 🎯 Funcionalidades

### Usuario Normal:
- ✅ Login con email/contraseña
- ✅ Ver productos scrapeados
- ✅ Interfaz responsive

### Usuario Admin:
- ✅ Todo lo anterior
- ✅ Importar productos instantáneamente
- ✅ Agregar productos manualmente
- ✅ Eliminar productos (individual/todos)
- ✅ Ver estadísticas
- ✅ Panel de administración

---

## 🔐 Seguridad

- Row Level Security (RLS) configurado
- Usuarios normales: solo lectura
- Admins: CRUD completo
- Autenticación con Supabase Auth

---

## 🐛 Solución de Problemas

### No veo productos
```bash
cd sego-scraper
npm run dev
# Abre http://localhost:5173/admin
# Clic en "📦 Importar Productos Sego"
```

### Quiero scraping real
```bash
cd sego-scraper
npm install puppeteer
# Edita scraper-local.js líneas 10-11 con tus credenciales
npm run scrape
```

### Error al scrapear
Lee [sego-scraper/COMO-SCRAPEAR.md](sego-scraper/COMO-SCRAPEAR.md) sección "Problemas Comunes"

---

## 📖 Configuración Inicial

Si empiezas desde cero, lee [INICIO-RAPIDO.md](INICIO-RAPIDO.md) o [sego-scraper/INSTRUCCIONES.md](sego-scraper/INSTRUCCIONES.md)

Pasos básicos:
1. `npm install`
2. Configurar `.env` con credenciales de Supabase
3. Crear tablas con `supabase/schema.sql`
4. Crear usuario admin
5. `npm run dev`

---

## 🔄 Automatización (Opcional)

Para ejecutar el scraper automáticamente cada día:

### Windows:
1. Programador de tareas
2. Acción: `node C:\ruta\sego-scraper\scraper-local.js`
3. Horario: Diario a las 8am

### Linux/Mac:
```bash
crontab -e
# Agregar:
0 8 * * * cd /ruta/sego-scraper && node scraper-local.js
```

---

## 📊 Comparación de Soluciones

| Característica | Edge Function | Scraper Local | Importar |
|----------------|---------------|---------------|----------|
| Chrome real | ❌ No | ✅ Sí | N/A |
| Puppeteer | ❌ No funciona | ✅ Funciona | N/A |
| JavaScript de Sego | ❌ No carga | ✅ Carga | N/A |
| Productos | 0 | 70-100 reales | 15 reales |
| Tiempo | N/A | 3-5 min | 2 seg |
| Configuración | Compleja | Simple | Ninguna |
| Recomendado | ❌ No | ✅ Producción | ✅ Demo |

---

## ✅ RESUMEN

1. **Para tu trabajo AHORA**: Usa "📦 Importar Productos Sego" (2 seg)
2. **Para scraping real**: Usa `npm run scrape` (5 min)
3. **Olvídate de**: Edge Functions con Puppeteer (no funciona)

---

## 📝 Licencia

MIT

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Abre un issue para discutir cambios.

---

## 📞 Soporte

Lee la documentación en orden:
1. [SOLUCION-RAPIDA.md](SOLUCION-RAPIDA.md)
2. [sego-scraper/LEEME-PRIMERO.md](sego-scraper/LEEME-PRIMERO.md)
3. [sego-scraper/COMO-SCRAPEAR.md](sego-scraper/COMO-SCRAPEAR.md)

¡Éxito con tu proyecto! 🚀
