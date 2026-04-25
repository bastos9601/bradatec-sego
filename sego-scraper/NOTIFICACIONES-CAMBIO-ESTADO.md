# 📬 Sistema de Notificaciones de Cambio de Estado de Pedidos

## ¿Cómo Funciona?

Cuando el admin cambia el estado de un pedido, el usuario recibe **dos notificaciones**:

### 1. **Notificación en Tiempo Real (En la Tienda)**
- Aparece como un toast en la esquina superior derecha
- Se muestra automáticamente cuando el usuario está en la tienda
- Desaparece después de 6 segundos
- Muestra:
  - Emoji del estado
  - Mensaje personalizado
  - Número de pedido
  - Total del pedido

### 2. **Notificación por WhatsApp**
- Se envía automáticamente al celular del usuario
- Incluye detalles completos del pedido
- Mensaje personalizado según el estado

## Componente: NotificacionPedido.jsx

### Ubicación
```
sego-scraper/src/componentes/NotificacionPedido.jsx
```

### Características
- ✅ Usa Supabase Realtime para escuchar cambios
- ✅ Solo se activa si el usuario está autenticado
- ✅ Solo muestra notificación si el estado cambió
- ✅ Colores diferentes según el estado
- ✅ Botón para cerrar manualmente
- ✅ Auto-cierre después de 6 segundos

### Cómo se Integra
```javascript
// En Tienda.jsx
import NotificacionPedido from '../componentes/NotificacionPedido'

// En el JSX
{usuario && <NotificacionPedido usuarioId={usuario.id} />}
```

## Estados y Emojis

| Estado | Emoji | Color | Mensaje |
|--------|-------|-------|---------|
| Pendiente | ⏳ | Amarillo | Tu pedido está pendiente de confirmación |
| Procesando | ⚙️ | Azul | Tu pedido está siendo procesado |
| Enviado | 🚚 | Púrpura | Tu pedido ha sido enviado y está en camino |
| Entregado | ✅ | Verde | Tu pedido ha sido entregado. ¡Gracias por tu compra! |
| Cancelado | ❌ | Rojo | Tu pedido ha sido cancelado |

## Flujo Completo

```
Admin Cambia Estado del Pedido
    ↓
Se Actualiza en Supabase
    ↓
┌─────────────────────────────────────┐
│ Supabase Realtime Detecta Cambio    │
└─────────────────────────────────────┘
    ↓
    ├─→ Notificación en Tiempo Real
    │   (Toast en la Tienda)
    │
    └─→ Notificación por WhatsApp
        (Mensaje automático)
```

## Implementación Técnica

### Suscripción a Cambios
```javascript
const subscription = supabase
  .channel(`pedidos-${usuarioId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'pedidos',
      filter: `usuario_id=eq.${usuarioId}`
    },
    (payload) => {
      // Mostrar notificación si el estado cambió
    }
  )
  .subscribe()
```

### Validación de Cambio
```javascript
// Solo mostrar si el estado cambió
if (pedidoActualizado.estado !== pedidoAnterior.estado) {
  mostrarNotificacion(pedidoActualizado)
}
```

## Estilos

### Animación
- Desliza desde la derecha
- Duración: 0.3 segundos
- Easing: ease-out

### Posición
- Fija en la esquina superior derecha
- Z-index: 50 (encima de otros elementos)
- Padding: 1rem (16px)

### Colores por Estado
```css
Pendiente: bg-yellow-100 border-yellow-400 text-yellow-800
Procesando: bg-blue-100 border-blue-400 text-blue-800
Enviado: bg-purple-100 border-purple-400 text-purple-800
Entregado: bg-green-100 border-green-400 text-green-800
Cancelado: bg-red-100 border-red-400 text-red-800
```

## Requisitos

### Supabase Realtime
- Debe estar habilitado en tu proyecto Supabase
- La tabla `pedidos` debe tener cambios detectables
- El usuario debe estar autenticado

### Permisos
- El usuario solo ve notificaciones de sus propios pedidos
- Filtro: `usuario_id=eq.{usuarioId}`

## Pruebas

### Para Probar Localmente
1. Abre la Tienda en una pestaña (usuario)
2. Abre el Admin en otra pestaña (admin)
3. Cambia el estado de un pedido del usuario
4. Verás la notificación aparecer en la pestaña de la Tienda

### Requisitos
- Usuario debe estar autenticado en la Tienda
- Usuario debe estar en la página de la Tienda
- El pedido debe ser del usuario autenticado

## Limitaciones

- ⚠️ Solo funciona si el usuario está en la Tienda
- ⚠️ Requiere conexión a internet
- ⚠️ Supabase Realtime debe estar habilitado
- ⚠️ La notificación desaparece después de 6 segundos

## Mejoras Futuras

- [ ] Guardar historial de notificaciones
- [ ] Notificaciones persistentes en la BD
- [ ] Centro de notificaciones
- [ ] Sonido de notificación
- [ ] Notificaciones por email
- [ ] Notificaciones por SMS

## Archivos Modificados

- ✅ `sego-scraper/src/componentes/NotificacionPedido.jsx` (NUEVO)
- ✅ `sego-scraper/src/paginas/Tienda.jsx` (Agregado import y componente)
- ✅ `sego-scraper/src/paginas/Admin.jsx` (Ya tenía envío de WhatsApp)

## Documentación Relacionada

- `NOTIFICACION-PEDIDOS.md` - Notificaciones del Admin
- `NOTIFICACIONES-ADMIN-PEDIDOS.md` - Sistema de notificaciones del Admin
- `PERFIL-USUARIO-IMPLEMENTADO.md` - Sistema de perfil de usuario

---

**Fecha de Implementación:** 2025-04-25
**Versión:** 1.0
**Estado:** ✅ COMPLETADO
