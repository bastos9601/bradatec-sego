# 📂 Estructura del Proyecto

```
sego-scraper/
│
├── 📄 Archivos de Configuración
│   ├── .env                    # Variables de entorno (TUS CREDENCIALES)
│   ├── .env.example            # Ejemplo de variables
│   ├── .gitignore              # Archivos ignorados por Git
│   ├── package.json            # Dependencias del proyecto
│   ├── vite.config.js          # Configuración de Vite
│   ├── tailwind.config.js      # Configuración de Tailwind CSS
│   ├── postcss.config.js       # Configuración de PostCSS
│   ├── eslint.config.js        # Configuración de ESLint
│   └── index.html              # HTML principal
│
├── 📚 Documentación
│   ├── README.md               # Documentación completa
│   ├── INSTRUCCIONES.md        # Guía paso a paso
│   └── ESTRUCTURA.md           # Este archivo
│
├── 📁 src/                     # Código fuente
│   ├── main.jsx                # Punto de entrada
│   ├── App.jsx                 # Componente principal con rutas
│   ├── index.css               # Estilos globales + Tailwind
│   │
│   ├── 📁 componentes/         # Componentes reutilizables
│   │   ├── Navbar.jsx          # Barra de navegación
│   │   └── ProductoCard.jsx    # Tarjeta de producto
│   │
│   ├── 📁 paginas/             # Páginas de la aplicación
│   │   ├── Login.jsx           # Página de login
│   │   ├── Dashboard.jsx       # Dashboard de productos
│   │   └── Admin.jsx           # Panel de administración
│   │
│   └── 📁 supabase/            # Configuración de Supabase
│       └── client.js           # Cliente de Supabase
│
├── 📁 supabase/                # Backend Supabase
│   ├── schema.sql              # Script SQL (tablas + RLS)
│   │
│   └── 📁 functions/           # Edge Functions
│       └── 📁 scrape_productos/
│           └── index.ts        # Función de scraping
│
├── 📁 public/                  # Archivos públicos
│   ├── favicon.svg
│   └── icons.svg
│
└── 📁 node_modules/            # Dependencias (generado)
```

## 🎯 Archivos Clave

### Frontend
- `src/App.jsx` - Rutas y navegación
- `src/paginas/Login.jsx` - Autenticación
- `src/paginas/Dashboard.jsx` - Vista de productos
- `src/paginas/Admin.jsx` - Panel admin con botón de scraping

### Backend
- `supabase/schema.sql` - Base de datos y seguridad
- `supabase/functions/scrape_productos/index.ts` - Lógica de scraping

### Configuración
- `.env` - **IMPORTANTE**: Agrega tus credenciales aquí
- `package.json` - Dependencias instaladas

## 🔧 Tecnologías

- **React 19** - Framework frontend
- **Vite 8** - Build tool
- **Tailwind CSS 3** - Estilos
- **React Router 6** - Navegación
- **Supabase** - Backend (Auth + DB + Functions)
- **Deno** - Runtime para Edge Functions

## 📦 Dependencias Principales

```json
{
  "@supabase/supabase-js": "Cliente de Supabase",
  "react": "Librería UI",
  "react-router-dom": "Navegación",
  "tailwindcss": "Estilos"
}
```

## 🚀 Comandos

```bash
npm run dev      # Desarrollo (localhost:5173)
npm run build    # Compilar para producción
npm run preview  # Vista previa de producción
```

## 📝 Notas

- Los archivos `.env` no se suben a Git (están en .gitignore)
- `node_modules/` se genera con `npm install`
- La carpeta `public/` contiene assets estáticos
- Las Edge Functions se despliegan con Supabase CLI
