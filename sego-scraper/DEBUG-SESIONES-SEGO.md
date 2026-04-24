# 🔍 DEBUG: Sesiones de Sego No Detectan Productos

## 🎯 Problema Actual
Después de cargar cookies guardadas, el scraping muestra "0 productos detectados".

## 🔬 Diagnóstico

### Paso 1: Verificar que las Cookies se Guardan Correctamente

**En los logs de Railway al conectar cuenta:**
```
💾 Guardando cookies: X cookies encontradas
🔑 Cookies importantes: [session_id, frontend_lang, ...]
✅ Sesión de Sego guardada correctamente
```

**Si no ves esto:**
- Las cookies no se están guardando
- Verificar que la migración SQL se aplicó
- Verificar que userId se envía correctamente

### Paso 2: Verificar que las Cookies se Cargan Correctamente

**En los logs de Railway al importar productos:**
```
✅ Sesión encontrada, usando cookies guardadas
🔧 Cookies a cargar: X
📍 En página base, cargando cookies...
🔄 Cookies cargadas, navegando a tienda...
📍 En página de categoría CCTV
```

**Si no ves esto:**
- Las cookies no se están cargando desde la BD
- Verificar que userId coincide con el de la sesión guardada

### Paso 3: Verificar que la Sesión es Válida

**En los logs de Railway:**
```
🧪 Está logueado: true
✅ Sesión válida, continuando scraping...
✅ Selector de productos encontrado
🧪 Productos detectados en página inicial: 24
🔗 URL actual: https://www.sego.com.pe/shop/category/cctv-108
```

**Si ves "Está logueado: false":**
- La sesión expiró (cookies duran ~24 horas)
- Volver a conectar cuenta de Sego

**Si ves "Productos detectados: 0":**
- La página no cargó correctamente
- Revisar screenshot: `debug-session-loaded.png`
- Puede ser problema de selectores

## 🔧 Soluciones Según el Problema

### Problema 1: Cookies No se Guardan
```javascript
// Verificar en Supabase Table Editor
// Tabla: sego_sessions
// Debe haber un registro con tu user_id
```

**Solución:**
1. Aplicar migración SQL (ver `APLICAR-MIGRACION-SESIONES.md`)
2. Verificar permisos RLS en Supabase
3. Volver a conectar cuenta

### Problema 2: Sesión Expira Inmediatamente
Esto puede pasar si:
- Las cookies tienen `domain` incorrecto
- Las cookies tienen `sameSite` restrictivo
- Sego detecta que es un bot

**Solución:**
```javascript
// Modificar cómo se guardan las cookies
const cookies = await page.cookies();
const cookiesLimpias = cookies.map(c => ({
  name: c.name,
  value: c.value,
  domain: c.domain,
  path: c.path,
  expires: c.expires,
  httpOnly: c.httpOnly,
  secure: c.secure,
  sameSite: 'Lax' // Cambiar de 'Strict' a 'Lax'
}));
```

### Problema 3: Productos No se Detectan Pero Está Logueado

**Revisar screenshot `debug-session-loaded.png`:**

Si muestra:
- ✅ Productos visibles → Problema con selectores
- ❌ Página en blanco → Problema de carga
- ❌ Página de login → Sesión no válida

**Solución para selectores:**
```javascript
// Probar selectores alternativos
const selectores = [
  '[itemtype*="Product"]',
  '.oe_product_cart',
  '.o_wsale_product_grid_wrapper',
  '[data-product-id]'
];

for (const selector of selectores) {
  const count = await page.evaluate((sel) => {
    return document.querySelectorAll(sel).length;
  }, selector);
  console.log(`Selector ${selector}: ${count} elementos`);
}
```

## 🧪 Test Manual

Para probar si el problema es de cookies o de scraping:

1. **Conectar cuenta de Sego**
2. **Esperar 5 minutos** (para que cookies se guarden)
3. **Abrir Railway logs en tiempo real**
4. **Importar productos**
5. **Observar logs paso a paso**

## 📊 Logs Esperados (Flujo Correcto)

```
🔍 Buscando sesión guardada...
✅ Sesión encontrada, usando cookies guardadas
🔧 Cookies a cargar: 15
📍 En página base, cargando cookies...
🔄 Cookies cargadas, navegando a tienda...
📍 En página de categoría CCTV
ℹ️ No hay banner de cookies o ya fue aceptado
🧪 Está logueado: true
✅ Sesión válida, continuando scraping...
✅ Selector de productos encontrado
🧪 Productos detectados en página inicial: 24
🔗 URL actual: https://www.sego.com.pe/shop/category/cctv-108

🏷️  CATEGORÍA: CCTV
📦 Scrapeando página 1/20
✅ Productos detectados en página
✓ Encontrados: 24 productos (Total: 24)
```

## 🚨 Logs de Error Comunes

### Error 1: "Sesión expirada"
```
🧪 Está logueado: false
⚠️ Sesión expirada, haciendo login nuevamente...
```
**Solución:** Volver a conectar cuenta de Sego

### Error 2: "No se detectaron productos"
```
⚠️ No se encontró selector de productos
🧪 Productos detectados en página inicial: 0
⚠️ No se detectaron productos, sesión puede estar inválida
```
**Solución:** Revisar screenshot y verificar selectores

### Error 3: "Timeout"
```
TimeoutError: Navigation timeout of 60000 ms exceeded
```
**Solución:** Aumentar timeout o verificar conexión

## 🔄 Alternativa: Login Cada Vez

Si las sesiones persistentes no funcionan, puedes volver al sistema anterior:

```javascript
// En Admin.jsx, siempre pedir credenciales
const importarProductosSego = async () => {
  setMostrarModalCredenciales(true); // Siempre mostrar modal
};
```

## 📞 Siguiente Paso

Si después de estos cambios aún no funciona:

1. **Revisar screenshot `debug-session-loaded.png`** en Railway
2. **Copiar logs completos** desde "Buscando sesión" hasta "Productos detectados"
3. **Verificar en Supabase** que las cookies se guardaron
4. **Probar hacer login manual** en Sego desde el navegador para verificar que las credenciales funcionan

## 🎯 Cambios Aplicados en Esta Versión

1. ✅ Ir directamente a categoría CCTV (más confiable que /shop)
2. ✅ Agregar espera de 2 segundos después de cargar cookies
3. ✅ Verificar selector de productos antes de contar
4. ✅ Mostrar URL actual en logs
5. ✅ Si 0 productos, marcar sesión como inválida y hacer login
6. ✅ Logs más detallados de cookies guardadas
7. ✅ Intentar aceptar banner de cookies con más variaciones

## 🚀 Desplegar y Probar

```bash
git add .
git commit -m "Debug: Mejorar detección de productos con sesiones"
git push
```

Esperar 2-3 minutos y probar nuevamente.
