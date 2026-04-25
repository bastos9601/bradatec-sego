# 📱 Guía del Sistema de Perfil de Usuario

## 🎯 Acceso al Perfil

### En Desktop
1. Inicia sesión en la tienda
2. En la navbar superior derecha, verás el botón **👤 Perfil**
3. Haz clic para abrir el dropdown
4. Selecciona la opción que desees

### En Móvil
1. Inicia sesión en la tienda
2. El botón **👤 Perfil** aparece en la sección de controles móviles
3. Haz clic para abrir el dropdown
4. Selecciona la opción que desees

## 📋 Opciones del Dropdown

```
┌─────────────────────────────────┐
│  usuario@email.com              │
│  Mi Cuenta                      │
├─────────────────────────────────┤
│ 👤 Mi Cuenta                    │
│ 📦 Mis Órdenes                  │
│ ✏️ Editar Perfil                │
│ 🔐 Cambiar Contraseña           │
├─────────────────────────────────┤
│ 🚪 Cerrar Sesión                │
└─────────────────────────────────┘
```

## 📄 Página: Mi Cuenta

**URL:** `/mi-cuenta`

### Información Mostrada
- 📧 Email (no editable)
- 👤 Nombre Completo
- 📱 Celular
- 🔐 Rol (usuario/admin)
- ✅ Estado (Activo/Inactivo)
- 📅 Miembro desde (fecha)

### Botones de Acceso Rápido
- ✏️ Editar Perfil
- 🔐 Cambiar Contraseña
- 📦 Mis Órdenes

## 📦 Página: Mis Órdenes

**URL:** `/mis-ordenes`

### Lista de Órdenes
Cada orden muestra:
- Número de pedido (#XXXXXXXX)
- Estado con emoji:
  - ⏳ Pendiente (amarillo)
  - ⚙️ Procesando (azul)
  - 🚚 Enviado (púrpura)
  - ✅ Entregado (verde)
  - ❌ Cancelado (rojo)
- Fecha de creación
- Total del pedido

### Modal de Detalles
Al hacer clic en una orden, se abre un modal con:

**Información General:**
- Número de pedido
- Estado actual
- Fecha de creación
- Moneda (USD/PEN)

**Productos:**
- Imagen del producto
- Nombre
- Cantidad
- Precio

**Información de Envío:**
- Nombre del cliente
- Dirección completa
- Celular de contacto

**Resumen de Pago:**
- Subtotal (sin IGV)
- IGV (18%)
- Total

## ✏️ Página: Editar Perfil

**URL:** `/editar-perfil`

### Campos Editables
1. **Nombre Completo**
   - Campo de texto
   - Requerido
   - Se valida al guardar

2. **Número de Celular**
   - Campo de teléfono
   - Requerido
   - Se valida al guardar

3. **Email**
   - Solo lectura (no se puede cambiar)
   - Mostrado como referencia

### Proceso de Guardado
1. Completa los campos
2. Haz clic en "✓ Guardar Cambios"
3. Se validan los datos
4. Se guardan en la base de datos
5. Recibes confirmación de éxito
6. Se recarga la información

### Validaciones
- ❌ Nombre vacío → Error
- ❌ Celular vacío → Error
- ✅ Ambos campos completos → Guardar

## 🔐 Página: Cambiar Contraseña

**URL:** `/cambiar-contrasena`

### Campos Requeridos
1. **Contraseña Actual**
   - Se valida contra la contraseña actual
   - Botón para mostrar/ocultar
   - Requerido

2. **Contraseña Nueva**
   - Mínimo 6 caracteres
   - Debe ser diferente a la actual
   - Botón para mostrar/ocultar
   - Requerido

3. **Confirmar Contraseña Nueva**
   - Debe coincidir con la contraseña nueva
   - Botón para mostrar/ocultar
   - Requerido

### Proceso de Cambio
1. Ingresa tu contraseña actual
2. Ingresa la contraseña nueva
3. Confirma la contraseña nueva
4. Haz clic en "✓ Cambiar Contraseña"
5. Se validan todos los campos
6. Se cambia la contraseña
7. Recibes confirmación
8. Se redirige a Mi Cuenta

### Validaciones de Seguridad
- ❌ Contraseña actual incorrecta → Error
- ❌ Contraseña nueva < 6 caracteres → Error
- ❌ Contraseña nueva = contraseña actual → Error
- ❌ Contraseñas nuevas no coinciden → Error
- ✅ Todas las validaciones pasadas → Cambiar

## 🔒 Requisitos de Seguridad

### Para Cambiar Contraseña
- Mínimo 6 caracteres
- Debe ser diferente a la actual
- Debe confirmarse correctamente
- Se valida la contraseña actual

### Para Editar Perfil
- Nombre no puede estar vacío
- Celular no puede estar vacío
- Email no se puede cambiar

### Protección General
- Verificación de autenticación en todas las páginas
- Redirección automática a login si no está autenticado
- Mensajes de error claros
- Confirmaciones de éxito

## 💡 Consejos

1. **Contraseña Segura**
   - Usa una combinación de letras y números
   - Evita contraseñas obvias
   - Cambia tu contraseña regularmente

2. **Información Actualizada**
   - Mantén tu celular actualizado
   - Verifica que tu nombre sea correcto
   - Esto es importante para recibir notificaciones

3. **Órdenes**
   - Puedes ver el estado de tus órdenes en tiempo real
   - Haz clic en una orden para ver todos los detalles
   - Guarda el número de pedido para referencia

## ❓ Preguntas Frecuentes

**P: ¿Puedo cambiar mi email?**
R: No, el email no se puede cambiar desde aquí. Contacta con soporte si necesitas cambiar tu email.

**P: ¿Qué pasa si olvido mi contraseña?**
R: Usa la opción "¿Olvidaste tu contraseña?" en la página de login.

**P: ¿Cuánto tiempo tarda en cambiar mi contraseña?**
R: El cambio es inmediato. Serás desconectado después del cambio.

**P: ¿Puedo ver órdenes antiguas?**
R: Sí, todas tus órdenes se guardan en el historial. Puedes verlas en "Mis Órdenes".

**P: ¿Cómo recibo notificaciones de mis órdenes?**
R: Recibirás notificaciones por WhatsApp al celular registrado en tu perfil.
