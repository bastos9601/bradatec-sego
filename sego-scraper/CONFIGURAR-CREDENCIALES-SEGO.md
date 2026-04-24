# 🔐 Configurar Credenciales de Sego

## Pasos para Agregar tus Credenciales

### 1. Tener una cuenta en Sego

Necesitas una cuenta activa en https://www.sego.com.pe

Si no tienes:
1. Ve a https://www.sego.com.pe/mi-cuenta/
2. Regístrate con tu email
3. Verifica tu cuenta

### 2. Ir a Supabase Edge Functions

1. Abre https://supabase.com
2. Selecciona tu proyecto: `sego-scraper-bradatec`
3. En el menú lateral, haz clic en **Edge Functions** (ícono de rayo ⚡)
4. Haz clic en **scrape_productos**

### 3. Configurar Secrets (Secretos)

1. Haz clic en la pestaña **Settings**
2. Busca la sección **Secrets**
3. Haz clic en **Add Secret** o **New Secret**

### 4. Agregar SEGO_USERNAME

1. Name: `SEGO_USERNAME`
2. Value: `tu_email_de_sego@gmail.com`
3. Haz clic en **Save** o **Add**

### 5. Agregar SEGO_PASSWORD

1. Haz clic en **Add Secret** nuevamente
2. Name: `SEGO_PASSWORD`
3. Value: `tu_contraseña_de_sego`
4. Haz clic en **Save** o **Add**

### 6. Verificar que se guardaron

Deberías ver:
```
SEGO_USERNAME: ••••••••••••••
SEGO_PASSWORD: ••••••••••••••
```

### 7. Redesplegar la Edge Function

```bash
cd sego-scraper
npx supabase functions deploy scrape_productos
```

### 8. Probar el Scraping

1. Ve a http://localhost:5173/admin
2. Haz clic en "🔄 Actualizar Productos"
3. Revisa los logs en Supabase:
   - Edge Functions > scrape_productos > Logs
   - Deberías ver: "Login exitoso, sesión iniciada"

---

## 🔍 Verificar que Funciona

### En los logs de Supabase deberías ver:

```
Iniciando scraping de Sego con autenticación...
Credenciales encontradas, iniciando sesión...
Cookies iniciales obtenidas
Login exitoso, sesión iniciada
HTML obtenido, buscando productos...
Productos encontrados con patrón 1
Productos encontrados: 15
```

### Si ves productos reales:

Los productos en tu dashboard ahora tendrán:
- ✅ Nombres reales de productos de Sego
- ✅ Precios actualizados
- ✅ Imágenes reales (si están disponibles)

---

## ❌ Solución de Problemas

### "No hay credenciales configuradas"

Verifica que:
1. Los nombres sean exactamente: `SEGO_USERNAME` y `SEGO_PASSWORD`
2. No haya espacios antes o después
3. Hayas guardado los secretos

### "Error en login"

Verifica que:
1. Tu usuario y contraseña sean correctos
2. Puedas iniciar sesión manualmente en https://www.sego.com.pe/mi-cuenta/
3. Tu cuenta esté activa

### "No se encontraron productos"

Puede ser que:
1. El login no funcionó (revisa logs)
2. La estructura HTML de Sego cambió
3. Necesitas ajustar los patrones de scraping

---

## 🔒 Seguridad

### Buenas Prácticas:

✅ **Usa Secrets de Supabase** (no pongas credenciales en el código)
✅ **No compartas tu contraseña** con nadie
✅ **Usa una contraseña fuerte** para Sego
✅ **Cambia tu contraseña** periódicamente

### NO hagas esto:

❌ No pongas credenciales en el archivo `.env`
❌ No subas credenciales a Git
❌ No compartas tu proyecto con las credenciales

---

## 📝 Resumen de Comandos

```bash
# 1. Configurar secretos en Supabase (vía web)
# 2. Redesplegar función
cd sego-scraper
npx supabase functions deploy scrape_productos

# 3. Reiniciar servidor
npm run dev

# 4. Probar en http://localhost:5173/admin
```

---

## 🎯 Resultado Esperado

Después de configurar las credenciales:

1. ✅ Login automático en Sego
2. ✅ Scraping de productos reales con precios
3. ✅ Actualización automática de la base de datos
4. ✅ Productos mostrados en el dashboard

---

## 📞 Ayuda Adicional

Si tienes problemas:
1. Revisa los logs en Supabase Edge Functions
2. Verifica que puedas iniciar sesión manualmente en Sego
3. Asegúrate de que los secretos estén configurados correctamente

¡Listo! Ahora tu sistema scrapeará productos reales de Sego. 🚀
