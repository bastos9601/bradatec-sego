# 🛒 Sego Scraper - Sistema de Web Scraping con React y Supabase

Sistema completo de web scraping que extrae productos de Sego Perú y los muestra en una interfaz moderna con autenticación y roles.

## 🚀 Tecnologías

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + Edge Functions)
- **Scraping**: Supabase Edge Functions con Deno

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta en Supabase (gratis en https://supabase.com)
- Supabase CLI instalado (opcional, para desarrollo local)

## 🔧 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

#### A. Crear proyecto en Supabase
1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto
3. Guarda tu URL y ANON KEY

#### B. Configurar base de datos
1. En el panel de Supabase, ve a "SQL Editor"
2. Copia y pega el contenido de `supabase/schema.sql`
3. Ejecuta el script

#### C. Crear usuario admin
En el SQL Editor de Supabase:

```sql
-- Primero crea un usuario desde Authentication > Users en el panel
-- Luego actualiza su rol a admin:
UPDATE perfiles SET rol = 'admin' WHERE id = 'TU_USER_ID';
```

#### D. Desplegar Edge Function

Instala Supabase CLI (elige una opción):

**Opción 1 - Windows con Scoop:**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Opción 2 - Descargar ejecutable:**
Descarga desde: https://github.com/supabase/cli/releases

**Opción 3 - Usar NPX (sin instalar):**
```bash
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
npx supabase functions deploy scrape_productos
```

Si instalaste con Scoop, continúa:

Inicia sesión:
```bash
supabase login
```

Vincula tu proyecto:
```bash
supabase link --project-ref TU_PROJECT_REF
```

Despliega la función:
```bash
supabase functions deploy scrape_productos
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

### 4. Ejecutar el proyecto

```bash
npm run dev
```

Abre http://localhost:5173

## 👤 Usuarios de Prueba

Crea usuarios desde el panel de Supabase:
1. Ve a Authentication > Users
2. Crea un usuario con email y contraseña
3. Para hacerlo admin, ejecuta en SQL Editor:

```sql
UPDATE perfiles SET rol = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

## 🎯 Funcionalidades

### Usuario Normal
- ✅ Login con email/contraseña
- ✅ Ver productos scrapeados
- ✅ Interfaz responsive

### Usuario Admin
- ✅ Todo lo anterior
- ✅ Botón para ejecutar scraping manual
- ✅ Ver estadísticas
- ✅ Panel de administración

## 🔐 Seguridad (RLS)

Las políticas de Row Level Security están configuradas:
- Usuarios normales: solo lectura de productos
- Admins: lectura, inserción y actualización
- Cada usuario solo ve su propio perfil

## 🤖 Automatización (Opcional)

Para ejecutar el scraping automáticamente cada hora:

1. En Supabase, ve a Database > Extensions
2. Habilita `pg_cron`
3. Ejecuta en SQL Editor:

```sql
SELECT cron.schedule(
  'scrape-productos-hourly',
  '0 * * * *', -- Cada hora
  $$
  SELECT net.http_post(
    url := 'https://tu-proyecto.supabase.co/functions/v1/scrape_productos',
    headers := '{"Authorization": "Bearer TU_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

## 📁 Estructura del Proyecto

```
sego-scraper/
├── src/
│   ├── componentes/
│   │   ├── Navbar.jsx
│   │   └── ProductoCard.jsx
│   ├── paginas/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── Admin.jsx
│   ├── supabase/
│   │   └── client.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   ├── functions/
│   │   └── scrape_productos/
│   │       └── index.ts
│   └── schema.sql
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env
```

## 🐛 Solución de Problemas

### Error: "No autorizado"
- Verifica que las variables de entorno estén correctas
- Asegúrate de estar logueado

### Error: "Acceso denegado"
- Verifica que tu usuario tenga rol 'admin' en la tabla perfiles

### No se encuentran productos
- La función usa datos de ejemplo si no puede scrapear
- Verifica que la Edge Function esté desplegada correctamente

### Error al desplegar Edge Function
```bash
# Verifica que estés logueado
supabase login

# Verifica que el proyecto esté vinculado
supabase projects list
supabase link --project-ref TU_PROJECT_REF

# Despliega nuevamente
supabase functions deploy scrape_productos
```

## 📝 Notas Importantes

- El scraping usa regex para extraer datos (alternativa a cheerio en Deno)
- Si no encuentra productos reales, usa datos de ejemplo
- La estructura del HTML de Sego puede cambiar, ajusta los regex en `index.ts`
- Respeta los términos de servicio del sitio web objetivo

## 🚀 Despliegue a Producción

### Vercel/Netlify
```bash
npm run build
```

Configura las variables de entorno en tu plataforma de hosting.

### Variables necesarias:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📄 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue primero para discutir los cambios.


## 🤖 Scraping Real de Productos

### ⚠️ IMPORTANTE: Edge Functions NO soportan Puppeteer

Supabase Edge Functions usan Deno (serverless) y **NO pueden ejecutar Puppeteer**.

### ✅ 3 Opciones Disponibles:

#### 1. Script Local con Puppeteer (RECOMENDADO para scraping real)

```bash
# Instalar
npm install puppeteer @supabase/supabase-js

# Configurar credenciales en scraper-local.js
# Ejecutar
node scraper-local.js
```

**Lee `SCRAPING-LOCAL.md` y `SOLUCION-DEFINITIVA.md` para detalles completos.**

#### 2. Importar Productos (RÁPIDO para demos)

En el panel admin, clic en **"📦 Importar Productos Sego"** - 15 productos reales en 2 segundos.

#### 3. Agregar Manual

Formulario en el panel admin para agregar productos uno por uno.

---

## 📊 Comparación de Opciones

| Solución | Productos | Velocidad | Configuración |
|----------|-----------|-----------|---------------|
| **Script Local** | Todos los reales | 2-5 min | Media |
| **Importar** | 15 reales | 2 seg | Ninguna |
| **Manual** | Los que quieras | Variable | Ninguna |

**Para tu trabajo: Usa "Importar" para demos rápidas, o "Script Local" para scraping real.**
