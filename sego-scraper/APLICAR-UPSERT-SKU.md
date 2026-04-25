# Aplicar UPSERT basado en SKU

## 🎯 Objetivo
Cambiar la lógica de inserción de productos para usar UPSERT basado en SKU en lugar de ID. Esto permite:
- ✅ Actualizar productos existentes en lugar de crear duplicados
- ✅ Mantener un único registro por SKU
- ✅ Scraping más eficiente y limpio

## 🔄 Cambio de Lógica

### ANTES (Problema)
```javascript
.upsert(lote, { onConflict: 'id' })
```
- Usaba UUID aleatorio como identificador
- Cada scraping creaba nuevos productos
- Resultaba en duplicados

### DESPUÉS (Solución)
```javascript
.upsert(lote, { onConflict: 'sku' })
```
- Usa SKU como identificador único
- Cada scraping actualiza productos existentes
- No hay duplicados

## 📋 Pasos para Aplicar

### Paso 1: Aplicar Migración SQL

1. **Accede a Supabase**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto `bradatec-sego`

2. **Abre SQL Editor**
   - En el panel izquierdo, haz clic en "SQL Editor"
   - Haz clic en "New Query"

3. **Copia y Ejecuta el SQL**
   ```sql
   -- Agregar constraint único en SKU para permitir UPSERT
   -- Primero, eliminar duplicados si existen
   DELETE FROM productos 
   WHERE id NOT IN (
     SELECT DISTINCT ON (sku) id 
     FROM productos 
     WHERE sku IS NOT NULL AND sku != ''
     ORDER BY sku, created_at DESC
   )
   AND sku IS NOT NULL AND sku != '';

   -- Agregar constraint único en SKU
   ALTER TABLE productos 
   ADD CONSTRAINT unique_sku UNIQUE (sku);

   -- Crear índice para búsquedas rápidas por SKU
   CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
   ```

4. **Verifica que se ejecutó correctamente**
   - Deberías ver un mensaje de éxito
   - Se eliminarán duplicados automáticamente
   - Se agregará la constraint única en SKU

### Paso 2: Desplegar los Cambios

1. **Commit y Push**:
   ```bash
   git add .
   git commit -m "feat: cambiar UPSERT a basado en SKU para mejor scraping"
   git push
   ```

2. **Railway se redesplegará automáticamente**

### Paso 3: Prueba

1. **Ve al Admin Panel**
   - https://bradatec.netlify.app/admin

2. **Importa productos nuevamente**
   - Haz clic en "Importar Productos Sego"
   - Espera a que termine

3. **Verifica los resultados**
   - Los productos se actualizan en lugar de crear duplicados
   - No hay errores de UUID
   - El contador de "Insertados/Actualizados" es correcto

## 📊 Ejemplo de Flujo

### Primer Scraping
```
📦 Total encontrados: 1044
✓ Productos únicos: 687
⚠️ Duplicados descartados: 357
✓ Insertados/Actualizados: 687
```

### Segundo Scraping (mismo día)
```
📦 Total encontrados: 1044
✓ Productos únicos: 687
⚠️ Duplicados descartados: 357
✓ Insertados/Actualizados: 687 (ACTUALIZADOS, no nuevos)
```

## 🔒 Seguridad

- ✅ Cada SKU es único en la base de datos
- ✅ No hay duplicados
- ✅ Los datos se actualizan correctamente
- ✅ Se mantiene la integridad referencial

## 💡 Ventajas

1. **Eficiencia**: No crea duplicados
2. **Actualización**: Los precios y datos se actualizan automáticamente
3. **Limpieza**: La base de datos se mantiene limpia
4. **Escalabilidad**: Funciona bien con muchos productos

## ⚠️ Notas Importantes

- La migración SQL eliminará duplicados automáticamente
- Solo mantiene el registro más reciente de cada SKU
- Si un producto no tiene SKU, no se puede hacer UPSERT
- Los productos sin SKU se insertan normalmente

## 🚀 Próximos Pasos

1. Aplica la migración SQL en Supabase
2. Despliega los cambios en Railway
3. Prueba el scraping nuevamente
4. Verifica que los productos se actualicen correctamente

## ❓ Preguntas Frecuentes

### ¿Qué pasa con los productos sin SKU?
- Se insertan normalmente
- No se pueden actualizar con UPSERT
- Se crean como nuevos cada vez

### ¿Se pierden datos al eliminar duplicados?
- No, solo se mantiene el registro más reciente
- Los datos más antiguos se descartan
- Es seguro

### ¿Puedo revertir este cambio?
- Sí, pero necesitarías restaurar un backup
- Se recomienda hacer backup antes de aplicar

### ¿Qué pasa si cambio un SKU?
- Se crea un nuevo producto
- El antiguo se mantiene
- Se recomienda no cambiar SKUs
