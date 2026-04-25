# 📊 Diagrama del Sistema de Perfil de Usuario

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICACIÓN BRADATEC                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              NAVBAR (Tienda.jsx)                     │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ Logo | Búsqueda | Moneda | T.C | 👤 Perfil ▼ │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ DROPDOWN MENU (Perfil)                       │   │  │
│  │  ├──────────────────────────────────────────────┤   │  │
│  │  │ usuario@email.com                            │   │  │
│  │  │ Mi Cuenta                                    │   │  │
│  │  ├──────────────────────────────────────────────┤   │  │
│  │  │ 👤 Mi Cuenta          → /mi-cuenta           │   │  │
│  │  │ 📦 Mis Órdenes        → /mis-ordenes         │   │  │
│  │  │ ✏️ Editar Perfil      → /editar-perfil       │   │  │
│  │  │ 🔐 Cambiar Contraseña → /cambiar-contrasena  │   │  │
│  │  ├──────────────────────────────────────────────┤   │  │
│  │  │ 🚪 Cerrar Sesión                             │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CONTENIDO PRINCIPAL                     │  │
│  │  (Tienda, Productos, Carrito, etc.)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🗺️ Mapa de Rutas

```
/
├── / (Tienda - Catálogo)
├── /registro (Registro de Usuario)
├── /admin/login (Login Admin)
├── /admin (Panel Admin)
├── /reset-password (Recuperar Contraseña)
│
└── [USUARIO AUTENTICADO]
    ├── /mi-cuenta (MiCuenta.jsx)
    │   ├── Información del Perfil
    │   ├── Botón → Editar Perfil
    │   ├── Botón → Cambiar Contraseña
    │   └── Botón → Mis Órdenes
    │
    ├── /mis-ordenes (MisOrdenes.jsx)
    │   ├── Lista de Órdenes
    │   ├── Modal de Detalles
    │   │   ├── Información General
    │   │   ├── Productos
    │   │   ├── Información de Envío
    │   │   └── Resumen de Pago
    │   └── Botón → Mi Cuenta
    │
    ├── /editar-perfil (EditarPerfil.jsx)
    │   ├── Campo: Nombre
    │   ├── Campo: Celular
    │   ├── Botón: Guardar Cambios
    │   └── Botón: Cancelar
    │
    └── /cambiar-contrasena (CambiarContrasena.jsx)
        ├── Campo: Contraseña Actual
        ├── Campo: Contraseña Nueva
        ├── Campo: Confirmar Contraseña
        ├── Botón: Cambiar Contraseña
        └── Botón: Cancelar
```

## 🔄 Flujo de Navegación

```
INICIO
  │
  ├─→ [NO AUTENTICADO]
  │   ├─→ Tienda (sin precios)
  │   ├─→ Registro
  │   └─→ Login
  │
  └─→ [AUTENTICADO]
      │
      ├─→ Tienda (con precios)
      │   │
      │   └─→ Navbar: 👤 Perfil ▼
      │       │
      │       ├─→ Mi Cuenta
      │       │   ├─→ Ver Información
      │       │   ├─→ Editar Perfil
      │       │   ├─→ Cambiar Contraseña
      │       │   └─→ Mis Órdenes
      │       │
      │       ├─→ Mis Órdenes
      │       │   ├─→ Ver Lista
      │       │   ├─→ Ver Detalles (Modal)
      │       │   └─→ Mi Cuenta
      │       │
      │       ├─→ Editar Perfil
      │       │   ├─→ Actualizar Datos
      │       │   └─→ Mi Cuenta
      │       │
      │       ├─→ Cambiar Contraseña
      │       │   ├─→ Cambiar Acceso
      │       │   └─→ Mi Cuenta
      │       │
      │       └─→ Cerrar Sesión
      │           └─→ Tienda (sin autenticación)
      │
      └─→ Admin (si es admin)
          └─→ Panel de Administración
```

## 📄 Estructura de Componentes

```
App.jsx
├── BrowserRouter
│   └── Routes
│       ├── Route: / → Tienda
│       ├── Route: /registro → Registro
│       ├── Route: /admin/login → Login
│       ├── Route: /admin → Admin
│       ├── Route: /reset-password → ResetPassword
│       ├── Route: /mi-cuenta → MiCuenta ✨ NUEVO
│       ├── Route: /mis-ordenes → MisOrdenes ✨ NUEVO
│       ├── Route: /editar-perfil → EditarPerfil ✨ NUEVO
│       └── Route: /cambiar-contrasena → CambiarContrasena ✨ NUEVO
```

## 🔐 Flujo de Autenticación

```
┌─────────────────────────────────────────┐
│ Usuario Intenta Acceder a /mi-cuenta    │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ verificarUsuario()                      │
│ - Obtiene usuario de Supabase Auth      │
│ - Obtiene perfil de tabla perfiles      │
└─────────────────────────────────────────┘
              │
              ├─→ [NO AUTENTICADO]
              │   └─→ Redirige a /admin/login
              │
              └─→ [AUTENTICADO]
                  └─→ Muestra página con datos
```

## 💾 Flujo de Datos - Editar Perfil

```
Usuario Completa Formulario
              │
              ▼
handleSubmit()
              │
              ├─→ Validar Nombre (no vacío)
              │
              ├─→ Validar Celular (no vacío)
              │
              ├─→ [VALIDACIÓN FALLIDA]
              │   └─→ Mostrar Error
              │
              └─→ [VALIDACIÓN EXITOSA]
                  │
                  ▼
              supabase.from('perfiles').update()
                  │
                  ├─→ [ERROR]
                  │   └─→ Mostrar Error
                  │
                  └─→ [ÉXITO]
                      │
                      ▼
                  Mostrar Confirmación
                      │
                      ▼
                  Recargar Datos
```

## 🔐 Flujo de Datos - Cambiar Contraseña

```
Usuario Completa Formulario
              │
              ▼
handleSubmit()
              │
              ├─→ Validar Contraseña Actual (no vacía)
              ├─→ Validar Contraseña Nueva (≥6 caracteres)
              ├─→ Validar Coincidencia (nueva = confirmar)
              ├─→ Validar Diferencia (nueva ≠ actual)
              │
              ├─→ [VALIDACIÓN FALLIDA]
              │   └─→ Mostrar Error Específico
              │
              └─→ [VALIDACIÓN EXITOSA]
                  │
                  ▼
              supabase.auth.signInWithPassword()
              (Verificar contraseña actual)
                  │
                  ├─→ [CONTRASEÑA INCORRECTA]
                  │   └─→ Mostrar Error
                  │
                  └─→ [CONTRASEÑA CORRECTA]
                      │
                      ▼
                  supabase.auth.updateUser()
                  (Cambiar contraseña)
                      │
                      ├─→ [ERROR]
                      │   └─→ Mostrar Error
                      │
                      └─→ [ÉXITO]
                          │
                          ▼
                      Mostrar Confirmación
                          │
                          ▼
                      Redirigir a /mi-cuenta
```

## 📊 Flujo de Datos - Mis Órdenes

```
Usuario Accede a /mis-ordenes
              │
              ▼
verificarUsuario()
              │
              ├─→ [NO AUTENTICADO]
              │   └─→ Redirige a /admin/login
              │
              └─→ [AUTENTICADO]
                  │
                  ▼
              obtenerPedidos(userId)
                  │
                  ▼
              supabase.from('pedidos').select()
              .eq('usuario_id', userId)
                  │
                  ├─→ [ERROR]
                  │   └─→ Mostrar Error
                  │
                  └─→ [ÉXITO]
                      │
                      ▼
                  Mostrar Lista de Órdenes
                      │
                      ├─→ [LISTA VACÍA]
                      │   └─→ Mostrar Mensaje "Sin Órdenes"
                      │
                      └─→ [ÓRDENES ENCONTRADAS]
                          │
                          ├─→ Mostrar Cada Orden
                          │   ├─→ Número
                          │   ├─→ Estado (con color)
                          │   ├─→ Fecha
                          │   └─→ Total
                          │
                          └─→ Al Hacer Clic
                              └─→ Abrir Modal de Detalles
```

## 🎨 Estados Visuales

```
BOTÓN PERFIL
├── Normal: bg-blue-700 text-white
├── Hover: bg-blue-800
└── Activo: Dropdown visible

DROPDOWN MENU
├── Fondo: bg-white
├── Texto: text-gray-800
├── Hover Items: hover:bg-blue-50
├── Cerrar Sesión: text-red-600 hover:bg-red-50
└── Sombra: shadow-xl

FORMULARIOS
├── Input Normal: border-gray-300 focus:ring-blue-500
├── Input Deshabilitado: bg-gray-100 cursor-not-allowed
├── Botón Primario: bg-blue-600 hover:bg-blue-700
├── Botón Secundario: bg-gray-500 hover:bg-gray-600
└── Botón Peligro: bg-red-600 hover:bg-red-700

MENSAJES
├── Éxito: bg-green-100 text-green-800
├── Error: bg-red-100 text-red-800
└── Info: bg-blue-50 text-blue-800
```

## 🔄 Ciclo de Vida de Componentes

```
MiCuenta.jsx
├── useEffect (al montar)
│   ├── verificarUsuario()
│   │   ├── Obtener usuario de Auth
│   │   ├── Obtener perfil de BD
│   │   └── Establecer estado
│   └── setLoading(false)
│
├── Renderizar
│   ├── Si loading: Mostrar spinner
│   └── Si no loading: Mostrar datos
│
└── Cleanup (al desmontar)
    └── Ninguno (no hay suscripciones)
```

## 📱 Responsividad

```
DESKTOP (md:)
├── Navbar: Horizontal
├── Dropdown: Alineado a la derecha
├── Contenido: 2 columnas
└── Botones: Lado a lado

TABLET (sm:)
├── Navbar: Horizontal (comprimido)
├── Dropdown: Alineado a la derecha
├── Contenido: 1-2 columnas
└── Botones: Apilados

MÓVIL
├── Navbar: Vertical (colapsable)
├── Dropdown: Alineado a la derecha
├── Contenido: 1 columna
└── Botones: Apilados verticalmente
```

---

**Diagrama Actualizado:** 2025-04-25
**Versión:** 1.0
