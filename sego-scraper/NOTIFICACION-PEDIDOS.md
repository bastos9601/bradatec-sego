# Notificación de Pedidos - Toast

## 🎯 Funcionalidad
Cuando el admin accede al Panel de Administración, aparece una notificación "tostada" (toast) en la esquina superior derecha indicando cuántos pedidos pendientes tiene.

## 📋 Características

### 1. Notificación Visual
- **Ubicación**: Esquina superior derecha
- **Color**: Púrpura (🛒 icono de carrito)
- **Duración**: 6 segundos (se cierra automáticamente)
- **Animación**: Desliza desde la derecha

### 2. Mensaje Dinámico
```
📦 Tienes 1 pedido pendiente
📦 Tienes 3 pedidos pendientes
```

### 3. Cierre Manual
- Botón ✕ para cerrar manualmente
- Se cierra automáticamente después de 6 segundos

## 🔧 Componentes Creados

### 1. Toast.jsx
Componente reutilizable para mostrar notificaciones:
```javascript
<Toast 
  mensaje="Tu mensaje"
  tipo="pedido"
  onClose={() => setMensaje('')}
  duracion={6000}
/>
```

**Tipos disponibles**:
- `success` - Verde ✅
- `error` - Rojo ❌
- `warning` - Amarillo ⚠️
- `info` - Azul ℹ️
- `pedido` - Púrpura 🛒

### 2. Integración en Admin.jsx
- Importación del componente Toast
- Estado para controlar el mensaje y tipo
- Función mejorada `obtenerPedidos()` que detecta pedidos pendientes

### 3. Animación CSS
Agregada en `tailwind.config.js`:
```javascript
keyframes: {
  slideIn: {
    '0%': { transform: 'translateX(400px)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' }
  }
}
```

## 📊 Flujo

```
1. Admin accede al Panel
   ↓
2. Se cargan los pedidos
   ↓
3. Se detectan pedidos pendientes
   ↓
4. Se muestra notificación toast
   ↓
5. Se cierra automáticamente después de 6 segundos
```

## 🎨 Estilos

### Notificación Toast
```
- Fondo: Púrpura (bg-purple-500)
- Texto: Blanco
- Padding: 1.5rem (px-6 py-4)
- Sombra: shadow-lg
- Esquina redondeada: rounded-lg
- Posición: fixed top-4 right-4
- Z-index: 50 (encima de todo)
```

### Animación
```
- Duración: 0.3s
- Easing: ease-out
- Efecto: Desliza desde la derecha
```

## 💡 Ejemplos

### Ejemplo 1: 1 Pedido Pendiente
```
📦 Tienes 1 pedido pendiente
```

### Ejemplo 2: 3 Pedidos Pendientes
```
📦 Tienes 3 pedidos pendientes
```

### Ejemplo 3: Sin Pedidos Pendientes
```
(No aparece notificación)
```

## 🚀 Próximos Pasos

1. **Netlify se redesplegará automáticamente** con los cambios
2. **Prueba la funcionalidad**:
   - Ve al Admin Panel
   - Deberías ver la notificación si hay pedidos pendientes
   - La notificación se cierra automáticamente después de 6 segundos

## 📝 Archivos Modificados
- `sego-scraper/src/componentes/Toast.jsx` - Nuevo componente
- `sego-scraper/src/paginas/Admin.jsx` - Integración del toast
- `sego-scraper/tailwind.config.js` - Animación CSS

## 🔒 Seguridad
- ✅ Solo muestra información de pedidos pendientes
- ✅ No expone datos sensibles
- ✅ Se cierra automáticamente

## ⚙️ Configuración

### Cambiar Duración
En `Admin.jsx`:
```javascript
<Toast 
  duracion={10000}  // 10 segundos
/>
```

### Cambiar Tipo de Notificación
En `obtenerPedidos()`:
```javascript
setToastTipo('warning');  // Cambiar a amarillo
```

### Cambiar Mensaje
En `obtenerPedidos()`:
```javascript
setToastMensaje(`Tienes ${pedidosPendientes.length} pedidos`);
```

## 🧪 Testing

Para probar:
1. Crea un pedido desde la tienda
2. Accede al Admin Panel
3. Deberías ver la notificación toast
4. Verifica que se cierre automáticamente

## 📱 Responsive
- ✅ Funciona en desktop
- ✅ Funciona en tablet
- ✅ Funciona en móvil
- ✅ Se adapta al tamaño de pantalla

## 🎯 Mejoras Futuras
- Sonido de notificación
- Notificación del navegador (browser notification)
- Actualización en tiempo real (WebSocket)
- Historial de notificaciones
