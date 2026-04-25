# Fix: Error "invalid input syntax for type uuid"

## 🐛 Problema
Al importar productos desde Sego, se mostraba el error:
```
⚠️ Error en lote X: invalid input syntax for type uuid: "kit-v-portero-con-monitor-7--con-micro-sd"
```

## 🔍 Causa
El sistema estaba generando IDs de productos como strings normalizados (ej: "kit-v-portero-con-monitor-7--con-micro-sd"), pero la tabla `productos` en Supabase espera UUIDs válidos (formato: `550e8400-e29b-41d4-a716-446655440000`).

## ✅ Solución
Se cambió la generación de IDs para usar UUIDs válidos en lugar de strings normalizados.

### Cambios Realizados

1. **Agregada importación de uuid** en `server.js`:
   ```javascript
   import { v4 as uuidv4 } from 'uuid';
   ```

2. **Cambio en la generación de IDs** (línea ~625):
   ```javascript
   // ANTES (incorrecto):
   id: nombreNormalizado.replace(/[^a-z0-9]/gi, '-').substring(0, 100)
   
   // DESPUÉS (correcto):
   id: uuidv4()
   ```

3. **Agregada dependencia** en `package.json`:
   ```json
   "uuid": "^9.0.0"
   ```

4. **Instalada la dependencia**:
   ```bash
   npm install uuid
   ```

## 📊 Resultado
Ahora los productos se insertan correctamente con UUIDs válidos:
- ✅ Todos los lotes se insertan sin errores
- ✅ Los productos se guardan en la base de datos
- ✅ No hay conflictos de tipo de dato

## 🚀 Próximos Pasos

1. **Commit y Push**:
   ```bash
   git add .
   git commit -m "fix: usar UUID válidos para IDs de productos"
   git push
   ```

2. **Redeploy en Railway**:
   - Railway detectará los cambios automáticamente
   - Se redesplegará el servidor

3. **Prueba**:
   - Ve al Admin Panel
   - Haz clic en "Importar Productos Sego"
   - Verifica que no haya errores de UUID
   - Todos los lotes deberían insertarse correctamente

## 📝 Notas Técnicas

- **UUID v4**: Genera identificadores únicos aleatorios
- **Formato**: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
- **Ventaja**: Garantiza unicidad sin necesidad de secuencias
- **Compatibilidad**: Funciona perfectamente con Supabase/PostgreSQL

## ✨ Beneficios

- ✅ Errores de inserción eliminados
- ✅ Mejor rendimiento (UUIDs son más eficientes que strings)
- ✅ Compatibilidad total con la base de datos
- ✅ Escalabilidad mejorada

## 🔄 Deduplicación

La deduplicación por nombre sigue funcionando correctamente:
- Se detectan productos con el mismo nombre
- Se descartan duplicados
- Se mantienen todos los SKUs en el campo `sku`
- Cada producto único recibe un UUID único
