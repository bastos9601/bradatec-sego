// Script de scraping local con Puppeteer
// Ejecutar: npm run scrape

import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

// Configuración
const SUPABASE_URL = 'https://sajuzexibgpikrijqdjt.supabase.co';
// SERVICE_ROLE_KEY para bypass RLS (solo para scripts locales, NUNCA en frontend)
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhanV6ZXhpYmdwaWtyaWpxZGp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcyMTY5MSwiZXhwIjoyMDkyMjk3NjkxfQ.wTa-eql_LSBn5pdJfbZoluzVZ1gdoJc2lcW39AQ9Nd4';

// Credenciales de Sego
const SEGO_USERNAME = 'bradatecsrl@gmail.com';
const SEGO_PASSWORD = '20608918371';

// Usar SERVICE_ROLE_KEY para bypass RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function scrapearSego() {
  console.log('🚀 Iniciando scraping de Sego...');
  
  const browser = await puppeteer.launch({
    headless: false, // Cambia a true para modo invisible
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();
    
    // Capturar logs de la consola del navegador
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Producto') || text.includes('✓') || text.includes('✗')) {
        console.log('   [Browser]', text);
      }
    });
    
    // 1. Login en Sego - MANUAL
    console.log('🔐 Abriendo página de login de Sego...');
    await page.goto('https://www.sego.com.pe/web/login', { waitUntil: 'networkidle2' });
    
    console.log('\n⏸️  PAUSA: Inicia sesión manualmente en el navegador');
    console.log('   1. Escribe tu email y contraseña');
    console.log('   2. Haz clic en "Iniciar sesión"');
    console.log('   3. Espera a que cargue la página principal');
    console.log('   4. El script continuará automáticamente...\n');
    
    // Esperar a que el usuario inicie sesión manualmente
    // Detectar cuando ya no esté en la página de login
    await page.waitForFunction(
      () => {
        // Verificar si ya no está en la página de login
        const loginForm = document.querySelector('input[name="login"]');
        const userMenu = document.querySelector('.o_user_menu, .dropdown-toggle');
        return !loginForm && userMenu;
      },
      { timeout: 120000 } // Esperar hasta 2 minutos
    );
    
    console.log('✅ Sesión iniciada manualmente detectada');
    
    // Esperar un poco más para asegurar que todo cargó
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar si realmente inició sesión
    const currentUrl = page.url();
    console.log('   📍 URL actual:', currentUrl);

    console.log('✅ Sesión iniciada - Continuando con el scraping...');

    let todosLosProductos = [];

    // 2. Definir categorías a scrapear (basado en la estructura de Sego)
    const categoriasConfig = [
      { 
        nombre: 'CCTV', 
        url: 'https://www.sego.com.pe/shop/category/cctv-108',
        paginas: 20 
      },
      { 
        nombre: 'OFERTAS', 
        url: 'https://www.sego.com.pe/shop/category/ofertas-244',
        paginas: 4 
      },
      { 
        nombre: 'LO MAS NUEVO', 
        url: 'https://www.sego.com.pe/shop/category/lo-mas-nuevo-250',
        paginas: 17 
      },
      


      { 
        nombre: 'CCTV - Accesorios', 
        url: 'https://www.sego.com.pe/shop/category/cctv-accesorios-109',
        paginas: 5 
      },
      { 
        nombre: 'CCTV - Baluns', 
        url: 'https://www.sego.com.pe/shop/category/cctv-baluns-110',
        paginas: 2 
      },
      { 
        nombre: 'CCTV - Lentes', 
        url: 'https://www.sego.com.pe/shop/category/cctv-lentes-111',
        paginas: 2 
      },
      { 
        nombre: 'CCTV - Soportes y Housings', 
        url: 'https://www.sego.com.pe/shop/category/cctv-soportes-y-housings-112',
        paginas: 3 
      },
      { 
        nombre: 'CCTV - Cámaras Analógicas', 
        url: 'https://www.sego.com.pe/shop/category/cctv-camaras-analogicas-129',
        paginas: 3 
      },
      { 
        nombre: 'CCTV - Dvrs', 
        url: 'https://www.sego.com.pe/shop/category/cctv-dvr-s-139',
        paginas: 1
      },
      { 
        nombre: 'CCTV - Cámaras Ip', 
        url: 'https://www.sego.com.pe/shop/category/cctv-camaras-ip-118',
        paginas: 9
      },
      
      { 
        nombre: 'Alarmas contra Robo', 
        url: 'https://www.sego.com.pe/shop/category/alarmas-contra-robo-113',
        paginas: 5 
      },
      { 
        nombre: 'Alarmas contra Incendio', 
        url: 'https://www.sego.com.pe/shop/category/alarmas-contra-incendio-158',
        paginas: 2 
      },
      { 
        nombre: 'Audio', 
        url: 'https://www.sego.com.pe/shop/category/audio-114',
        paginas: 3 
      },
      { 
        nombre: 'Control Acceso y Asistencia', 
        url: 'https://www.sego.com.pe/shop/category/control-acceso-y-asistencia-120',
        paginas: 5 
      },
      { 
        nombre: 'Networking', 
        url: 'https://www.sego.com.pe/shop/category/networking-103',
        paginas: 5 
      },
      { 
        nombre: 'Punto de Venta - POS', 
        url: 'https://www.sego.com.pe/shop/category/punto-de-venta-pos-115',
        paginas: 2 
      },
      { 
        nombre: 'Almacenamiento', 
        url: 'https://www.sego.com.pe/shop/category/almacenamiento-116',
        paginas: 2 
      },
      { 
        nombre: 'Automatización', 
        url: 'https://www.sego.com.pe/shop/category/automatizacion-117',
        paginas: 2 
      },
      { 
        nombre: 'Administrativo', 
        url: 'https://www.sego.com.pe/shop/category/administrativo-118',
        paginas: 1 
      }
    ];

    // 3. Scrapear cada categoría
    for (const categoria of categoriasConfig) {
      console.log(`\n🏷️  CATEGORÍA: ${categoria.nombre}`);
      console.log(`   Páginas a scrapear: ${categoria.paginas}`);
      
      for (let pagina = 1; pagina <= categoria.paginas; pagina++) {
        const url = pagina === 1 
          ? categoria.url 
          : `${categoria.url}/page/${pagina}`;
        
        console.log(`\n📦 Scrapeando página ${pagina}/${categoria.paginas}: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Esperar a que carguen los productos Y los precios
        console.log('   ⏳ Esperando a que carguen los precios...');
        
        // Esperar específicamente a que aparezca el precio
        try {
          await page.waitForSelector('.oe_currency_value', { timeout: 15000 });
          console.log('   ✓ Precios cargados');
          
          // Esperar 2 segundos adicionales para asegurar que todo cargó
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
          console.log('   ⚠️ No se detectaron precios, esperando 5 segundos...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        }

      // DEBUG: Ver HTML de la página
      const html = await page.content();
      console.log('   🔍 Buscando selectores en el HTML...');
      
      // Buscar posibles selectores de productos
      const debug = await page.evaluate(() => {
        const selectors = [
          '.oe_product',
          '.o_wsale_product_grid_wrapper',
          '.o_wsale_product_information',
          '[itemtype*="Product"]',
          '.product',
          '.product-item',
          'article',
          '[data-product-id]'
        ];
        
        const found = {};
        selectors.forEach(sel => {
          const elements = document.querySelectorAll(sel);
          if (elements.length > 0) {
            found[sel] = elements.length;
          }
        });
        
        return found;
      });
      
      console.log('   📋 Selectores encontrados:', debug);

      // DEBUG: Guardar HTML de un producto
      const sampleHTML = await page.evaluate(() => {
        const firstProduct = document.querySelector('[itemtype*="Product"]');
        return firstProduct ? firstProduct.outerHTML : 'No se encontró producto';
      });
      
      console.log('   📄 HTML del primer producto (primeros 500 chars):');
      console.log(sampleHTML.substring(0, 500));

      // Extraer productos con la categoría actual
      const productos = await page.evaluate((categoriaNombre) => {
        const items = [];
        
        // Usar el selector que funciona: [itemtype*="Product"]
        const productElements = document.querySelectorAll('[itemtype*="Product"]');
        
        console.log('Elementos encontrados:', productElements.length);
        
        productElements.forEach((el, index) => {
          try {
            // Buscar nombre - probar múltiples selectores
            let nombre = null;
            const nombreSelectors = [
              '[itemprop="name"]',
              'h6',
              'h5',
              'h4',
              '.product-name',
              '.o_wsale_products_item_title',
              'a[href*="/shop/product/"]'
            ];
            
            for (const sel of nombreSelectors) {
              const el2 = el.querySelector(sel);
              if (el2?.textContent?.trim()) {
                nombre = el2.textContent.trim();
                break;
              }
            }
            
            // Buscar precio CON IGV
            let precio = null;
            // Buscar el elemento que contiene "Precio con IGV:" y luego el precio
            const precioCustomDiv = el.querySelector('.row.text-center.text-lg-start .div.o.product_item_price_custom');
            if (precioCustomDiv) {
              // Buscar el small.fw-bold que tiene el precio con IGV
              const precioElements = precioCustomDiv.querySelectorAll('small.fw-bold');
              for (const precioEl of precioElements) {
                const texto = precioEl.textContent.trim();
                // Buscar el que tiene formato de precio ($ seguido de números)
                if (texto.match(/\$\s*[\d,]+\.?\d*/)) {
                  const match = texto.match(/\$\s*([\d,]+\.?\d*)/);
                  if (match) {
                    precio = `$ ${match[1]}`;
                    break;
                  }
                }
              }
            }
            
            // Fallback: buscar directamente small.fw-bold con precio
            if (!precio) {
              const allSmallBold = el.querySelectorAll('small.fw-bold');
              for (const smallEl of allSmallBold) {
                const texto = smallEl.textContent.trim();
                if (texto.match(/\$\s*[\d,]+\.?\d*/) && !texto.includes('Precio con IGV')) {
                  const match = texto.match(/\$\s*([\d,]+\.?\d*)/);
                  if (match) {
                    precio = `$ ${match[1]}`;
                    break;
                  }
                }
              }
            }
            
            // Último fallback
            if (!precio) {
              const precioEl = el.querySelector('.oe_currency_value');
              if (precioEl?.textContent?.trim()) {
                precio = `$ ${precioEl.textContent.trim()}`;
              }
            }
            
            // Extraer SKU
            let sku = null;
            const skuEl = el.querySelector('.text-muted');
            if (skuEl?.textContent?.includes('SKU:')) {
              sku = skuEl.textContent.replace('SKU:', '').trim();
            }
            
            // Extraer stock - buscar dentro de .tp-product-stock-label
            let stock = null;
            const stockLabelDiv = el.querySelector('.tp-product-stock-label');
            if (stockLabelDiv) {
              const stockSpan = stockLabelDiv.querySelector('span.fw-bold');
              if (stockSpan?.textContent?.trim()) {
                stock = stockSpan.textContent.trim();
              }
            }
            
            // Fallback para stock
            if (!stock) {
              const stockEl = el.querySelector('.tp-product-badge');
              if (stockEl?.textContent?.trim()) {
                stock = stockEl.textContent.trim();
              }
            }
            
            // Buscar imagen
            const imagenEl = el.querySelector('img');
            const imagen = imagenEl?.src || imagenEl?.getAttribute('data-src') || imagenEl?.getAttribute('data-lazy-src');
            
            if (nombre && precio) {
              const productoData = {
                nombre,
                precio,
                imagen: imagen || 'https://via.placeholder.com/300x200?text=Producto+Sego',
                categoria: categoriaNombre,
                sku: sku || '',
                stock: stock || ''
              };
              items.push(productoData);
              console.log(`✓ Producto ${index + 1}:`, nombre, '-', precio, sku ? `[SKU: ${sku}]` : '', stock ? `[${stock}]` : '');
            } else {
              console.log(`✗ Producto ${index + 1}: nombre=${nombre}, precio=${precio}`);
            }
          } catch (e) {
            console.error('Error extrayendo producto:', e);
          }
        });
        
        return items;
      }, categoria.nombre); // Pasar el nombre de la categoría

      console.log(`   ✓ Encontrados: ${productos.length} productos`);
      todosLosProductos = [...todosLosProductos, ...productos];
      
      // Mostrar progreso
      console.log(`   📊 Progreso: ${todosLosProductos.length} productos totales`);
      }
    }

    console.log(`\n📊 Total productos encontrados: ${todosLosProductos.length}`);

    // 4. Insertar en Supabase
    console.log('\n💾 Insertando en Supabase...');
    let insertados = 0;
    let duplicados = 0;

    for (const producto of todosLosProductos) {
      // Verificar si ya existe
      const { data: existente } = await supabase
        .from('productos')
        .select('id')
        .eq('nombre', producto.nombre)
        .single();

      if (!existente) {
        const { error } = await supabase
          .from('productos')
          .insert([producto]);

        if (error) {
          console.error(`   ✗ Error insertando: ${producto.nombre}`, error.message);
        } else {
          insertados++;
          console.log(`   ✓ Insertado: ${producto.nombre}`);
        }
      } else {
        duplicados++;
      }
    }

    console.log('\n✅ SCRAPING COMPLETADO');
    console.log(`   📦 Total encontrados: ${todosLosProductos.length}`);
    console.log(`   ✓ Insertados: ${insertados}`);
    console.log(`   ⊘ Duplicados: ${duplicados}`);

  } catch (error) {
    console.error('❌ Error durante el scraping:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar
scrapearSego().then(() => {
  console.log('\n🎉 Proceso finalizado');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
