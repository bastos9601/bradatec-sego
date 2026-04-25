# 💱 Sistema de Cambio de Moneda: USD ↔ PEN

## 🎯 Objetivo
Permitir que los usuarios cambien entre USD y PEN con un solo clic, sin necesidad de rescraping.

## 🔧 Arquitectura

### Backend (server.js)
- ✅ Guarda precios en **USD** (moneda original de Sego)
- ✅ Endpoint `GET /api/tipo-cambio` para obtener tipo de cambio en tiempo real
- ❌ NO convierte precios (se hace en el frontend)

### Frontend (Tienda.jsx)
- ✅ Obtiene tipo de cambio al cargar la página
- ✅ Actualiza tipo de cambio cada 5 minutos
- ✅ Botones USD/PEN en la navbar
- ✅ Convierte precios en tiempo real según moneda seleccionada
- ✅ Guarda preferencia de moneda en localStorage

## 📊 Flujo de Datos

```
1. Usuario abre tienda
   ↓
2. Frontend obtiene productos (precios en USD)
   ↓
3. Frontend obtiene tipo de cambio
   ↓
4. Usuario presiona USD o PEN
   ↓
5. Frontend convierte precios localmente
   ↓
6. Muestra precios en moneda seleccionada
```

## 💻 Código Frontend

### Estado de Moneda
```javascript
const [moneda, setMoneda] = useState('USD') // USD o PEN
const [tipoCambio, setTipoCambio] = useState(3.47) // Tipo de cambio por defecto
```

### Obtener Tipo de Cambio
```javascript
const obtenerTipoCambio = async () => {
  // Intenta múltiples APIs en orden de prioridad:
  // 1. cuantoestaeldolar.pe (Perú)
  // 2. exchangerate-api.com (Internacional)
  // 3. open.er-api.com (Respaldo)
  
  // Si todas fallan, usa 3.47 como valor por defecto
};
```

### Convertir Precio
```javascript
const precioNumerico = extraerPrecio(producto.precio); // "$ 299.00" → 299.00
const precioConvertido = moneda === 'PEN' 
  ? precioNumerico * tipoCambio  // USD → PEN
  : precioNumerico;              // USD → USD

const precioFormateado = `${simboloMoneda} ${precioConvertido.toFixed(2)}`;
// Resultado: "S/ 1150.15" o "$ 299.00"
```

### Botones de Moneda
```jsx
<button
  onClick={() => setMoneda('USD')}
  className={moneda === 'USD' ? 'bg-white' : 'bg-blue-600'}
>
  $ USD
</button>

<button
  onClick={() => setMoneda('PEN')}
  className={moneda === 'PEN' ? 'bg-white' : 'bg-blue-600'}
>
  S/ PEN
</button>
```

## 📋 Componentes Afectados

### Tienda.jsx
- Estado de moneda y tipo de cambio
- Botones USD/PEN
- Obtención de tipo de cambio
- Cálculo de total del carrito

### ProductoCard.jsx
- Recibe `moneda` y `tipoCambio` como props
- Convierte y muestra precio según moneda
- Muestra precio original cuando está en PEN

### ModalCarrito.jsx
- Muestra precio en moneda seleccionada
- Actualiza total según moneda

### CarritoSidebar.jsx
- Muestra precios en moneda seleccionada
- Calcula total en moneda correcta

## 🧪 Ejemplo de Uso

### Escenario 1: Usuario en USD
```
Producto: Cámara HD 1080p
Precio en BD: $ 299.00
Moneda seleccionada: USD
Precio mostrado: $ 299.00
```

### Escenario 2: Usuario en PEN
```
Producto: Cámara HD 1080p
Precio en BD: $ 299.00
Tipo de cambio: 3.85
Moneda seleccionada: PEN
Precio mostrado: S/ 1150.15
Precio original: $ 299.00 (mostrado debajo)
```

## 🔄 Tipo de Cambio

### Actualización
- Se obtiene al cargar la página
- Se actualiza cada 5 minutos automáticamente
- Se obtiene de múltiples APIs para confiabilidad

### APIs Utilizadas (en orden de prioridad)
1. **cuantoestaeldolar.pe** - API peruana (más precisa)
2. **exchangerate-api.com** - API internacional
3. **open.er-api.com** - Respaldo

### Valor por Defecto
- Si todas las APIs fallan: 3.47
- Se puede cambiar en el código

## 📊 Ventajas

✅ **Sin Rescraping** - No necesita volver a scrapear
✅ **Instantáneo** - Cambio inmediato al presionar botón
✅ **Tipo de Cambio Real** - Se actualiza cada 5 minutos
✅ **Offline** - Funciona con valor por defecto si no hay internet
✅ **Preciso** - Redondea a 2 decimales
✅ **Transparente** - Muestra precio original en PEN

## 🚀 Desplegar

```bash
git add .
git commit -m "Feature: Sistema de cambio de moneda USD/PEN en frontend"
git push
```

No requiere cambios en el servidor, solo en el frontend.

## 🧪 Probar

1. Abrir tienda: https://bradatec.netlify.app
2. Presionar botón "$ USD" - Precios en USD
3. Presionar botón "S/ PEN" - Precios en PEN
4. Verificar que se convierte correctamente
5. Agregar productos al carrito
6. Verificar que el total se calcula en la moneda correcta

## 📝 Notas Importantes

### Almacenamiento
- Los precios se guardan en USD en la BD
- La conversión se hace en el frontend
- No hay datos duplicados

### Carrito
- El carrito guarda precios en USD
- Se convierte al mostrar según moneda seleccionada
- Al hacer checkout, se usa el precio en USD

### Checkout
- El checkout siempre usa USD (moneda de Sego)
- Se muestra en PEN si el usuario lo seleccionó
- El pago se procesa en USD

## 🔄 Cambiar Moneda de Destino

Si quieres cambiar a otra moneda (EUR, GBP, etc.):

1. Modificar estado:
```javascript
const [moneda, setMoneda] = useState('EUR');
```

2. Cambiar API:
```javascript
const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
const data = response.json();
setTipoCambio(data.rates.EUR); // Cambiar de PEN a EUR
```

3. Cambiar símbolo:
```javascript
const simboloMoneda = moneda === 'EUR' ? '€' : '$';
```

## 🎉 Resultado

Ahora los usuarios pueden:
- ✅ Ver precios en USD o PEN
- ✅ Cambiar moneda con un clic
- ✅ Ver tipo de cambio actualizado
- ✅ Comprar en la moneda que prefieran
- ✅ Ver precio original cuando está en PEN
