# 💱 Sistema de Cambio de Moneda - API Única

## 🎯 Cambio Implementado

Se simplificó el sistema para usar **SOLO** la API de Currency API, sin respaldos ni valores por defecto.

## 📋 Cambios

### ✅ Implementado
- ✅ SOLO Currency API: `https://api.currencyapi.com/v3/latest`
- ✅ Sin APIs de respaldo
- ✅ Sin valor por defecto
- ✅ Error explícito si falla la API

### ❌ Removido
- ❌ API de cuantoestaeldolar.pe
- ❌ API de SUNAT
- ❌ ExchangeRate-API
- ❌ Open Exchange Rates
- ❌ Valor por defecto (3.47)

## 📁 Archivos Modificados

### `src/config/api.js`
```javascript
export const CURRENCY_API_KEY = 'cur_live_gfZF8jZXg4HbNsWNWDUqCe8iwHO61hhblVXT9kMP';

export async function obtenerTipoCambioAPI() {
  // SOLO Currency API
  // Lanza error si falla (no retorna null)
}
```

### `src/paginas/Tienda.jsx`
```javascript
const [tipoCambio, setTipoCambio] = useState(null) // null hasta obtener de API

const obtenerTipoCambio = async () => {
  // Usa SOLO obtenerTipoCambioAPI()
  // Muestra alerta si falla
  // No establece valor por defecto
}

const calcularTotal = () => {
  // Si tipoCambio es null y moneda es PEN, retorna 0
  // No calcula sin tipo de cambio
}
```

## 🔄 Flujo

```
1. Usuario abre tienda
   ↓
2. Frontend obtiene tipo de cambio de Currency API
   ↓
3. ¿Éxito?
   ├─ SÍ → Mostrar precios en USD/PEN
   └─ NO → Mostrar alerta de error
   ↓
4. Usuario presiona USD o PEN
   ↓
5. Mostrar precios en moneda seleccionada
```

## 🧪 Comportamiento

### Si Currency API funciona
```
✅ Tipo de cambio obtenido: 1 USD = 3.85 PEN
✅ Botones USD/PEN funcionan correctamente
✅ Precios se convierten correctamente
```

### Si Currency API falla
```
❌ Error al obtener tipo de cambio
⚠️ Alerta: "No se pudo obtener el tipo de cambio. Por favor, intenta más tarde."
❌ Botón PEN deshabilitado (tipoCambio es null)
❌ Total del carrito en PEN muestra 0
```

## 📊 Ventajas

✅ **Simple** - Una sola API
✅ **Confiable** - Currency API es profesional
✅ **Transparente** - Errores explícitos
✅ **Sin Sorpresas** - No hay valores por defecto ocultos
✅ **Mantenible** - Menos código

## ⚠️ Consideraciones

### Si Currency API no está disponible
- Los usuarios NO pueden cambiar a PEN
- Se muestra alerta clara
- El carrito en PEN muestra 0
- Deben esperar a que la API se recupere

### Alternativa si necesitas respaldo
Si quieres agregar respaldos en el futuro:

1. Editar `src/config/api.js`
2. Agregar try-catch con otras APIs
3. Retornar valor por defecto si todas fallan

## 🚀 Desplegar

```bash
git add .
git commit -m "Feature: Usar SOLO Currency API para cambio de moneda"
git push
```

## 🧪 Probar

1. Abrir tienda: https://bradatec.netlify.app
2. Verificar en consola:
   - "✅ Tipo de cambio obtenido: 1 USD = X PEN"
3. Presionar botón "S/ PEN"
4. Verificar que precios se convierten correctamente

### Simular fallo de API
1. Abrir DevTools (F12)
2. Network → Throttling → Offline
3. Recargar página
4. Debe mostrar alerta de error

## 📝 API Key

```
CURRENCY_API_KEY=cur_live_gfZF8jZXg4HbNsWNWDUqCe8iwHO61hhblVXT9kMP
```

Ubicación: `src/config/api.js`

## 🎉 Resultado

Ahora el sistema:
- ✅ Usa SOLO Currency API
- ✅ Sin respaldos
- ✅ Sin valores por defecto
- ✅ Errores explícitos
- ✅ Más simple y mantenible
