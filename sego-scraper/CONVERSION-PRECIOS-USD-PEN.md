# 💱 Conversión de Precios: USD → PEN

## 🎯 Objetivo
Convertir automáticamente los precios de Sego (en USD) a Soles Peruanos (PEN) usando la API de Currency API.

## 🔧 Implementación

### 1. API de Cambio de Divisas
Se integró la API de Currency API para obtener el tipo de cambio en tiempo real:

```javascript
// Endpoint: GET /api/tipo-cambio
// Respuesta:
{
  "ok": true,
  "tipoCambio": 3.85,
  "base": "USD",
  "target": "PEN",
  "timestamp": "2026-04-24T18:31:00Z"
}
```

### 2. Caché de Tipo de Cambio
Para evitar llamadas innecesarias a la API:
- Se guarda el tipo de cambio en memoria
- Se actualiza cada 1 hora
- Si falla la API, usa valor por defecto (3.8)

```javascript
// Usar caché si fue actualizado hace menos de 1 hora
if (tipoCambioCache && ultimaActualizacionCambio) {
  const ahora = Date.now();
  const hace1Hora = 60 * 60 * 1000;
  if (ahora - ultimaActualizacionCambio < hace1Hora) {
    return tipoCambioCache;
  }
}
```

### 3. Conversión de Precios en Scraping
Durante el scraping, cada precio se convierte automáticamente:

```javascript
// Función de conversión
const convertirPrecio = (precioUSD, tipoCambio) => {
  const match = precioUSD.match(/[\d,]+\.?\d*/);
  if (!match) return precioUSD;
  
  const numeroUSD = parseFloat(match[0].replace(',', ''));
  const numeroPEN = numeroUSD * tipoCambio;
  
  return `S/ ${numeroPEN.toFixed(2)}`;
};

// Ejemplo:
// Entrada: "$ 299.00"
// Tipo de cambio: 3.85
// Salida: "S/ 1150.15"
```

## 📊 Flujo de Scraping Mejorado

```
1. Obtener tipo de cambio
   ↓
2. Para cada página:
   ├─ Navegar a URL
   ├─ Esperar productos
   ├─ Extraer datos
   ├─ Convertir precios USD → PEN
   └─ Guardar productos
   ↓
3. Insertar en BD con precios en PEN
```

## 🧪 Logs Esperados

```
💱 Obteniendo tipo de cambio USD → PEN...
✅ Tipo de cambio actualizado: 1 USD = 3.85 PEN

📦 Scrapeando página 1/20
✅ Productos detectados en página
✓ Encontrados: 24 productos (Total: 24)

Ejemplo de producto:
- Nombre: Cámara HD 1080p
- Precio original: $ 299.00
- Precio convertido: S/ 1150.15
- SKU: CAM-001
```

## 📋 Configuración

### Variables de Entorno
En `.env`:
```
CURRENCY_API_KEY=cur_live_gfZF8jZXg4HbNsWNWDUqCe8iwHO61hhblVXT9kMP
```

### Endpoints

**Obtener tipo de cambio:**
```bash
GET /api/tipo-cambio

Respuesta:
{
  "ok": true,
  "tipoCambio": 3.85,
  "base": "USD",
  "target": "PEN",
  "timestamp": "2026-04-24T18:31:00Z"
}
```

## 🎯 Ventajas

✅ **Automático** - Se convierte durante el scraping
✅ **En tiempo real** - Usa tipo de cambio actual
✅ **Caché** - Evita llamadas innecesarias
✅ **Fallback** - Usa valor por defecto si falla
✅ **Transparente** - Muestra logs de conversión
✅ **Preciso** - Redondea a 2 decimales

## 📊 Ejemplo de Conversión

| Precio USD | Tipo de Cambio | Precio PEN |
|-----------|----------------|-----------|
| $100.00 | 3.85 | S/ 385.00 |
| $299.00 | 3.85 | S/ 1150.15 |
| $75.23 | 3.85 | S/ 289.64 |
| $1000.00 | 3.85 | S/ 3850.00 |

## 🚀 Desplegar

```bash
git add .
git commit -m "Feature: Conversión automática de precios USD → PEN"
git push
```

Railway redesplegar automáticamente en 2-3 minutos.

## 🧪 Probar

1. Conectar cuenta de Sego
2. Importar productos
3. Verificar en Railway logs:
   - "Tipo de cambio actualizado: 1 USD = X PEN"
   - Precios convertidos a S/
4. Verificar en Supabase:
   - Tabla `productos` tiene precios en S/ (PEN)

## 📝 Notas Importantes

### Tipo de Cambio
- Se actualiza cada 1 hora
- Si falla la API, usa 3.8 como valor por defecto
- Se puede cambiar el valor por defecto en el código

### Precisión
- Los precios se redondean a 2 decimales
- Se usa el tipo de cambio actual en el momento del scraping
- Cada página puede tener tipo de cambio ligeramente diferente

### Moneda
- Entrada: USD ($)
- Salida: PEN (S/)
- Formato: "S/ 1150.15"

## 🔄 Cambiar Moneda de Destino

Si quieres convertir a otra moneda (EUR, GBP, etc.):

1. Modificar la API call:
```javascript
const res = await fetch(
  `https://api.currencyapi.com/v3/latest?apikey=${CURRENCY_API_KEY}&base_currency=USD&currencies=EUR`
);
```

2. Cambiar el símbolo en `convertirPrecio`:
```javascript
return `€ ${numeroPEN.toFixed(2)}`; // Para EUR
```

## 🎉 Resultado

Ahora todos los productos se importan con precios en Soles Peruanos (PEN):
- ✅ Conversión automática
- ✅ Tipo de cambio en tiempo real
- ✅ Precios precisos
- ✅ Caché para optimizar
- ✅ Fallback si falla API
