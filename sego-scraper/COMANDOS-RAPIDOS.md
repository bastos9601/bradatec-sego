# ⚡ COMANDOS RÁPIDOS

## 🚀 Uso Diario

### Ejecutar el proyecto
```bash
cd sego-scraper
npm run dev
```

### Scraping real
```bash
npm run scrape
```

---

## 📦 Instalación

### Primera vez
```bash
cd sego-scraper
npm install
```

### Instalar Puppeteer
```bash
npm install puppeteer @supabase/supabase-js
```

### Reinstalar Puppeteer (si falla)
```bash
npm install puppeteer --force
```

---

## 🔧 Configuración

### Ver variables de entorno
```bash
type .env
```

### Editar credenciales de scraper
```bash
notepad scraper-local.js
# Cambiar líneas 10-11
```

---

## 🐛 Solución de Problemas

### Limpiar caché
```bash
npm cache clean --force
```

### Reinstalar todo
```bash
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Ver versión de Node
```bash
node --version
```

### Ver versión de npm
```bash
npm --version
```

---

## 📊 Verificación

### Ver productos en base de datos
```sql
-- En Supabase SQL Editor:
SELECT COUNT(*) FROM productos;
SELECT * FROM productos LIMIT 10;
```

### Ver usuarios admin
```sql
-- En Supabase SQL Editor:
SELECT u.email, p.rol 
FROM auth.users u
JOIN perfiles p ON u.id = p.id
WHERE p.rol = 'admin';
```

---

## 🔄 Supabase CLI

### Login
```bash
npx supabase login
```

### Vincular proyecto
```bash
npx supabase link --project-ref sajuzexibgpikrijqdjt
```

### Desplegar función
```bash
npx supabase functions deploy scrape_productos_puppeteer
```

### Ver funciones
```bash
npx supabase functions list
```

---

## 📝 Scripts Disponibles

```bash
npm run dev      # Ejecutar proyecto (Vite)
npm run build    # Compilar para producción
npm run preview  # Vista previa de build
npm run lint     # Verificar código
npm run scrape   # Scraping real con Puppeteer
```

---

## 🌐 URLs Útiles

```
Local:           http://localhost:5173
Admin:           http://localhost:5173/admin
Dashboard:       http://localhost:5173/dashboard
Supabase:        https://supabase.com/dashboard
Sego Login:      https://www.sego.com.pe/web/login
```

---

## 📁 Rutas de Archivos

```bash
# Configuración
.env                          # Credenciales Supabase
scraper-local.js              # Script de scraping

# Código React
src/paginas/Admin.jsx         # Panel admin
src/paginas/Dashboard.jsx     # Vista productos
src/paginas/Login.jsx         # Login

# Supabase
supabase/schema.sql           # Estructura DB
supabase/functions/           # Edge Functions
```

---

## 🎯 Atajos de Teclado

### En el navegador:
- `F12` - Abrir DevTools
- `Ctrl + Shift + C` - Inspeccionar elemento
- `Ctrl + Shift + R` - Recargar sin caché

### En VS Code:
- `Ctrl + P` - Buscar archivo
- `Ctrl + Shift + F` - Buscar en proyecto
- `Ctrl + ñ` - Abrir terminal

---

## 🔄 Flujo de Trabajo Típico

### Desarrollo diario:
```bash
cd sego-scraper
npm run dev
# Abrir http://localhost:5173
# Hacer cambios en código
# Guardar (auto-reload)
```

### Actualizar productos:
```bash
# Opción 1: Importar (2 seg)
# En admin, clic "Importar Productos"

# Opción 2: Scraping real (5 min)
npm run scrape
```

### Desplegar cambios:
```bash
npm run build
# Subir carpeta dist/ a hosting
```

---

## 📊 Comandos de Diagnóstico

### Ver logs del scraper
```bash
npm run scrape > scraper.log 2>&1
type scraper.log
```

### Verificar conexión a Supabase
```bash
# En navegador, abrir DevTools (F12)
# Console > Network > Ver requests
```

### Ver errores de React
```bash
# En navegador, F12 > Console
```

---

## 🎯 Comandos por Situación

### "Quiero empezar"
```bash
cd sego-scraper
npm run dev
```

### "Quiero productos"
```bash
# En admin: clic "Importar Productos"
# O ejecutar:
npm run scrape
```

### "Tengo un error"
```bash
npm cache clean --force
npm install
npm run dev
```

### "Quiero actualizar"
```bash
git pull
npm install
npm run dev
```

---

## 💡 Tips

### Ejecutar en segundo plano (Windows)
```bash
start /B npm run dev
```

### Ver procesos Node
```bash
tasklist | findstr node
```

### Matar proceso Node
```bash
taskkill /F /IM node.exe
```

---

## 📚 Ayuda Rápida

```bash
# Ver ayuda de npm
npm help

# Ver ayuda de un comando
npm help install

# Ver scripts disponibles
npm run
```

---

## ✅ Checklist Rápido

```bash
# ¿Funciona el proyecto?
cd sego-scraper
npm run dev
# Abrir http://localhost:5173

# ¿Funciona el scraper?
npm run scrape

# ¿Hay productos?
# Abrir http://localhost:5173/dashboard
```

---

¡Guarda este archivo para referencia rápida! 🚀
