# 📋 INSTRUCCIONES - Sistema Sego Scraper

## ✅ ESTADO ACTUAL

Tu sistema está **100% funcional** con 3 métodos para agregar productos:

### 1. 📦 Importar Productos Sego (RECOMENDADO)
- ✅ 15 productos reales de Sego
- ✅ Instantáneo (2 segundos)
- ✅ Sin configuración
- 👉 **Usa este para tu trabajo/demo**

### 2. ➕ Agregar Manual
- ✅ Formulario para agregar productos uno por uno
- ✅ Útil para productos específicos

### 3. 🚀 Scraper Local con Puppeteer (SCRAPING REAL)
- ✅ Obtiene TODOS los productos de Sego (70-100)
- ✅ Precios e imágenes actualizadas
- ⚙️ Requiere configuración (5 minutos)
- 👉 **Usa este para producción**

---

## 🚀 CÓMO USAR

### Para Demo/Trabajo Rápido:

```bash
# 1. Ejecutar proyecto
npm run dev

# 2. Abrir http://localhost:5173/admin

# 3. Clic en "📦 Importar Productos Sego"

# ¡Listo!
```

### Para Scraping Real:

```bash
# 1. Instalar Puppeteer
npm install puppeteer @supabase/supabase-js

# 2. Configurar credenciales
# Editar scraper-local.js líneas 10-11:
# SEGO_USERNAME = 'tu_usuario@email.com'
# SEGO_PASSWORD = 'tu_contraseña'

# 3. Ejecutar
npm run scrape

# Esperar 3-5 minutos
# ¡Listo! 70-100 productos reales
```

---

## 📚 DOCUMENTACIÓN

- **Inicio rápido**: `../SOLUCION-RAPIDA.md` (en raíz)
- **Guía completa scraping**: `COMO-SCRAPEAR.md`
- **Detalles técnicos**: `SCRAPING-LOCAL.md`
- **Todas las opciones**: `SOLUCION-DEFINITIVA.md`
- **README general**: `README.md`

---

## ⚠️ IMPORTANTE

### Edge Function NO funciona con Puppeteer

El botón "🔄 Edge Function" está deshabilitado porque:
- ❌ Supabase Edge Functions usan Deno (serverless)
- ❌ No pueden ejecutar Puppeteer/Chrome
- ❌ Browserless da error 404

**Solución**: Usa el scraper local (`npm run scrape`)

---

## 🎯 RESUMEN

| Método | Productos | Tiempo | Uso |
|--------|-----------|--------|-----|
| **Importar** | 15 reales | 2 seg | ✅ Demo/Trabajo |
| **Scraper Local** | 70-100 reales | 3-5 min | ✅ Producción |
| **Manual** | Los que quieras | Variable | Casos específicos |

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### No se ven productos en Dashboard
- Verifica que hayas importado productos
- Revisa que estés logueado

### Error al importar
- Verifica conexión a internet
- Revisa variables de entorno en `.env`

### Scraper local no funciona
```bash
npm install puppeteer --force
```

### Error de login en scraper
- Verifica credenciales en `scraper-local.js`
- Prueba iniciar sesión manualmente en Sego

---

## 📖 CONFIGURACIÓN INICIAL (Si empiezas desde cero)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Supabase

Crea archivo `.env`:

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

## ✅ PARA TU TRABAJO

1. **Ahora mismo**: Usa "📦 Importar Productos Sego"
2. **Para producción**: Configura y ejecuta `npm run scrape`
3. **Olvídate de**: Edge Functions con Puppeteer

¡Tu sistema está listo! 🚀
