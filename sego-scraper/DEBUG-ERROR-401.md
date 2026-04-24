# 🔍 Debug Error 401 - Ya tienes perfil admin

## El Problema

Ya tienes el perfil de admin creado, pero sigue dando error 401.

---

## ✅ SOLUCIÓN

### Opción 1: Redesplegar la función actualizada

```bash
cd sego-scraper
npx supabase functions deploy scrape_productos
```

Espera a que termine y prueba nuevamente.

### Opción 2: Ver los logs de la función

1. Ve a Supabase: https://supabase.com
2. Abre tu proyecto
3. Ve a **Edge Functions** (en el menú lateral)
4. Haz clic en **scrape_productos**
5. Haz clic en la pestaña **Logs**
6. Haz clic en "Actualizar Productos" en tu app
7. Mira qué error aparece en los logs

### Opción 3: Simplificar la función (sin verificar admin)

Vamos a crear una versión temporal que NO verifique el rol de admin:

1. Ve a Supabase > Edge Functions > scrape_productos
2. Haz clic en "Edit Function"
3. O despliega esta versión simplificada:

---

## 🚀 Versión Simplificada (Sin verificar admin)

Crea un archivo temporal: `sego-scraper/supabase/functions/scrape_productos/index-simple.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No autorizado')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Solo verificar que esté autenticado (sin verificar rol)
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    console.log('Usuario autenticado:', user.email)

    // Datos de ejemplo
    const productos = [
      {
        nombre: 'Cemento Portland Tipo I - Sego',
        precio: 'S/ 28.50',
        imagen: 'https://via.placeholder.com/300x200?text=Cemento+Sego',
      },
      {
        nombre: 'Fierro Corrugado 1/2" x 9m',
        precio: 'S/ 35.00',
        imagen: 'https://via.placeholder.com/300x200?text=Fierro+Corrugado',
      },
      {
        nombre: 'Ladrillo King Kong 18 huecos',
        precio: 'S/ 1.20',
        imagen: 'https://via.placeholder.com/300x200?text=Ladrillo',
      },
      {
        nombre: 'Arena Gruesa x m³',
        precio: 'S/ 45.00',
        imagen: 'https://via.placeholder.com/300x200?text=Arena',
      },
      {
        nombre: 'Piedra Chancada x m³',
        precio: 'S/ 55.00',
        imagen: 'https://via.placeholder.com/300x200?text=Piedra',
      }
    ]

    let insertados = 0
    
    for (const producto of productos) {
      const { data: existente } = await supabaseClient
        .from('productos')
        .select('id')
        .eq('nombre', producto.nombre)
        .single()

      if (!existente) {
        const { error } = await supabaseClient
          .from('productos')
          .insert([producto])

        if (!error) {
          insertados++
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: productos.length,
        insertados,
        mensaje: `Se procesaron ${productos.length} productos, ${insertados} nuevos insertados`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
```

Despliega:
```bash
npx supabase functions deploy scrape_productos
```

---

## 🔍 Verificar Políticas RLS

El problema puede ser las políticas de seguridad. Ejecuta esto en SQL Editor:

```sql
-- Ver políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'productos';

-- Deshabilitar RLS temporalmente (SOLO PARA DEBUG)
ALTER TABLE productos DISABLE ROW LEVEL SECURITY;

-- Probar el scraping

-- Volver a habilitar
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
```

---

## 🎯 Checklist de Verificación

- [ ] Función desplegada: `npx supabase functions deploy scrape_productos`
- [ ] Usuario autenticado en la app
- [ ] Perfil de admin existe (ya lo tienes ✅)
- [ ] Variables .env correctas
- [ ] Servidor reiniciado: `npm run dev`

---

## 📞 Si Nada Funciona

Prueba insertar productos manualmente para verificar que la app funciona:

```sql
-- Insertar productos de prueba
INSERT INTO productos (nombre, precio, imagen) VALUES
('Producto Test 1', 'S/ 10.00', 'https://via.placeholder.com/300x200?text=Test1'),
('Producto Test 2', 'S/ 20.00', 'https://via.placeholder.com/300x200?text=Test2'),
('Producto Test 3', 'S/ 30.00', 'https://via.placeholder.com/300x200?text=Test3');
```

Luego ve a http://localhost:5173/dashboard

Si ves los productos, el problema es solo con la Edge Function.
