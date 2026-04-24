# Desplegar Sistema en Netlify

## Guía Completa de Despliegue

Esta guía te ayudará a desplegar tu aplicación de catálogo web en Netlify.

## Requisitos Previos

- ✅ Cuenta en Netlify (gratis): https://www.netlify.com
- ✅ Cuenta en GitHub (para conectar el repositorio)
- ✅ Proyecto funcionando localmente

## Paso 1: Preparar el Proyecto

### 1.1 Crear archivo de configuración de Netlify

Crea el archivo `netlify.toml` en la carpeta `sego-scraper`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 1.2 Verificar package.json

Asegúrate de que tu `package.json` tenga el script de build:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 1.3 Crear archivo .gitignore (si no existe)

```
node_modules
dist
.env
.env.local
*.log
```

## Paso 2: Subir a GitHub

### 2.1 Inicializar Git (si no lo has hecho)

```bash
cd sego-scraper
git init
git add .
git commit -m "Initial commit - Sistema de catálogo Bradatec"
```

### 2.2 Crear repositorio en GitHub

1. Ve a https://github.com
2. Haz clic en "New repository"
3. Nombre: `bradatec-catalogo` (o el que prefieras)
4. Descripción: "Sistema de catálogo web con Supabase"
5. Privado o Público (tu elección)
6. NO inicialices con README
7. Haz clic en "Create repository"

### 2.3 Conectar y subir

```bash
git remote add origin https://github.com/TU_USUARIO/bradatec-catalogo.git
git branch -M main
git push -u origin main
```

## Paso 3: Desplegar en Netlify

### 3.1 Conectar con GitHub

1. Ve a https://app.netlify.com
2. Haz clic en "Add new site" → "Import an existing project"
3. Selecciona "GitHub"
4. Autoriza Netlify a acceder a tu GitHub
5. Busca y selecciona tu repositorio `bradatec-catalogo`

### 3.2 Configurar Build Settings

En la página de configuración:

- **Branch to deploy**: `main`
- **Base directory**: `sego-scraper`
- **Build command**: `npm run build`
- **Publish directory**: `sego-scraper/dist`

### 3.3 Configurar Variables de Entorno

Antes de desplegar, agrega las variables de entorno:

1. En la página de configuración, ve a "Advanced build settings"
2. Haz clic en "New variable"
3. Agrega estas variables:

```
VITE_SUPABASE_URL = https://sajuzexibgpikrijqdjt.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

(Copia los valores de tu archivo `.env`)

### 3.4 Desplegar

1. Haz clic en "Deploy site"
2. Espera a que termine el build (2-5 minutos)
3. ¡Tu sitio estará en línea!

## Paso 4: Configurar Dominio Personalizado (Opcional)

### 4.1 Usar subdominio de Netlify

Por defecto, tu sitio estará en: `https://random-name-123.netlify.app`

Para cambiar el nombre:
1. Ve a "Site settings" → "Domain management"
2. Haz clic en "Options" → "Edit site name"
3. Cambia a: `bradatec-catalogo.netlify.app`

### 4.2 Usar tu propio dominio

Si tienes un dominio (ej: `bradatec.com`):

1. Ve a "Domain management" → "Add custom domain"
2. Ingresa tu dominio: `www.bradatec.com`
3. Sigue las instrucciones para configurar DNS
4. Netlify te dará los registros DNS que debes agregar en tu proveedor de dominio

## Paso 5: Configurar Supabase para Producción

### 5.1 Actualizar Site URL en Supabase

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Authentication" → "URL Configuration"
4. En **Site URL**, cambia a: `https://bradatec-catalogo.netlify.app`
5. En **Redirect URLs**, agrega:
   - `https://bradatec-catalogo.netlify.app/reset-password`
   - `https://bradatec-catalogo.netlify.app/**`

### 5.2 Configurar CORS (si es necesario)

En Supabase Dashboard:
1. Ve a "Settings" → "API"
2. En "CORS Allowed Origins", agrega:
   - `https://bradatec-catalogo.netlify.app`

## Paso 6: Verificar el Despliegue

### 6.1 Probar funcionalidades

Visita tu sitio y verifica:

- ✅ Página principal carga correctamente
- ✅ Productos se muestran
- ✅ Login funciona
- ✅ Registro funciona
- ✅ Panel admin accesible
- ✅ Crear pedidos funciona
- ✅ Notificaciones de WhatsApp funcionan

### 6.2 Revisar errores

Si algo no funciona:
1. Ve a Netlify Dashboard → "Deploys" → Tu último deploy
2. Haz clic en "Deploy log" para ver errores de build
3. Revisa la consola del navegador (F12) para errores de runtime

## Paso 7: Actualizaciones Futuras

### 7.1 Despliegue Automático

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Netlify detectará el push y desplegará automáticamente.

### 7.2 Despliegue Manual

Si prefieres control manual:
1. Ve a "Site settings" → "Build & deploy"
2. Cambia "Build mode" a "Stop builds"
3. Para desplegar, haz clic en "Trigger deploy" → "Deploy site"

## Solución de Problemas

### Error: "Build failed"

**Causa**: Error en el proceso de build

**Solución**:
1. Revisa el "Deploy log" en Netlify
2. Verifica que `npm run build` funcione localmente
3. Asegúrate de que todas las dependencias estén en `package.json`

### Error: "Page not found" en rutas

**Causa**: Falta configuración de redirects

**Solución**:
- Verifica que el archivo `netlify.toml` esté en la raíz de `sego-scraper`
- Verifica que tenga la configuración de redirects

### Error: "Supabase connection failed"

**Causa**: Variables de entorno no configuradas

**Solución**:
1. Ve a "Site settings" → "Environment variables"
2. Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén configuradas
3. Redespliega el sitio

### Productos no cargan

**Causa**: CORS o políticas RLS

**Solución**:
1. Verifica CORS en Supabase
2. Verifica que las políticas RLS permitan lectura pública de productos
3. Revisa la consola del navegador para errores específicos

## Comandos Útiles

### Build local para probar

```bash
npm run build
npm run preview
```

### Ver logs de Netlify

```bash
netlify logs
```

### Desplegar desde CLI (opcional)

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Checklist Final

Antes de considerar el despliegue completo:

- [ ] Sitio accesible en la URL de Netlify
- [ ] Todas las páginas cargan correctamente
- [ ] Login y registro funcionan
- [ ] Panel admin accesible solo para admins
- [ ] Productos se muestran correctamente
- [ ] Carrito de compras funciona
- [ ] Checkout y creación de pedidos funciona
- [ ] Notificaciones de WhatsApp funcionan
- [ ] Recuperación de contraseña funciona
- [ ] Site URL configurada en Supabase
- [ ] Variables de entorno configuradas en Netlify

## Recursos Adicionales

- Documentación de Netlify: https://docs.netlify.com
- Documentación de Vite: https://vitejs.dev
- Documentación de Supabase: https://supabase.com/docs
- Soporte de Netlify: https://answers.netlify.com

## Costos

- **Netlify**: Gratis para proyectos pequeños (100GB bandwidth/mes)
- **Supabase**: Gratis hasta 500MB de base de datos
- **Dominio personalizado**: $10-15/año (opcional)

¡Tu sistema está listo para producción! 🚀
