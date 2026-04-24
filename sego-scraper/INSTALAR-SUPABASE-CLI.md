# 🔧 Cómo Instalar Supabase CLI en Windows

## ⚠️ Importante
`npm install -g supabase` ya NO funciona. Usa una de estas opciones:

---

## ✅ OPCIÓN 1: Usar NPX (Más Fácil - Sin Instalación)

No necesitas instalar nada. Simplemente usa `npx` antes de cada comando:

```bash
# Login
npx supabase login

# Vincular proyecto
npx supabase link --project-ref TU_PROJECT_REF

# Desplegar función
npx supabase functions deploy scrape_productos

# Ver funciones
npx supabase functions list
```

**Ventajas:**
- No requiere instalación
- Siempre usa la última versión
- Funciona inmediatamente

**Desventajas:**
- Un poco más lento (descarga cada vez)
- Debes escribir `npx` antes de cada comando

---

## ✅ OPCIÓN 2: Instalar con Scoop (Recomendado para uso frecuente)

### Paso 1: Instalar Scoop (si no lo tienes)

Abre PowerShell como administrador y ejecuta:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### Paso 2: Instalar Supabase CLI

```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Paso 3: Verificar instalación

```bash
supabase --version
```

### Paso 4: Usar normalmente

```bash
supabase login
supabase link --project-ref TU_PROJECT_REF
supabase functions deploy scrape_productos
```

**Ventajas:**
- Instalación permanente
- Comandos más cortos
- Actualizaciones fáciles con `scoop update supabase`

---

## ✅ OPCIÓN 3: Descargar Ejecutable Manualmente

### Paso 1: Descargar

1. Ve a: https://github.com/supabase/cli/releases
2. Busca la última versión
3. Descarga: `supabase_windows_amd64.zip`

### Paso 2: Extraer

1. Extrae el archivo ZIP
2. Encontrarás `supabase.exe`

### Paso 3: Agregar al PATH

**Opción A - Mover a System32:**
```bash
# Copia supabase.exe a:
C:\Windows\System32\
```

**Opción B - Crear carpeta personalizada:**
1. Crea carpeta: `C:\supabase\`
2. Mueve `supabase.exe` ahí
3. Agrega al PATH:
   - Busca "Variables de entorno" en Windows
   - Edita "Path" en Variables del sistema
   - Agrega: `C:\supabase`
   - Reinicia PowerShell

### Paso 4: Verificar

```bash
supabase --version
```

---

## 🎯 Recomendación para este Proyecto

**Para empezar rápido:** Usa **OPCIÓN 1 (NPX)**

```bash
cd sego-scraper
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
npx supabase functions deploy scrape_productos
```

**Para uso frecuente:** Instala con **OPCIÓN 2 (Scoop)**

---

## 📝 Comandos Útiles

### Con NPX:
```bash
npx supabase login
npx supabase projects list
npx supabase link --project-ref abc123
npx supabase functions deploy scrape_productos
npx supabase functions list
```

### Con Supabase instalado:
```bash
supabase login
supabase projects list
supabase link --project-ref abc123
supabase functions deploy scrape_productos
supabase functions list
```

---

## ❓ Solución de Problemas

### "supabase no se reconoce como comando"
- Si usas NPX: agrega `npx` antes del comando
- Si instalaste: verifica que esté en el PATH

### "Access denied" al instalar Scoop
- Abre PowerShell como Administrador
- Ejecuta: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Error al desplegar función
- Verifica que estés logueado: `npx supabase projects list`
- Verifica el project-ref en Settings > General en Supabase

---

## 🚀 Siguiente Paso

Una vez instalado, continúa con el **PASO 8** de `INSTRUCCIONES.md`
