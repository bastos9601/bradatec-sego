# Configurar Notificaciones de Pedidos por WhatsApp

## ✅ Funcionalidad Implementada

Cuando un usuario crea un pedido, se abre automáticamente WhatsApp con un mensaje pre-formateado para notificar al administrador.

## Configuración

### Paso 1: Agregar Número de WhatsApp del Admin

1. Abre el archivo `.env` en la carpeta `sego-scraper`
2. Agrega esta línea al final:
   ```
   VITE_ADMIN_WHATSAPP=51999999999
   ```
3. Reemplaza `51999999999` con el número real del admin
4. Guarda el archivo

### Formato del Número:
- **Incluir código de país** (sin el símbolo +)
- **Sin espacios, guiones ni paréntesis**
- **Solo números**

**Ejemplos:**
- Perú: `51987654321`
- México: `5215512345678`
- España: `34612345678`
- Argentina: `5491123456789`

### Paso 2: Reiniciar el Servidor de Desarrollo

Después de modificar el `.env`, reinicia el servidor:

```bash
# Detener el servidor (Ctrl+C)
# Iniciar nuevamente
npm run dev
```

## Cómo Funciona

### Flujo Completo:

1. **Usuario crea un pedido**
   - Completa el formulario de checkout
   - Hace clic en "Confirmar Pedido"

2. **Pedido se guarda en la base de datos**
   - Se crea el registro en la tabla `pedidos`
   - Estado inicial: "pendiente"

3. **Se abre WhatsApp automáticamente**
   - WhatsApp Web o App se abre en una nueva ventana
   - Mensaje pre-formateado con todos los detalles del pedido
   - Dirigido al número del admin configurado

4. **Admin recibe la notificación**
   - El admin ve el mensaje en WhatsApp
   - Puede revisar los detalles del pedido
   - Puede responder directamente al cliente si es necesario

### Contenido del Mensaje:

El mensaje incluye:
- 🛒 Título "NUEVO PEDIDO RECIBIDO"
- 📦 ID del pedido (primeros 8 caracteres)
- 📅 Fecha y hora
- 👤 Información del cliente (nombre, email, celular, dirección)
- 📋 Lista de productos con cantidades y precios
- 💰 Total del pedido (con subtotal e IGV)
- ⚠️ Recordatorio para procesar el pedido

**Ejemplo de mensaje:**
```
🛒 NUEVO PEDIDO RECIBIDO 🛒

📦 Pedido #1f5a7188
📅 24/04/2026 10:30:45

👤 Cliente:
Nombre: Juan Pérez
Email: juan@email.com
Celular: 987654321
Dirección: Av. Principal 123, Lima

📋 Productos:
1. Cámara de Seguridad HD
   Cantidad: 2
   Precio: S/ 299.00

2. DVR 8 Canales
   Cantidad: 1
   Precio: S/ 450.00

💰 Total: S/ 1,048.00
(Subtotal: S/ 888.14 + IGV: S/ 159.86)

⚠️ Acción requerida: Revisar y procesar este pedido en el panel admin.
```

## Ventajas de WhatsApp

✅ **Instantáneo** - Notificación inmediata en el celular del admin
✅ **Sin configuración compleja** - No requiere SMTP ni Edge Functions
✅ **Comunicación directa** - El admin puede responder al cliente
✅ **Historial** - Todos los pedidos quedan registrados en WhatsApp
✅ **Multiplataforma** - Funciona en web, móvil y desktop
✅ **Confiable** - No depende de emails que pueden ir a spam

## Solución de Problemas

### No se abre WhatsApp:
- Verifica que el número esté en el formato correcto (código país + número)
- Verifica que hayas reiniciado el servidor después de modificar `.env`
- Verifica que WhatsApp esté instalado o que puedas acceder a WhatsApp Web

### El mensaje no llega al admin:
- Verifica que el número del admin sea correcto
- Verifica que el admin tenga WhatsApp activo en ese número
- El mensaje se abre en el navegador/app, el admin debe enviarlo manualmente

### Quiero cambiar el número del admin:
1. Edita el archivo `.env`
2. Cambia el valor de `VITE_ADMIN_WHATSAPP`
3. Reinicia el servidor (`npm run dev`)

## Personalización

Si quieres modificar el mensaje que se envía al admin, edita el archivo:
`sego-scraper/src/componentes/ModalCheckout.jsx`

Busca la sección que dice:
```javascript
let mensajeAdmin = `🛒 *NUEVO PEDIDO RECIBIDO* 🛒\n\n`
```

Y modifica el contenido según tus necesidades.

## Alternativas

Si prefieres otro método de notificación:

### Email:
- Requiere configurar SMTP en Supabase
- Requiere desplegar Edge Function
- Ver: `DESPLEGAR-EDGE-FUNCTION-PASSWORD.md`

### Notificación en el Panel Admin:
- Requiere implementar Supabase Realtime
- Requiere que el admin tenga el panel abierto
- Menos confiable que WhatsApp

### Ambos (WhatsApp + Email):
- Redundancia para asegurar que el admin reciba la notificación
- Requiere configuración adicional

## Recomendación

Para la mayoría de casos, **WhatsApp es la mejor opción** porque:
- Es instantáneo
- No requiere configuración compleja
- El admin siempre tiene su celular a mano
- Permite comunicación bidireccional con el cliente
