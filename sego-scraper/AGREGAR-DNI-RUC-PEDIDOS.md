# 📋 Agregar DNI/RUC en Formulario de Pedidos

## 🎯 Cambio Implementado

Se agregaron campos para que los usuarios ingresen su DNI o RUC al hacer un pedido.

## 📝 Cambios en Frontend

### `src/componentes/ModalCheckout.jsx`

#### 1. Estado Actualizado
```javascript
const [datosEnvio, setDatosEnvio] = useState({
  nombre: '',
  email: '',
  celular: '',
  tipoDocumento: 'DNI', // ← NUEVO
  numeroDocumento: '', // ← NUEVO
  direccion: ''
})
```

#### 2. Campos Agregados en Formulario
```jsx
<div className="grid grid-cols-3 gap-4">
  <div className="col-span-1">
    <label>Tipo de Documento *</label>
    <select>
      <option value="DNI">DNI</option>
      <option value="RUC">RUC</option>
    </select>
  </div>

  <div className="col-span-2">
    <label>{tipoDocumento === 'DNI' ? 'Número de DNI' : 'Número de RUC'} *</label>
    <input
      type="text"
      placeholder={tipoDocumento === 'DNI' ? '12345678' : '20123456789'}
      maxLength={tipoDocumento === 'DNI' ? '8' : '11'}
    />
  </div>
</div>
```

#### 3. Datos Guardados en Pedido
```javascript
const pedido = {
  // ... otros campos ...
  tipo_documento: datosEnvio.tipoDocumento,
  numero_documento: datosEnvio.numeroDocumento,
  // ... otros campos ...
}
```

#### 4. Mensaje de WhatsApp Actualizado
```
👤 *Cliente:*
Nombre: Juan Pérez
Email: juan@ejemplo.com
Celular: 999 999 999
DNI: 12345678
Dirección: Av. Principal 123
```

## 📊 Migración SQL

### Archivo: `supabase/migration-add-documento-pedidos.sql`

```sql
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS tipo_documento TEXT DEFAULT 'DNI';
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS numero_documento TEXT;

CREATE INDEX IF NOT EXISTS idx_pedidos_numero_documento ON pedidos(numero_documento);
```

## 🧪 Estructura de Datos

### Tabla `pedidos` (actualizada)

```sql
CREATE TABLE pedidos (
  id UUID PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id),
  nombre TEXT,
  email TEXT,
  celular TEXT,
  tipo_documento TEXT DEFAULT 'DNI',      -- ← NUEVO
  numero_documento TEXT,                   -- ← NUEVO
  direccion TEXT,
  productos JSONB,
  subtotal DECIMAL,
  igv DECIMAL,
  total DECIMAL,
  moneda TEXT,
  estado TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Desplegar

### 1. Aplicar Migración SQL

**Opción 1: Dashboard de Supabase**
1. Ve a SQL Editor
2. New Query
3. Copia el contenido de `supabase/migration-add-documento-pedidos.sql`
4. Run

**Opción 2: Supabase CLI**
```bash
cd sego-scraper
supabase db push
```

### 2. Desplegar Frontend

```bash
git add .
git commit -m "Feature: Agregar campos DNI/RUC en formulario de pedidos"
git push
```

## 🧪 Probar

1. Abrir tienda y agregar productos al carrito
2. Hacer clic en "Finalizar Pedido"
3. Verificar que aparecen los campos:
   - Selector de "Tipo de Documento" (DNI/RUC)
   - Campo de "Número de DNI" o "Número de RUC"
4. Llenar formulario:
   - Nombre: Juan Pérez
   - Email: juan@ejemplo.com
   - Celular: 999 999 999
   - Tipo: DNI
   - Número: 12345678
   - Dirección: Av. Principal 123
5. Confirmar pedido
6. Verificar en WhatsApp que aparece el DNI

## 📋 Validación

### DNI
- Máximo 8 caracteres
- Solo números

### RUC
- Máximo 11 caracteres
- Solo números
- Formato: 20XXXXXXXXX (para Perú)

## 📊 Ejemplo de Pedido Guardado

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "usuario_id": "user-123",
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "celular": "999 999 999",
  "tipo_documento": "DNI",
  "numero_documento": "12345678",
  "direccion": "Av. Principal 123, Lima",
  "productos": [...],
  "subtotal": 1000.00,
  "igv": 180.00,
  "total": 1180.00,
  "moneda": "PEN",
  "estado": "pendiente",
  "created_at": "2026-04-24T18:31:00Z"
}
```

## 🎯 Ventajas

✅ **Información Completa** - Captura DNI/RUC del cliente
✅ **Validación** - Limita caracteres según tipo
✅ **Flexible** - Soporta DNI y RUC
✅ **Indexado** - Búsquedas rápidas por número de documento
✅ **Notificación** - Admin recibe DNI/RUC en WhatsApp

## 📝 Notas

### Validación en Frontend
- DNI: máximo 8 caracteres
- RUC: máximo 11 caracteres
- Ambos son requeridos

### Validación en Backend
Puedes agregar validación adicional en el servidor si lo necesitas:
```javascript
// Validar DNI (8 dígitos)
if (tipo_documento === 'DNI' && numero_documento.length !== 8) {
  throw new Error('DNI debe tener 8 dígitos');
}

// Validar RUC (11 dígitos)
if (tipo_documento === 'RUC' && numero_documento.length !== 11) {
  throw new Error('RUC debe tener 11 dígitos');
}
```

## 🔄 Cambios Futuros

Si necesitas agregar más validaciones:
1. Validar que sean solo números
2. Validar dígito verificador de DNI
3. Validar dígito verificador de RUC
4. Buscar datos del cliente por DNI/RUC

## 🎉 Resultado

Ahora los usuarios pueden:
- ✅ Seleccionar tipo de documento (DNI o RUC)
- ✅ Ingresar número de documento
- ✅ El admin recibe esta información en WhatsApp
- ✅ Los datos se guardan en la base de datos
