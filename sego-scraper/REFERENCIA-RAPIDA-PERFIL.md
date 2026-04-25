# ⚡ Referencia Rápida - Sistema de Perfil

## 🎯 Acceso Rápido

| Función | URL | Componente | Descripción |
|---------|-----|-----------|-------------|
| Mi Cuenta | `/mi-cuenta` | MiCuenta.jsx | Ver información del perfil |
| Mis Órdenes | `/mis-ordenes` | MisOrdenes.jsx | Ver historial de compras |
| Editar Perfil | `/editar-perfil` | EditarPerfil.jsx | Actualizar datos personales |
| Cambiar Contraseña | `/cambiar-contrasena` | CambiarContrasena.jsx | Cambiar contraseña de acceso |

## 🔗 Rutas en App.jsx

```javascript
<Route path="/mi-cuenta" element={<MiCuenta />} />
<Route path="/mis-ordenes" element={<MisOrdenes />} />
<Route path="/editar-perfil" element={<EditarPerfil />} />
<Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
```

## 📦 Importaciones

```javascript
import MiCuenta from './paginas/MiCuenta'
import MisOrdenes from './paginas/MisOrdenes'
import EditarPerfil from './paginas/EditarPerfil'
import CambiarContrasena from './paginas/CambiarContrasena'
```

## 🎨 Colores Utilizados

| Elemento | Color | Clase |
|----------|-------|-------|
| Primario | Azul | `bg-blue-600` |
| Hover | Azul Oscuro | `bg-blue-700` |
| Éxito | Verde | `bg-green-100` |
| Error | Rojo | `bg-red-100` |
| Info | Azul Claro | `bg-blue-50` |

## 🔐 Validaciones

### Editar Perfil
- Nombre: Requerido, no vacío
- Celular: Requerido, no vacío

### Cambiar Contraseña
- Contraseña Actual: Requerida, debe ser correcta
- Contraseña Nueva: Mínimo 6 caracteres, diferente a la actual
- Confirmar: Debe coincidir con la nueva

## 📊 Estados

| Estado | Emoji | Color | Clase |
|--------|-------|-------|-------|
| Pendiente | ⏳ | Amarillo | `bg-yellow-100` |
| Procesando | ⚙️ | Azul | `bg-blue-100` |
| Enviado | 🚚 | Púrpura | `bg-purple-100` |
| Entregado | ✅ | Verde | `bg-green-100` |
| Cancelado | ❌ | Rojo | `bg-red-100` |

## 🔄 Flujos Principales

### Acceder a Mi Cuenta
```
Navbar → 👤 Perfil ▼ → Mi Cuenta
```

### Editar Perfil
```
Mi Cuenta → ✏️ Editar Perfil → Cambiar Datos → Guardar
```

### Cambiar Contraseña
```
Mi Cuenta → 🔐 Cambiar Contraseña → Ingresar Datos → Cambiar
```

### Ver Órdenes
```
Mi Cuenta → 📦 Mis Órdenes → Ver Lista → Clic en Orden → Modal
```

## 💾 Tablas Supabase Utilizadas

| Tabla | Campos Utilizados |
|-------|------------------|
| perfiles | id, nombre, celular, email, rol, activo, created_at |
| pedidos | id, usuario_id, estado, productos, total, moneda, created_at |
| auth.users | email, password |

## 🧪 Pruebas Rápidas

### Verificar Autenticación
```javascript
const { data: { user } } = await supabase.auth.getUser()
console.log(user) // Debe mostrar usuario o null
```

### Obtener Perfil
```javascript
const { data } = await supabase
  .from('perfiles')
  .select('*')
  .eq('id', userId)
  .single()
```

### Obtener Órdenes
```javascript
const { data } = await supabase
  .from('pedidos')
  .select('*')
  .eq('usuario_id', userId)
```

## 🎯 Puntos Clave

✅ Todas las páginas verifican autenticación
✅ Redirección automática a login si no está autenticado
✅ Validaciones en cliente y servidor
✅ Mensajes de error claros
✅ Responsive en todos los dispositivos
✅ Seguridad implementada

## 📱 Breakpoints

| Dispositivo | Ancho | Clase |
|------------|-------|-------|
| Móvil | < 768px | `md:hidden` |
| Tablet | 768px - 1024px | `md:flex` |
| Desktop | > 1024px | `md:flex` |

## 🔧 Funciones Principales

### MiCuenta.jsx
- `verificarUsuario()` - Verifica autenticación
- `useEffect()` - Carga datos al montar

### MisOrdenes.jsx
- `verificarUsuario()` - Verifica autenticación
- `obtenerPedidos()` - Obtiene órdenes del usuario
- `getEstadoColor()` - Retorna color según estado
- `getEstadoEmoji()` - Retorna emoji según estado

### EditarPerfil.jsx
- `verificarUsuario()` - Verifica autenticación
- `handleChange()` - Actualiza estado del formulario
- `handleSubmit()` - Valida y guarda cambios

### CambiarContrasena.jsx
- `verificarUsuario()` - Verifica autenticación
- `handleChange()` - Actualiza estado del formulario
- `toggleMostrarPassword()` - Muestra/oculta contraseña
- `handleSubmit()` - Valida y cambia contraseña

## 🚀 Despliegue

1. Verificar que no hay errores de sintaxis
2. Probar todas las rutas
3. Verificar validaciones
4. Probar en móvil y desktop
5. Desplegar a producción

## 📞 Soporte Rápido

**Problema:** Página en blanco
**Solución:** Verificar autenticación, revisar consola

**Problema:** Validación no funciona
**Solución:** Revisar campos requeridos, verificar lógica

**Problema:** Datos no se guardan
**Solución:** Verificar conexión a Supabase, revisar permisos

**Problema:** Dropdown no abre
**Solución:** Verificar estado `perfilDropdownAbierto`, revisar onClick

## 📚 Documentación Relacionada

- `PERFIL-USUARIO-IMPLEMENTADO.md` - Documentación técnica
- `GUIA-PERFIL-USUARIO.md` - Guía de usuario
- `DIAGRAMA-PERFIL-USUARIO.md` - Diagramas y arquitectura
- `CHECKLIST-PERFIL-USUARIO.md` - Checklist de implementación

---

**Última Actualización:** 2025-04-25
**Versión:** 1.0
