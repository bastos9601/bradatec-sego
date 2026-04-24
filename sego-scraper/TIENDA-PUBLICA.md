# 🛍️ Tienda Pública - Catálogo Bradatec

## ✅ Cambios Realizados

La aplicación ahora funciona como una tienda online pública donde cualquier persona puede ver los productos sin necesidad de iniciar sesión.

### Estructura de Rutas

**Antes:**
- `/` → Redirigía a `/login`
- `/login` → Login obligatorio
- `/dashboard` → Productos (requería login)
- `/admin` → Panel admin (requería login)

**Ahora:**
- `/` → **Tienda pública** (sin login requerido)
- `/admin/login` → Login solo para administradores
- `/admin` → Panel admin (requiere login de admin)

### Páginas

1. **Tienda Pública (`/`)**
   - Acceso sin login
   - Muestra todos los productos
   - Filtros por categoría y búsqueda
   - Navbar con botón "Acceso Admin"
   - Footer con información de Bradatec
   - Diseño moderno con hero section

2. **Login Admin (`/admin/login`)**
   - Solo para administradores
   - Botón para volver a la tienda
   - Redirige a `/admin` después del login

3. **Panel Admin (`/admin`)**
   - Requiere autenticación
   - Gestión de productos
   - Importar productos desde Sego
   - Eliminar productos
   - Ver estadísticas

### Características de la Tienda Pública

✅ **Sin autenticación requerida**
- Cualquiera puede ver los productos
- No se necesita cuenta ni login

✅ **Búsqueda y filtros**
- Búsqueda por nombre de producto
- Filtro por categoría
- Contador de productos filtrados
- Botón para limpiar filtros

✅ **Diseño profesional**
- Hero section con gradiente
- Cards de productos con hover effects
- Badges de categoría y stock
- Responsive (móvil, tablet, desktop)
- Footer corporativo

✅ **Información completa del producto**
- Imagen del producto
- Nombre
- SKU
- Stock (badge verde)
- Precio con IGV
- Categoría
- Fecha de agregado

### Cómo Usar

**Para visitantes (público):**
1. Abre http://localhost:5173
2. Explora los productos
3. Usa los filtros para buscar
4. No se requiere login

**Para administradores:**
1. Haz clic en "Acceso Admin" en el navbar
2. Inicia sesión con tus credenciales
3. Gestiona productos desde el panel admin
4. Importa productos desde Sego
5. Haz clic en "Ver Tienda" para volver a la vista pública

### Seguridad

- Los productos son de solo lectura para el público
- Solo los administradores pueden:
  - Agregar productos
  - Eliminar productos
  - Importar desde Sego
  - Ver estadísticas
- Las políticas RLS de Supabase protegen la base de datos

### Próximos Pasos (Opcional)

Si quieres mejorar la tienda, puedes agregar:
- [ ] Página de detalle de producto
- [ ] Carrito de compras
- [ ] Sistema de cotizaciones
- [ ] Compartir productos en redes sociales
- [ ] Exportar catálogo a PDF
- [ ] Comparador de productos
- [ ] Productos relacionados
- [ ] Historial de precios

## 🚀 Comandos

```bash
# Iniciar la aplicación
npm run dev

# Iniciar el servidor de scraping (para admin)
npm run server

# Scrapear productos localmente
npm run scrape
```

## 📱 URLs

- **Tienda pública**: http://localhost:5173
- **Login admin**: http://localhost:5173/admin/login
- **Panel admin**: http://localhost:5173/admin

## 🎨 Personalización

Puedes personalizar la tienda editando:
- `src/paginas/Tienda.jsx` - Página principal
- `src/componentes/ProductoCard.jsx` - Tarjetas de productos
- `tailwind.config.js` - Colores y estilos

¡La tienda está lista para usar! 🎉
