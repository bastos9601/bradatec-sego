# 🚀 Cómo Desplegar la Edge Function

## ❌ Error Común

```
WARN: failed to read file: open supabase\functions\scrape_productos\index.ts: 
El sistema no puede encontrar la ruta especificada.
```

**Causa:** Estás ejecutando el comando desde la carpeta incorrecta.

---

## ✅ SOLUCIÓN

### Paso 1: Entrar a la carpeta del proyecto

```bash
cd sego-scraper
```

### Paso 2: Verificar que estás en la carpeta correcta

```bash
# Deberías ver la carpeta supabase
dir
```

Deberías ver:
- supabase/
- src/
- package.json
- etc.

### Paso 3: Verificar que el archivo existe

```bash
dir supabase\functions\scrape_productos\index.ts
```

Debería mostrar el archivo.

### Paso 4: Login en Supabase

```bash
npx supabase login
```

Se abrirá tu navegador. Autoriza el acceso.

### Paso 5: Vincular tu proyecto

```bash
npx supabase link --project-ref TU_PROJECT_REF
```

**¿Dónde obtengo el PROJECT_REF?**
1. Ve a https://supabase.com
2. Abre tu proyecto
3. Settings > General
4. Copia el "Reference ID" (ejemplo: `abcxyz123`)

### Paso 6: Desplegar la función

```bash
npx supabase functions deploy scrape_productos
```

Deberías ver:
```
Deploying Function scrape_productos...
Deployed Function scrape_productos
```

---

## 📋 Comandos Completos (Copia y Pega)

```bash
# 1. Entrar a la carpeta
cd sego-scraper

# 2. Login
npx supabase login

# 3. Vincular (reemplaza abc123 con tu Reference ID)
npx supabase link --project-ref abc123

# 4. Desplegar
npx supabase functions deploy scrape_productos

# 5. Verificar
npx supabase functions list
```

---

## 🐛 Otros Errores Posibles

### "Docker is not running"
**No te preocupes.** Es solo una advertencia. La función se desplegará en la nube de Supabase, no necesitas Docker.

### "Project not linked"
Ejecuta:
```bash
npx supabase link --project-ref TU_PROJECT_REF
```

### "Invalid credentials"
Ejecuta:
```bash
npx supabase login
```

### "Function already exists"
Está bien, se actualizará. Continúa con el deploy.

---

## ✅ Verificar que Funcionó

### Opción 1: Desde la terminal
```bash
npx supabase functions list
```

Deberías ver `scrape_productos` en la lista.

### Opción 2: Desde Supabase Dashboard
1. Ve a tu proyecto en https://supabase.com
2. Edge Functions (en el menú lateral)
3. Deberías ver `scrape_productos`

---

## 🎯 Siguiente Paso

Una vez desplegada la función:

1. Asegúrate de que tu `.env` tenga las credenciales correctas
2. Ejecuta el proyecto:
   ```bash
   npm run dev
   ```
3. Abre http://localhost:5173
4. Haz login con tu usuario admin
5. Ve a la página Admin
6. Haz clic en "🔄 Actualizar Productos"

¡Listo! 🎉
