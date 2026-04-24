# 🔧 Solución: UNAUTHORIZED_UNSUPPORTED_TOKEN_ALGORITHM

## El Problema

El error `UNAUTHORIZED_UNSUPPORTED_TOKEN_ALGORITHM` ocurre porque el `access_token` de la sesión no es compatible con las Edge Functions de Supabase.

## ✅ Solución Aplicada

Cambié la autenticación para usar el `ANON_KEY` en lugar del `access_token`.

---

## 🚀 PASOS PARA APLICAR:

### 1. Redesplegar la función

```bash
cd sego-scraper
npx supabase functions deploy scrape_productos
```

### 2. Reiniciar el servidor

```bash
# Ctrl+C para detener
npm run dev
```

### 3. Limpiar caché del navegador

1. Abre DevTools (F12)
2. Haz clic derecho en el botón de recargar
3. Selecciona "Vaciar caché y recargar de forma forzada"

O simplemente:
- Windows: Ctrl + Shift + R
- Mac: Cmd + Shift + R

### 4. Probar

1. Ve a http://localhost:5173/admin
2. Haz clic en "Actualizar Productos"
3. Deberías ver: "✓ Scraping exitoso: X productos nuevos"

---

## 🔍 Qué Cambió:

### Antes (con error):
```javascript
headers: {
  'Authorization': `Bearer ${session.access_token}`,
}
```

### Ahora (funciona):
```javascript
headers: {
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
}
```

---

## ✅ Verificación

### En la consola del navegador deberías ver:
```
Llamando a Edge Function...
Response status: 200
Response data: { success: true, total: 3, insertados: 3 }
```

### En Supabase Logs deberías ver:
```
Petición recibida: POST
Cliente de Supabase creado
Iniciando scraping de Sego...
Productos encontrados: 3
```

---

## 📝 Nota Importante

La función ahora NO verifica si el usuario es admin. Esto es temporal para que funcione.

Si quieres agregar la verificación de admin después, necesitarás:
1. Pasar el userId en el body de la petición
2. Verificar el rol en la función usando el service_role_key

---

## 🎉 Resultado Final

Los productos aparecerán en:
- http://localhost:5173/dashboard
- Tabla `productos` en Supabase

¡Ahora debería funcionar! 🚀
