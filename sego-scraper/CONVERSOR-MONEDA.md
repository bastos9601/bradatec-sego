# 💱 Conversor de Moneda - USD a PEN

## ✅ Funcionalidad Implementada

La tienda ahora permite a los usuarios cambiar entre dólares (USD) y soles peruanos (PEN) con tipo de cambio actualizado en tiempo real.

### Características

1. **Selector de Moneda en el Navbar**
   - Botones para cambiar entre $ USD y S/ PEN
   - Diseño visual claro (botón activo en blanco)
   - Cambio instantáneo en todos los productos

2. **Tipo de Cambio Actualizado**
   - Se obtiene automáticamente al cargar la página
   - Usa API gratuita de exchangerate-api.com
   - Botón 🔄 para actualizar manualmente
   - Muestra el tipo de cambio actual en el navbar

3. **Conversión Automática de Precios**
   - Todos los productos se convierten automáticamente
   - Muestra el precio en la moneda seleccionada
   - En PEN, también muestra el precio original en USD
   - Formato correcto: $ 154.92 o S/ 537.57

### Cómo Funciona

**Flujo de conversión:**
1. Usuario selecciona moneda (USD o PEN)
2. Sistema extrae el precio numérico del producto ($ 154.92 → 154.92)
3. Si es PEN, multiplica por el tipo de cambio (154.92 × 3.47 = 537.57)
4. Muestra el precio formateado (S/ 537.57)

**API de Tipo de Cambio:**
- URL: https://api.exchangerate-api.com/v4/latest/USD
- Gratuita, sin necesidad de API key
- Actualizada diariamente
- Respaldo: tipo de cambio por defecto de 3.47

### Ejemplo Visual

**En USD:**
```
Precio con IGV
$ 154.92
```

**En PEN:**
```
Precio con IGV
S/ 537.57
Precio original: $ 154.92
```

### Componentes Modificados

1. **Tienda.jsx**
   - Estado para moneda (USD/PEN)
   - Estado para tipo de cambio
   - Función para obtener tipo de cambio de API
   - Selector de moneda en navbar
   - Indicador de tipo de cambio con botón actualizar

2. **ProductoCard.jsx**
   - Recibe props: moneda y tipoCambio
   - Función para extraer precio numérico
   - Lógica de conversión
   - Muestra precio original cuando está en PEN

### Personalización

**Cambiar tipo de cambio por defecto:**
```javascript
const [tipoCambio, setTipoCambio] = useState(3.47) // Cambiar aquí
```

**Usar otra API de tipo de cambio:**
```javascript
// Opción 1: exchangerate-api.com (actual)
const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')

// Opción 2: fixer.io (requiere API key)
const response = await fetch('https://api.fixer.io/latest?base=USD&symbols=PEN')

// Opción 3: API del BCR Perú
const response = await fetch('https://api.apis.net.pe/v1/tipo-cambio-sunat')
```

### Mejoras Futuras (Opcional)

- [ ] Guardar preferencia de moneda en localStorage
- [ ] Agregar más monedas (EUR, COP, etc.)
- [ ] Mostrar historial de tipo de cambio
- [ ] Alertas cuando el tipo de cambio cambia significativamente
- [ ] Exportar precios en ambas monedas a Excel/PDF
- [ ] Calculadora de conversión en la página

### Notas Técnicas

**Extracción de precio:**
- Usa regex para extraer números del string
- Maneja formatos: "$ 154.92", "$154.92", "$ 154,92"
- Convierte comas a puntos para cálculos

**Precisión:**
- Precios se muestran con 2 decimales
- Cálculos usan números de punto flotante
- Redondeo automático con toFixed(2)

### Solución de Problemas

**Si el tipo de cambio no se actualiza:**
1. Verifica la conexión a internet
2. Revisa la consola del navegador (F12)
3. Haz clic en el botón 🔄 para reintentar
4. El sistema usará el tipo de cambio por defecto (3.47)

**Si los precios no se convierten:**
1. Verifica que los productos tengan precio en formato correcto
2. Revisa que el precio contenga números
3. Comprueba la consola para errores

## 🚀 Uso

1. Abre la tienda: http://localhost:5173
2. En el navbar, verás el selector de moneda
3. Haz clic en "$ USD" o "S/ PEN" para cambiar
4. Los precios se actualizan instantáneamente
5. Haz clic en 🔄 para actualizar el tipo de cambio

¡Ahora los usuarios pueden ver los precios en su moneda preferida! 💰
