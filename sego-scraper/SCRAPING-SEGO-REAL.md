# 🔍 Cómo Scrapear Productos Reales de Sego

## El Problema

Sego requiere **iniciar sesión** para ver los precios de los productos. Por eso el scraping básico no funciona.

---

## ✅ Soluciones

### Opción 1: Scraping con Autenticación (Recomendado)

Para scrapear productos reales con precios, necesitas:

1. **Credenciales de Sego**: Usuario y contraseña
2. **Simular el login** en la Edge Function
3. **Mantener la sesión** con cookies

#### Implementación:

Agrega esto a la Edge Function:

```typescript
// Login en Sego
const loginResponse = await fetch('https://www.sego.com.pe/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0',
  },
  body: new URLSearchParams({
    username: Deno.env.get('SEGO_USERNAME') ?? '',
    password: Deno.env.get('SEGO_PASSWORD') ?? '',
  }),
})

// Obtener cookies de sesión
const cookies = loginResponse.headers.get('set-cookie')

// Hacer scraping con la sesión activa
const response = await fetch('https://www.sego.com.pe/productos', {
  headers: {
    'Cookie': cookies,
    'User-Agent': 'Mozilla/5.0',
  },
})
```

#### Configurar credenciales en Supabase:

1. Ve a tu proyecto en Supabase
2. **Edge Functions** > **scrape_productos** > **Settings**
3. Agrega secretos:
   - `SEGO_USERNAME`: tu usuario de Sego
   - `SEGO_PASSWORD`: tu contraseña de Sego

---

### Opción 2: API de Sego (Si existe)

Si Sego tiene una API pública o privada:

```typescript
const response = await fetch('https://api.sego.com.pe/productos', {
  headers: {
    'Authorization': `Bearer ${Deno.env.get('SEGO_API_KEY')}`,
  },
})
```

Contacta a Sego para obtener acceso a su API.

---

### Opción 3: Usar Datos de Ejemplo Realistas (Actual)

La función actual usa un catálogo de productos de construcción típicos con precios aproximados.

**Ventajas:**
- ✅ Funciona inmediatamente
- ✅ No requiere credenciales
- ✅ Demuestra el sistema completo

**Desventajas:**
- ❌ No son precios reales de Sego
- ❌ No se actualizan automáticamente

---

### Opción 4: Scraping Manual + Actualización

1. Scrapea manualmente los productos de Sego
2. Guárdalos en un archivo JSON
3. Importa el JSON a la base de datos

#### Ejemplo:

```sql
-- Insertar productos reales de Sego
INSERT INTO productos (nombre, precio, imagen) VALUES
('Cemento Sol Tipo I x 42.5kg', 'S/ 29.90', 'https://sego.com.pe/img/cemento-sol.jpg'),
('Fierro Corrugado 3/8" x 9m', 'S/ 24.50', 'https://sego.com.pe/img/fierro-38.jpg'),
-- ... más productos
```

---

## 🚀 Implementar Scraping con Login

### Paso 1: Actualizar la Edge Function

Reemplaza el código de scraping con:

```typescript
// Realizar login
console.log('Iniciando sesión en Sego...')

const loginResponse = await fetch('https://www.sego.com.pe/wp-login.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  body: new URLSearchParams({
    log: Deno.env.get('SEGO_USERNAME') ?? '',
    pwd: Deno.env.get('SEGO_PASSWORD') ?? '',
    'wp-submit': 'Acceder',
    redirect_to: 'https://www.sego.com.pe/productos',
  }),
  redirect: 'manual',
})

// Extraer cookies
const setCookieHeaders = loginResponse.headers.getSetCookie()
const cookies = setCookieHeaders.map(cookie => cookie.split(';')[0]).join('; ')

console.log('Sesión iniciada, obteniendo productos...')

// Scrapear con sesión activa
const response = await fetch('https://www.sego.com.pe/productos', {
  headers: {
    'Cookie': cookies,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
})

const html = await response.text()

// Extraer productos con precios reales
// ... (código de scraping)
```

### Paso 2: Configurar Secretos

En Supabase:
1. Edge Functions > scrape_productos > Settings
2. Secrets:
   - `SEGO_USERNAME`: tu_usuario
   - `SEGO_PASSWORD`: tu_contraseña

### Paso 3: Redesplegar

```bash
npx supabase functions deploy scrape_productos
```

---

## 📝 Notas Importantes

### Legalidad y Ética:
- ✅ Asegúrate de tener permiso para scrapear Sego
- ✅ Respeta los términos de servicio
- ✅ No hagas scraping excesivo (rate limiting)
- ✅ Considera contactar a Sego para acceso API oficial

### Alternativas:
1. **Contactar a Sego**: Pedir acceso a API o feed de productos
2. **Integración oficial**: Convertirte en partner de Sego
3. **Actualización manual**: Actualizar precios periódicamente

---

## 🎯 Recomendación

Para un proyecto de producción:
1. Contacta a Sego para acceso oficial a sus datos
2. Usa su API si está disponible
3. Si no, implementa scraping con autenticación (Opción 1)
4. Agrega rate limiting y caché para no sobrecargar su servidor

---

## 🔧 Versión Actual

La versión actual usa productos de ejemplo porque:
- No tenemos credenciales de Sego
- Demuestra el sistema completo funcionando
- Puedes reemplazar con scraping real cuando tengas acceso

Para usar productos reales, implementa la Opción 1 con tus credenciales de Sego.
