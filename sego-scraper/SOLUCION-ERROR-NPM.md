# ❌ Error: npm install -g supabase NO funciona

## 🔴 El Problema
```
Installing Supabase CLI as a global module is not supported.
```

Supabase CLI ya no se puede instalar con npm.

---

## ✅ LA SOLUCIÓN MÁS RÁPIDA

Usa **NPX** (no requiere instalación):

```bash
# En lugar de instalar, usa npx directamente:
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
npx supabase functions deploy scrape_productos
```

### ¿Dónde obtengo el PROJECT_REF?
1. Ve a tu proyecto en https://supabase.com
2. Settings > General
3. Copia el "Reference ID"

---

## 📋 Pasos Completos para Desplegar la Edge Function

### 1. Asegúrate de estar en la carpeta correcta
```bash
cd sego-scraper
```

### 2. Login en Supabase
```bash
npx supabase login
```
Se abrirá tu navegador para autorizar.

### 3. Vincular tu proyecto
```bash
npx supabase link --project-ref abc123xyz
```
Reemplaza `abc123xyz` con tu Reference ID.

### 4. Desplegar la función
```bash
npx supabase functions deploy scrape_productos
```

### 5. Verificar
```bash
npx supabase functions list
```

Deberías ver `scrape_productos` en la lista.

---

## 🎯 Alternativa: Instalar con Scoop

Si prefieres tener el comando instalado permanentemente:

```bash
# Instalar Scoop (solo la primera vez)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Instalar Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Ahora puedes usar sin npx:
supabase login
supabase link --project-ref abc123xyz
supabase functions deploy scrape_productos
```

---

## 📖 Más Información

Lee `INSTALAR-SUPABASE-CLI.md` para todas las opciones de instalación.

---

## ✅ Siguiente Paso

Una vez desplegada la función, continúa con el **PASO 9** de `INSTRUCCIONES.md`:
- Ejecutar el proyecto: `npm run dev`
- Abrir http://localhost:5173
- Hacer login y probar el scraping
