# Despliegue Rápido a Netlify - Guía de 5 Minutos

## Pasos Rápidos

### 1. Subir a GitHub (2 minutos)

```bash
cd sego-scraper
git init
git add .
git commit -m "Sistema Bradatec listo para producción"
git remote add origin https://github.com/TU_USUARIO/bradatec-catalogo.git
git push -u origin main
```

### 2. Desplegar en Netlify (2 minutos)

1. Ve a https://app.netlify.com
2. "Add new site" → "Import from Git" → "GitHub"
3. Selecciona tu repositorio
4. Configuración:
   - Base directory: `sego-scraper`
   - Build command: `npm run build`
   - Publish directory: `sego-scraper/dist`
5. Agrega variables de entorno:
   - `VITE_SUPABASE_URL` = (tu URL de Supabase)
   - `VITE_SUPABASE_ANON_KEY` = (tu clave de Supabase)
6. "Deploy site"

### 3. Configurar Supabase (1 minuto)

1. Ve a Supabase Dashboard → Authentication → URL Configuration
2. Site URL: `https://tu-sitio.netlify.app`
3. Redirect URLs: `https://tu-sitio.netlify.app/**`

## ¡Listo! 🚀

Tu sitio estará en línea en: `https://tu-sitio.netlify.app`

## Actualizaciones Futuras

```bash
git add .
git commit -m "Actualización"
git push
```

Netlify desplegará automáticamente.

---

Para más detalles, ver: `DESPLEGAR-NETLIFY.md`
