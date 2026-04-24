# Configurar Email de Recuperación de Contraseña

## Funcionalidad Implementada

✅ Botón "¿Olvidaste tu contraseña?" en la página de login
✅ Formulario para ingresar email y solicitar recuperación
✅ Página para restablecer contraseña con nuevo password
✅ Validaciones de seguridad (mínimo 6 caracteres, confirmación)

## Configuración en Supabase

Para que funcione el envío de emails, necesitas configurar las plantillas de email en Supabase:

### Paso 1: Ir a Configuración de Auth

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Email Templates** en el menú lateral

### Paso 2: Configurar la Plantilla "Reset Password"

1. Selecciona la plantilla **"Reset Password"**
2. Verifica que la URL de redirección sea correcta:
   ```
   {{ .SiteURL }}/reset-password
   ```
3. Personaliza el mensaje si lo deseas (opcional)
4. Guarda los cambios

### Paso 3: Configurar Site URL (Importante)

1. Ve a **Authentication** → **URL Configuration**
2. En **Site URL**, ingresa la URL de tu aplicación:
   - Para desarrollo local: `http://localhost:5173`
   - Para producción: `https://tudominio.com`
3. En **Redirect URLs**, agrega:
   - `http://localhost:5173/reset-password` (desarrollo)
   - `https://tudominio.com/reset-password` (producción)
4. Guarda los cambios

### Paso 4: Configurar Email Provider (Opcional)

Por defecto, Supabase usa su propio servicio de email, pero tiene límites:
- 3 emails por hora en el plan gratuito
- Para producción, se recomienda configurar tu propio proveedor (SendGrid, AWS SES, etc.)

Para configurar un proveedor personalizado:
1. Ve a **Project Settings** → **Auth**
2. Scroll hasta **SMTP Settings**
3. Configura tu proveedor de email
4. Guarda los cambios

## Cómo Usar

### Para Usuarios:

1. Ve a la página de login: http://localhost:5173/admin/login
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa tu email
4. Haz clic en "Enviar Correo de Recuperación"
5. Revisa tu bandeja de entrada (y spam)
6. Haz clic en el enlace del correo
7. Ingresa tu nueva contraseña
8. Confirma la contraseña
9. Haz clic en "Actualizar Contraseña"
10. Serás redirigido al login automáticamente

### Flujo Completo:

```
Login → ¿Olvidaste tu contraseña? 
  ↓
Formulario de Recuperación (ingresa email)
  ↓
Email enviado ✓
  ↓
Usuario recibe email con enlace
  ↓
Clic en enlace → Página Reset Password
  ↓
Ingresa nueva contraseña + confirmar
  ↓
Contraseña actualizada ✓
  ↓
Redirige a Login
```

## Verificar que Funciona

### Prueba Local:

1. Abre http://localhost:5173/admin/login
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa un email válido registrado
4. Verifica que aparezca el mensaje de éxito
5. Revisa tu email
6. Sigue el enlace y cambia la contraseña

### Solución de Problemas:

**No llega el email:**
- Verifica que el email esté registrado en la base de datos
- Revisa la carpeta de spam
- Verifica la configuración de Site URL en Supabase
- Verifica que no hayas excedido el límite de emails (3/hora en plan gratuito)

**Error "Enlace inválido o expirado":**
- Los enlaces de recuperación expiran después de 1 hora
- Solicita un nuevo enlace de recuperación

**Error al actualizar contraseña:**
- Verifica que la contraseña tenga al menos 6 caracteres
- Verifica que ambas contraseñas coincidan
- Intenta cerrar sesión y volver a intentar

## Personalización del Email (Opcional)

Puedes personalizar el email de recuperación en Supabase:

1. Ve a **Authentication** → **Email Templates** → **Reset Password**
2. Edita el HTML del email
3. Variables disponibles:
   - `{{ .Email }}` - Email del usuario
   - `{{ .Token }}` - Token de recuperación
   - `{{ .TokenHash }}` - Hash del token
   - `{{ .SiteURL }}` - URL de tu sitio
   - `{{ .ConfirmationURL }}` - URL completa de confirmación

Ejemplo de plantilla personalizada:
```html
<h2>Recuperar Contraseña - Bradatec</h2>
<p>Hola,</p>
<p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<p><a href="{{ .ConfirmationURL }}">Restablecer Contraseña</a></p>
<p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
<p>Este enlace expirará en 1 hora.</p>
<p>Saludos,<br>Equipo Bradatec</p>
```

## Seguridad

- Los enlaces de recuperación expiran después de 1 hora
- Solo se puede usar un enlace una vez
- La contraseña debe tener mínimo 6 caracteres
- Se requiere confirmación de contraseña
- Después de cambiar la contraseña, se cierra la sesión automáticamente
