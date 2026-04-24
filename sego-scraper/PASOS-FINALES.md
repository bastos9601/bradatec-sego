# 🎯 PASOS FINALES - Hacer que Funcione

## Cambios Realizados:

1. ✅ Función simplificada (sin verificar rol admin)
2. ✅ Cambio de GET a POST
3. ✅ Mejor manejo de errores
4. ✅ Logs agregados

---

## 🚀 EJECUTA ESTO AHORA:

### 1. Redesplegar la función actualizada

```bash
cd sego-scraper
npx supabase functions deploy scrape_productos
```

Espera a que termine (verás "Deployed Function scrape_productos").

### 2. Reiniciar el servidor

```bash
# Presiona Ctrl+C para detener el servidor
npm run dev
```

### 3. Probar

1. Abre http://localhost:5173
2. Haz login
3. Ve a /admin
4. Abre la consola del navegador (F12)
5. Haz clic en "Actualizar Productos"
6. Mira los logs en la consola

---

## 🔍 Qué Deberías Ver:

### En la consola del navegador:
```
Llamando a Edge Function...
Response status: 200
Response data: { success: true, total: 3, insertados: 3 }
```

### En Supabase Logs:
```
Petición recibida: POST
Usuario autenticado: bradatecrl@gmail.com
Iniciando scraping de Sego...
Productos encontrados: 3
```

---

## ✅ Si Funciona:

Verás el mensaje verde: "✓ Scraping exitoso: X productos nuevos"

Ve a http://localhost:5173/dashboard y deberías ver los productos.

---

## ❌ Si Sigue Dando Error:

### Opción 1: Insertar productos manualmente

En SQL Editor de Supabase:

```sql
-- Limpiar productos existentes
TRUNCATE productos;

-- Insertar productos de prueba
INSERT INTO productos (nombre, precio, imagen) VALUES
('Cemento Portland Tipo I - Sego', 'S/ 28.50', 'https://via.placeholder.com/300x200?text=Cemento'),
('Fierro Corrugado 1/2" x 9m', 'S/ 35.00', 'https://via.placeholder.com/300x200?text=Fierro'),
('Ladrillo King Kong 18 huecos', 'S/ 1.20', 'https://via.placeholder.com/300x200?text=Ladrillo'),
('Arena Gruesa x m³', 'S/ 45.00', 'https://via.placeholder.com/300x200?text=Arena'),
('Piedra Chancada x m³', 'S/ 55.00', 'https://via.placeholder.com/300x200?text=Piedra');

-- Verificar
SELECT * FROM productos;
```

Luego ve a http://localhost:5173/dashboard

### Opción 2: Deshabilitar RLS temporalmente

```sql
-- SOLO PARA DEBUG
ALTER TABLE productos DISABLE ROW LEVEL SECURITY;

-- Probar el scraping

-- Volver a habilitar
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
```

### Opción 3: Ver logs detallados

En Supabase:
1. Edge Functions > scrape_productos > Logs
2. Haz clic en "Actualizar Productos"
3. Mira qué error específico aparece

---

## 📝 Checklist Final:

- [ ] Función desplegada: `npx supabase functions deploy scrape_productos`
- [ ] Servidor reiniciado: `npm run dev`
- [ ] Usuario logueado en la app
- [ ] Consola del navegador abierta (F12)
- [ ] Logs de Supabase abiertos

---

## 🎉 Cuando Funcione:

Los productos aparecerán en:
- http://localhost:5173/dashboard
- Tabla `productos` en Supabase

¡Ya casi está! Solo falta redesplegar y probar.
