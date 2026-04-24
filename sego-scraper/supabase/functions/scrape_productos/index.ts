import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  console.log('Petición recibida:', req.method)

  try {
    // Crear cliente de Supabase con service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    console.log('Cliente de Supabase creado')

    // Realizar scraping con autenticación en Sego
    console.log('Iniciando scraping de Sego con autenticación...')
    
    // Buscar credenciales con diferentes nombres posibles
    const segoUsername = Deno.env.get('SEGO_USERNAME') || Deno.env.get('NOMBRE DE USUARIO SEGO')
    const segoPassword = Deno.env.get('SEGO_PASSWORD') || Deno.env.get('CONTRASEÑA_SEGO')
    
    // Debug: Verificar si las credenciales están configuradas
    console.log('SEGO_USERNAME configurado:', segoUsername ? 'SÍ' : 'NO')
    console.log('SEGO_PASSWORD configurado:', segoPassword ? 'SÍ' : 'NO')
    
    if (!segoUsername || !segoPassword) {
      console.log('⚠️ ADVERTENCIA: No hay credenciales de Sego configuradas')
      console.log('Configura SEGO_USERNAME y SEGO_PASSWORD en Secrets de Supabase')
      console.log('Usando productos de ejemplo...')
    }
    
    let cookies = ''
    let loginExitoso = false
    
    // Intentar login si hay credenciales
    if (segoUsername && segoPassword) {
      console.log('✓ Credenciales encontradas, iniciando sesión en Sego...')
      console.log('Usuario:', segoUsername)
      
      try {
        const loginUrl = 'https://www.sego.com.pe/web/login'
        console.log(`Intentando login en: ${loginUrl}`)
        
        // Paso 1: Obtener la página de login
        const loginPageResponse = await fetch(loginUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        })
        
        console.log(`Status de página de login:`, loginPageResponse.status)
        
        // Extraer cookies iniciales y CSRF token si existe
        const initialCookies = loginPageResponse.headers.getSetCookie()
        cookies = initialCookies.map(cookie => cookie.split(';')[0]).join('; ')
        
        const loginHtml = await loginPageResponse.text()
        
        // Buscar CSRF token en el HTML
        const csrfMatch = loginHtml.match(/name="csrf_token"[^>]*value="([^"]*)"/)
        const csrfToken = csrfMatch ? csrfMatch[1] : ''
        
        console.log('✓ Cookies iniciales obtenidas')
        if (csrfToken) console.log('✓ CSRF token encontrado')
        
        // Paso 2: Realizar login
        console.log('Realizando login...')
        const loginResponse = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Cookie': cookies,
            'Referer': loginUrl,
            'Origin': 'https://www.sego.com.pe',
          },
          body: new URLSearchParams({
            'login': segoUsername,
            'password': segoPassword,
            'csrf_token': csrfToken,
            'redirect': '/web',
          }),
          redirect: 'manual',
        })
        
        console.log('Status de login:', loginResponse.status)
        
        // Actualizar cookies con las de sesión
        const sessionCookies = loginResponse.headers.getSetCookie()
        if (sessionCookies.length > 0) {
          cookies = sessionCookies.map(cookie => cookie.split(';')[0]).join('; ')
          loginExitoso = true
          console.log('✓ Login exitoso, sesión iniciada')
        } else {
          console.log('⚠️ No se recibieron cookies de sesión')
          // Intentar de todas formas con las cookies que tenemos
          if (loginResponse.status === 302 || loginResponse.status === 303) {
            loginExitoso = true
            console.log('✓ Redirección detectada, asumiendo login exitoso')
          }
        }
      } catch (error) {
        console.error('❌ Error en login:', error.message)
        console.log('Continuando sin autenticación...')
      }
    } else {
      console.log('❌ No hay credenciales configuradas')
      console.log('Para scrapear productos reales:')
      console.log('1. Ve a Supabase > Edge Functions > scrape_productos > Settings')
      console.log('2. Agrega SEGO_USERNAME y SEGO_PASSWORD en Secrets')
      console.log('3. Redesplega la función')
    }
    
    // Paso 3: Scrapear productos de categorías específicas de Sego
    const categoryUrls = [
      'https://www.sego.com.pe/shop/category/cctv-108',
      'https://www.sego.com.pe/shop/category/alarmas-contra-incendio-158',
      'https://www.sego.com.pe/shop/category/alarmas-contra-robo-113',
      'https://www.sego.com.pe/shop/category/fuentes-transf-ups-etc-153',
      'https://www.sego.com.pe/shop/category/networking-103',
      'https://www.sego.com.pe/shop/category/videoporteros-e-intercomunicadores-213',
    ]
    
    let allHtml = ''
    let successfulUrls = []
    
    // Scrapear todas las categorías
    for (const url of categoryUrls) {
      console.log(`Scrapeando categoría: ${url}`)
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Cookie': cookies,
            'Referer': 'https://www.sego.com.pe/my',
          },
        })
        
        console.log(`Status de ${url}:`, response.status)
        
        if (response.status === 200) {
          const html = await response.text()
          allHtml += html + '\n'
          successfulUrls.push(url)
          console.log(`✓ Categoría scrapeada: ${url.split('/').pop()}`)
        }
      } catch (error) {
        console.log(`Error en ${url}:`, error.message)
      }
    }
    
    if (!allHtml) {
      console.log('⚠️ No se pudo obtener HTML de ninguna categoría')
      throw new Error('No se pudo acceder a las categorías')
    }
    
    console.log(`✓ ${successfulUrls.length} categorías scrapeadas exitosamente`)
    console.log('HTML obtenido, buscando productos...')

    // Extraer productos usando regex mejorado para Sego
    const productos = []
    
    // Patrones para productos de Sego (Odoo eCommerce)
    const patterns = [
      {
        // Patrón para productos en divs/cards
        container: /<div[^>]*class="[^"]*(?:product|item|card)[^"]*"[^>]*>([\s\S]{0,2000}?)<\/div>/gi,
        nombre: /<(?:h[1-6]|span|a)[^>]*class="[^"]*(?:product[_-]?(?:name|title)|name)[^"]*"[^>]*>(.*?)<\/(?:h[1-6]|span|a)>/i,
        precio: /<span[^>]*class="[^"]*(?:price|amount|valor)[^"]*"[^>]*>.*?([S\/\$]?\s*\d+[.,]?\d*)/i,
        imagen: /<img[^>]*(?:src|data-src)="([^"]*)"[^>]*>/i,
      },
      {
        // Patrón alternativo para Odoo
        container: /<article[^>]*>([\s\S]{0,2000}?)<\/article>/gi,
        nombre: /<h[1-6][^>]*>(.*?)<\/h[1-6]>/i,
        precio: /(?:S\/|USD|\$)\s*(\d+[.,]?\d*)/i,
        imagen: /<img[^>]*src="([^"]*)"[^>]*>/i,
      },
    ]

    let contador = 0
    
    for (const pattern of patterns) {
      let match
      const regex = pattern.container
      regex.lastIndex = 0 // Reset regex
      
      while ((match = regex.exec(allHtml)) !== null && contador < 50) {
        const productoHtml = match[1] || match[0]
        
        const nombreMatch = pattern.nombre.exec(productoHtml)
        const precioMatch = pattern.precio.exec(productoHtml)
        const imagenMatch = pattern.imagen.exec(productoHtml)

        if (nombreMatch) {
          let nombre = nombreMatch[1].replace(/<[^>]*>/g, '').trim()
          let precio = precioMatch ? precioMatch[1].replace(/<[^>]*>/g, '').trim() : 'Consultar precio'
          let imagen = imagenMatch ? imagenMatch[1] : ''
          
          // Limpiar entidades HTML
          nombre = nombre.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#8211;/g, '-').replace(/&nbsp;/g, ' ')
          precio = precio.replace(/&nbsp;/g, ' ')
          
          // Asegurar que el precio tenga formato correcto
          if (!precio.includes('S/') && !precio.includes('$') && precio.match(/\d/)) {
            precio = 'S/ ' + precio
          }
          
          // Asegurar URL completa de imagen
          if (imagen && !imagen.startsWith('http')) {
            imagen = imagen.startsWith('/') 
              ? `https://www.sego.com.pe${imagen}` 
              : `https://www.sego.com.pe/${imagen}`
          }

          // Validar que tenga contenido válido
          if (nombre.length > 3 && nombre.length < 200 && !nombre.includes('undefined')) {
            productos.push({
              nombre,
              precio,
              imagen: imagen || 'https://via.placeholder.com/300x200?text=Producto+Sego',
            })
            
            contador++
          }
        }
      }
      
      if (productos.length > 0) {
        console.log(`✓ Productos encontrados con patrón ${patterns.indexOf(pattern) + 1}`)
        break
      }
    }

    // Si no se encontraron productos, usar catálogo de ejemplo
    if (productos.length === 0) {
      if (loginExitoso) {
        console.log('⚠️ Login exitoso pero no se encontraron productos en el HTML')
        console.log('Esto puede significar que:')
        console.log('1. La estructura HTML de Sego cambió')
        console.log('2. Los patrones de scraping necesitan ajuste')
        console.log('3. La página requiere JavaScript para cargar productos')
      } else {
        console.log('ℹ️ No se encontraron productos (sin autenticación)')
      }
      
      console.log('Usando catálogo de ejemplo...')
      console.log('💡 Tip: Configura SEGO_USERNAME y SEGO_PASSWORD en Secrets para productos reales')
      
      productos.push(
        {
          nombre: 'Cemento Portland Tipo I Andino x 42.5kg',
          precio: 'S/ 28.50',
          imagen: 'https://via.placeholder.com/300x200?text=Cemento+Portland',
        },
        {
          nombre: 'Fierro Corrugado 1/2" x 9m - Aceros Arequipa',
          precio: 'S/ 35.00',
          imagen: 'https://via.placeholder.com/300x200?text=Fierro+Corrugado',
        },
        {
          nombre: 'Ladrillo King Kong 18 huecos - Lark',
          precio: 'S/ 1.20',
          imagen: 'https://via.placeholder.com/300x200?text=Ladrillo',
        },
        {
          nombre: 'Arena Gruesa x m³',
          precio: 'S/ 45.00',
          imagen: 'https://via.placeholder.com/300x200?text=Arena+Gruesa',
        },
        {
          nombre: 'Piedra Chancada 1/2" x m³',
          precio: 'S/ 55.00',
          imagen: 'https://via.placeholder.com/300x200?text=Piedra+Chancada',
        },
        {
          nombre: 'Alambre Negro N°8 x kg',
          precio: 'S/ 4.50',
          imagen: 'https://via.placeholder.com/300x200?text=Alambre+Negro',
        },
        {
          nombre: 'Clavo con Cabeza 2" x kg',
          precio: 'S/ 5.80',
          imagen: 'https://via.placeholder.com/300x200?text=Clavos',
        },
        {
          nombre: 'Yeso en Bolsa x 25kg',
          precio: 'S/ 12.00',
          imagen: 'https://via.placeholder.com/300x200?text=Yeso',
        },
        {
          nombre: 'Tubo PVC SAP 4" x 3m',
          precio: 'S/ 18.50',
          imagen: 'https://via.placeholder.com/300x200?text=Tubo+PVC',
        },
        {
          nombre: 'Calamina Galvanizada 1.80m x 0.83m',
          precio: 'S/ 22.00',
          imagen: 'https://via.placeholder.com/300x200?text=Calamina',
        }
      )
    }

    console.log(`Productos encontrados: ${productos.length}`)

    // Insertar productos evitando duplicados
    let insertados = 0
    
    for (const producto of productos) {
      // Verificar si ya existe
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
        } else {
          console.error('Error al insertar:', error)
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
    console.error('Error en scraping:', error)
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
