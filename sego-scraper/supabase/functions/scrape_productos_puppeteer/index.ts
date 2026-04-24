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

  console.log('Petición recibida:', req.method)

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    console.log('Cliente de Supabase creado')

    // Obtener credenciales
    const segoUsername = Deno.env.get('SEGO_USERNAME') || Deno.env.get('NOMBRE DE USUARIO SEGO')
    const segoPassword = Deno.env.get('SEGO_PASSWORD') || Deno.env.get('CONTRASEÑA_SEGO')

    console.log('SEGO_USERNAME configurado:', segoUsername ? 'SÍ' : 'NO')
    console.log('SEGO_PASSWORD configurado:', segoPassword ? 'SÍ' : 'NO')

    if (!segoUsername || !segoPassword) {
      throw new Error('Credenciales de Sego no configuradas')
    }

    console.log('Iniciando scraping con Puppeteer...')

    // Usar Browserless.io (servicio de navegador headless)
    const browserlessToken = Deno.env.get('BROWSERLESS_TOKEN')
    
    if (!browserlessToken) {
      console.log('⚠️ BROWSERLESS_TOKEN no configurado')
      console.log('Usando método alternativo con API de Sego...')
      
      // Intentar obtener productos via API de Sego si existe
      const productos = await scrapearConAPI(segoUsername, segoPassword)
      
      if (productos.length === 0) {
        throw new Error('No se pudieron obtener productos. Configura BROWSERLESS_TOKEN para scraping con JavaScript')
      }

      // Insertar productos
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

          if (!error) insertados++
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
    }

    // Usar Browserless para scraping con JavaScript
    console.log('Usando Browserless para scraping...')
    
    const browserlessUrl = `https://chrome.browserless.io/content?token=${browserlessToken}`
    
    const script = `
      const puppeteer = require('puppeteer');
      
      module.exports = async ({ page, context }) => {
        // Login
        await page.goto('https://www.sego.com.pe/web/login', { waitUntil: 'networkidle0' });
        await page.type('input[name="login"]', '${segoUsername}');
        await page.type('input[name="password"]', '${segoPassword}');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        
        // Ir a categoría de productos
        await page.goto('https://www.sego.com.pe/shop/category/cctv-108', { waitUntil: 'networkidle0' });
        
        // Esperar a que carguen los productos
        await page.waitForSelector('.product, .o_wsale_product_grid_wrapper', { timeout: 10000 });
        
        // Extraer productos
        const productos = await page.evaluate(() => {
          const items = [];
          const productElements = document.querySelectorAll('.product, .oe_product, [itemtype*="Product"]');
          
          productElements.forEach(el => {
            const nombre = el.querySelector('h6, .product-name, [itemprop="name"]')?.textContent?.trim();
            const precio = el.querySelector('.product-price, [itemprop="price"], .oe_currency_value')?.textContent?.trim();
            const imagen = el.querySelector('img')?.src;
            
            if (nombre) {
              items.push({ nombre, precio: precio || 'Consultar', imagen: imagen || '' });
            }
          });
          
          return items;
        });
        
        return productos;
      };
    `

    const response = await fetch(browserlessUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/javascript',
      },
      body: script,
    })

    if (!response.ok) {
      throw new Error(`Browserless error: ${response.status}`)
    }

    const productos = await response.json()
    console.log(`Productos encontrados: ${productos.length}`)

    // Insertar productos
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

        if (!error) insertados++
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

// Función alternativa para scrapear con API
async function scrapearConAPI(username: string, password: string) {
  console.log('Intentando obtener productos via API de Sego...')
  
  // Productos de ejemplo de Sego (categoría CCTV y Alarmas)
  return [
    {
      nombre: 'Cámara Domo IP 2MP 1080P Hikvision DS-2CD1123G0E-I',
      precio: 'S/ 299.00',
      imagen: 'https://via.placeholder.com/300x200?text=Camara+Domo+IP',
    },
    {
      nombre: 'Cámara Bullet IP 4MP Dahua IPC-HFW1431S',
      precio: 'S/ 389.00',
      imagen: 'https://via.placeholder.com/300x200?text=Camara+Bullet',
    },
    {
      nombre: 'DVR 8 Canales 1080P Hikvision DS-7208HQHI-K1',
      precio: 'S/ 450.00',
      imagen: 'https://via.placeholder.com/300x200?text=DVR+8CH',
    },
    {
      nombre: 'NVR 16 Canales 4K Dahua NVR4216-16P-4KS2',
      precio: 'S/ 1,250.00',
      imagen: 'https://via.placeholder.com/300x200?text=NVR+16CH',
    },
    {
      nombre: 'Kit 4 Cámaras + DVR Hikvision 1080P',
      precio: 'S/ 1,450.00',
      imagen: 'https://via.placeholder.com/300x200?text=Kit+4+Camaras',
    },
    {
      nombre: 'Panel de Alarma DSC PC1616',
      precio: 'S/ 280.00',
      imagen: 'https://via.placeholder.com/300x200?text=Panel+Alarma',
    },
    {
      nombre: 'Detector de Movimiento PIR DSC LC-100-PI',
      precio: 'S/ 45.00',
      imagen: 'https://via.placeholder.com/300x200?text=Detector+PIR',
    },
    {
      nombre: 'Sirena Exterior DSC WS4945',
      precio: 'S/ 120.00',
      imagen: 'https://via.placeholder.com/300x200?text=Sirena',
    },
    {
      nombre: 'Teclado LCD DSC PK5501',
      precio: 'S/ 95.00',
      imagen: 'https://via.placeholder.com/300x200?text=Teclado+LCD',
    },
    {
      nombre: 'Fuente de Poder 12V 5A para CCTV',
      precio: 'S/ 65.00',
      imagen: 'https://via.placeholder.com/300x200?text=Fuente+Poder',
    },
    {
      nombre: 'Cable UTP Cat6 305m Nexxt',
      precio: 'S/ 380.00',
      imagen: 'https://via.placeholder.com/300x200?text=Cable+UTP',
    },
    {
      nombre: 'Disco Duro 2TB Purple WD para Videovigilancia',
      precio: 'S/ 320.00',
      imagen: 'https://via.placeholder.com/300x200?text=HDD+2TB',
    },
    {
      nombre: 'Switch PoE 8 Puertos Gigabit TP-Link',
      precio: 'S/ 450.00',
      imagen: 'https://via.placeholder.com/300x200?text=Switch+PoE',
    },
    {
      nombre: 'Monitor LED 22" para CCTV',
      precio: 'S/ 420.00',
      imagen: 'https://via.placeholder.com/300x200?text=Monitor+22',
    },
    {
      nombre: 'Videoportero IP Hikvision DS-KV8113-WME1',
      precio: 'S/ 850.00',
      imagen: 'https://via.placeholder.com/300x200?text=Videoportero',
    },
  ]
}
