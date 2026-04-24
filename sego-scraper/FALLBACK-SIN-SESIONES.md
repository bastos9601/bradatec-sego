# 🔄 FALLBACK: Desactivar Sistema de Sesiones

Si el sistema de sesiones persistentes no funciona correctamente, puedes volver al sistema anterior donde se piden credenciales cada vez.

## 🔧 Opción 1: Desactivar Sesiones en el Frontend

En `src/paginas/Admin.jsx`, modifica la función `importarProductosSego`:

```javascript
const importarProductosSego = async () => {
  // SIEMPRE mostrar modal de credenciales
  setMostrarModalCredenciales(true);
  return;
};
```

Esto hará que siempre pida credenciales, sin intentar usar sesiones guardadas.

## 🔧 Opción 2: Desactivar Sesiones en el Backend

En `server.js`, modifica la función `ejecutarScraping`:

```javascript
async function ejecutarScraping(username, password, userId) {
  // ... código anterior ...
  
  // Comentar esta sección para NO intentar usar sesiones
  /*
  if (userId) {
    console.log('🔍 Buscando sesión guardada...');
    // ... resto del código de sesiones ...
  }
  */
  
  // Ir directamente a login
  if (!username || !password) {
    throw new Error('Se requieren credenciales para hacer login');
  }
  
  console.log('🔐 Iniciando sesión en Sego...');
  // ... resto del login ...
}
```

## 🔧 Opción 3: Usar Credenciales Hardcodeadas (NO RECOMENDADO)

Si quieres que funcione sin pedir credenciales:

```javascript
// En server.js, línea ~260
const username = process.env.SEGO_USERNAME || 'bradatecsrl@gmail.com';
const password = process.env.SEGO_PASSWORD || '20608918371';
```

Y en `.env`:
```
SEGO_USERNAME=bradatecsrl@gmail.com
SEGO_PASSWORD=20608918371
```

⚠️ **ADVERTENCIA**: Esto expone las credenciales en el código. Solo usar en desarrollo.

## 📋 Comparación de Opciones

| Opción | Ventajas | Desventajas |
|--------|----------|------------|
| **Sesiones Persistentes** | No pide credenciales cada vez | Requiere migración SQL, cookies pueden expirar |
| **Credenciales Cada Vez** | Simple, sin dependencias | Usuario debe ingresar credenciales siempre |
| **Credenciales Hardcodeadas** | Totalmente automático | Inseguro, expone credenciales |

## 🚀 Recomendación

1. **Mantener sesiones persistentes** pero con mejor debugging
2. **Si no funciona después de 24 horas**, usar fallback a credenciales cada vez
3. **Nunca usar credenciales hardcodeadas** en producción

## 🧪 Probar Fallback

```bash
# 1. Hacer cambios en Admin.jsx o server.js
# 2. Desplegar
git add .
git commit -m "Fallback: Usar credenciales cada vez"
git push

# 3. Probar en panel admin
# Debe mostrar modal de credenciales siempre
```

## 📊 Logs Esperados (Fallback)

```
🔐 Iniciando sesión en Sego...
👤 Usuario: bradatecsrl@gmail.com
⚡ Bloqueando recursos pesados para login más rápido
📍 Navegando a login...
✅ Login completado exitosamente
💾 Guardando 15 cookies...
✅ Cookies guardadas correctamente para próxima vez

🏷️  CATEGORÍA: CCTV
📦 Scrapeando página 1/20
✅ Productos detectados en página
✓ Encontrados: 24 productos (Total: 24)
```

## 🔄 Volver a Sesiones Persistentes

Cuando el sistema de sesiones funcione correctamente:

1. Revertir cambios en Admin.jsx
2. Verificar que la migración SQL está aplicada
3. Desplegar nuevamente

```bash
git revert HEAD
git push
```

## 📞 Debugging

Si el fallback tampoco funciona:

1. Verificar que las credenciales de Sego son correctas
2. Revisar que Sego no bloqueó la cuenta
3. Verificar logs en Railway
4. Probar login manual en https://www.sego.com.pe

## 🎯 Próximos Pasos

1. Probar cambios aplicados (mejor manejo de sesiones)
2. Si funciona → mantener sistema actual
3. Si no funciona → aplicar fallback
4. Monitorear por 24 horas para ver si cookies expiran
