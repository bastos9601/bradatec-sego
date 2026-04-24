# 🚨 CONFIGURAR SECRETS DE SEGO AHORA

## El Problema

La función está usando productos de ejemplo porque **NO encuentra las credenciales de Sego**.

Los logs muestran:
```
SEGO_USERNAME configurado: NO
SEGO_PASSWORD configurado: NO
```

---

## ✅ SOLUCIÓN (3 minutos)

### PASO 1: Ir a Supabase

1. Abre: https://supabase.com
2. Inicia sesión
3. Selecciona tu proyecto: **sego-scraper-bradatec**

### PASO 2: Ir a Edge Functions Settings

1. En el menú lateral izquierdo, busca **Edge Functions** (ícono de rayo ⚡)
2. Haz clic en **scrape_productos**
3. Haz clic en la pestaña **Settings** (arriba)
4. Desplázate hasta encontrar **Secrets** o **Environment Variables**

### PASO 3: Agregar SEGO_USERNAME

1. Haz clic en **Add Secret** o **New Secret**
2. En el campo **Name**, escribe exactamente: `SEGO_USERNAME`
3. En el campo **Value**, escribe tu email de Sego
4. Haz clic en **Save** o **Add**

### PASO 4: Agregar SEGO_PASSWORD

1. Haz clic en **Add Secret** nuevamente
2. En el campo **Name**, escribe exactamente: `SEGO_PASSWORD`
3. En el campo **Value**, escribe tu contraseña de Sego
4. Haz clic en **Save** o **Add**

### PASO 5: Verificar

Deberías ver algo como:
```
SEGO_USERNAME: ••••••••••••••
SEGO_PASSWORD: ••••••••••••••
```

### PASO 6: Redesplegar la Función

Abre tu terminal y ejecuta:

```bash
cd sego-scraper
npx supabase functions deploy scrape_productos
```

Espera a que termine (verás "Deployed Function scrape_productos").

### PASO 7: Probar

1. Ve a http://localhost:5173/admin
2. Haz clic en **"🔄 Actualizar Productos"**
3. Ve a Supabase > Edge Functions > scrape_productos > **Logs**

Ahora deberías ver:
```
✓ Credenciales encontradas, iniciando sesión en Sego...
Usuario: tu_email@gmail.com
✓ Cookies iniciales obtenidas: SÍ
✓ Login exitoso, sesión iniciada
Productos encontrados: X
```

---

## 📸 Dónde Están los Secrets

```
Supabase Dashboard
│
├── Edge Functions (menú lateral)
│   └── scrape_productos
│       └── Settings (pestaña superior)
│           └── Secrets (sección en la página)
│               ├── [Add Secret] ← Haz clic aquí
│               │
│               ├── Name: SEGO_USERNAME
│               │   Value: [tu_email@gmail.com]
│               │   [Save]
│               │
│               └── Name: SEGO_PASSWORD
│                   Value: [tu_contraseña]
│                   [Save]
```

---

## ❌ Errores Comunes

### "No veo la sección Secrets"

Puede estar en:
- **Settings** > **Secrets**
- **Settings** > **Environment Variables**
- **Configuration** > **Secrets**

### "Los secrets no se guardan"

- Verifica que hayas hecho clic en **Save** o **Add**
- Recarga la página para verificar
- Asegúrate de estar en el proyecto correcto

### "Sigue usando productos de ejemplo"

1. Verifica que los secrets estén guardados
2. Redesplega la función: `npx supabase functions deploy scrape_productos`
3. Espera 1-2 minutos para que se actualice
4. Prueba nuevamente

---

## 🔍 Verificar en los Logs

Después de configurar y redesplegar, los logs deberían mostrar:

```
SEGO_USERNAME configurado: SÍ  ← Debe decir SÍ
SEGO_PASSWORD configurado: SÍ  ← Debe decir SÍ
✓ Credenciales encontradas
✓ Login exitoso
```

Si dice "NO", los secrets no están configurados correctamente.

---

## 📞 Ayuda Rápida

Si tienes problemas:

1. **Verifica el nombre exacto**: `SEGO_USERNAME` y `SEGO_PASSWORD` (sin espacios)
2. **Verifica el valor**: Tu email y contraseña de Sego
3. **Redesplega**: `npx supabase functions deploy scrape_productos`
4. **Espera**: 1-2 minutos después de redesplegar
5. **Revisa logs**: Supabase > Edge Functions > scrape_productos > Logs

---

¡Configura los secrets ahora y tendrás productos reales de Sego! 🚀
