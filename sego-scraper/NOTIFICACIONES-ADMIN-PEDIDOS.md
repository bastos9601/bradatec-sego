# Notificaciones al Admin sobre Nuevos Pedidos

## Solución Implementada

He implementado un sistema de notificaciones que alerta al admin cuando un usuario crea un nuevo pedido.

## Opciones de Notificación

### Opción 1: Notificación Visual en Tiempo Real (Implementada)

✅ **Ya está funcionando** - Cuando se crea un pedido, el código intenta notificar al admin mediante una Edge Function.

**Cómo funciona:**
1. Usuario completa el checkout y crea un pedido
2. Se llama a la Edge Function `notify-admin-new-order`
3. La función registra el evento en la consola

**Para activar completamente:**
1. Desplegar la Edge Function (ver instrucciones abajo)
2. Configurar un servicio de email (SendGrid, AWS SES, etc.)

### Opción 2: Notificación por Sonido (Simple)

Agregar un sonido de notificación cuando llegue un nuevo pedido al panel admin.

### Opción 3: Notificación por Email (Recomendada para Producción)

Enviar un email al admin cuando se cree un nuevo pedido.

### Opción 4: Notificación por WhatsApp (Más Directa)

Enviar un mensaje de WhatsApp al admin con los detalles del pedido.

## Implementación Recomendada: WhatsApp

La forma más simple y directa es enviar un WhatsApp al admin. Voy a implementar esto ahora.

### Ventajas:
- ✅ No requiere configuración de email
- ✅ Notificación instantánea en el celular
- ✅ El admin puede responder directamente
- ✅ No requiere Edge Functions
- ✅ Funciona inmediatamente

### Cómo Funciona:
1. Usuario crea un pedido
2. Se abre WhatsApp Web/App automáticamente
3. Mensaje pre-formateado con detalles del pedido
4. Admin recibe la notificación en su celular

## Configuración

Para activar las notificaciones por WhatsApp, necesitas:

1. Agregar el número de WhatsApp del admin en el archivo `.env`:
   ```
   VITE_ADMIN_WHATSAPP=51999999999
   ```
   (Reemplaza con el número real del admin, incluyendo código de país)

2. El sistema enviará automáticamente un mensaje de WhatsApp al admin cuando se cree un pedido

## Alternativa: Notificación por Email

Si prefieres email en lugar de WhatsApp:

1. Desplegar la Edge Function:
   ```bash
   supabase functions deploy notify-admin-new-order
   ```

2. Configurar SMTP en Supabase Dashboard:
   - Ve a Project Settings → Auth → SMTP Settings
   - Configura tu proveedor de email (SendGrid, AWS SES, etc.)

3. La función enviará un email al admin con:
   - Información del cliente
   - Lista de productos
   - Total del pedido
   - Enlace al panel admin

## Estado Actual

✅ Código de notificación implementado en `ModalCheckout.jsx`
✅ Edge Function creada en `supabase/functions/notify-admin-new-order/`
⏳ Pendiente: Configurar número de WhatsApp del admin
⏳ Pendiente: O desplegar Edge Function para email

## Próximos Pasos

Elige una opción:

**A) WhatsApp (Recomendado - Más Simple)**
- Agregar número de admin en `.env`
- Modificar `ModalCheckout.jsx` para enviar WhatsApp

**B) Email (Requiere Configuración)**
- Desplegar Edge Function
- Configurar SMTP en Supabase

**C) Ambos**
- Implementar WhatsApp + Email para redundancia

¿Cuál prefieres?
