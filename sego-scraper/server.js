import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta raíz para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Servidor de scraping Bradatec-Sego funcionando correctamente',
    endpoints: {
      scrape: 'POST /api/scrape',
      progreso: 'GET /api/scrape/progreso'
    }
  });
});

// Configuración de Supabase
const SUPABASE_URL = 'https://sajuzexibgpikrijqdjt.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhanV6ZXhpYmdwaWtyaWpxZGp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcyMTY5MSwiZXhwIjoyMDkyMjk3NjkxfQ.wTa-eql_LSBn5pdJfbZoluzVZ1gdoJc2lcW39AQ9Nd4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Credenciales de Sego
const SEGO_USERNAME = 'bradatecsrl@gmail.com';
const SEGO_PASSWORD = '20608918371';

// Estado del scraping
let scrapingEnProgreso = false;
let progreso = {
  categoriaActual: '',
  paginaActual: 0,
  totalPaginas: 0,
  productosEncontrados: 0,
  productosInsertados: 0
};

// Endpoint para iniciar el scraping
app.post('/api/scrape', async (req, res) => {
  if (scrapingEnProgreso) {
    return res.status(400).json({ 
      error: 'Ya hay un scraping en progreso',
      progreso 
    });
  }

  scrapingEnProgreso = true;
  progreso = {
    categoriaActual: 'Iniciando...',
    paginaActual: 0,
    totalPaginas: 0,
    productosEncontrados: 0,
    productosInsertados: 0
  };

  // Responder inmediatamente
  res.json({ 
    message: 'Scraping iniciado',
    status: 'en_progreso'
  });

  // Ejecutar scraping en background
  ejecutarScraping().catch(error => {
    console.error('Error en scraping:', error);
    scrapingEnProgreso = false;
  });
});

// Endpoint para obtener el progreso
app.get('/api/scrape/progreso', (req, res) => {
  res.json({
    enProgreso: scrapingEnProgreso,
    progreso
  });
});

async function ejecutarScraping() {
  console.log('🚀 Iniciando scraping de Sego...');
  
  const browser = await puppeteer.launch({
    headless: true, // Modo headless para servidores sin GUI
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ],
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();
    
    // Login AUTOMÁTICO en Sego
    console.log('🔐 Iniciando sesión en Sego...');
    await page.goto('https://www.sego.com.pe/web/login', { waitUntil: 'networkidle2' });
    
    // Esperar a que cargue el formulario
    await page.waitForSelector('input[name="login"]', { timeout: 10000 });
    
    // Llenar formulario de login
    await page.type('input[name="login"]', SEGO_USERNAME);
    await page.type('input[name="password"]', SEGO_PASSWORD);
    
    // Hacer clic en el botón de login
    await page.click('button[type="submit"]');
    
    progreso.categoriaActual = 'Iniciando sesión...';
    
    // Esperar a que se complete el login
    await page.waitForFunction(
      () => {
        const loginForm = document.querySelector('input[name="login"]');
        const userMenu = document.querySelector('.o_user_menu, .dropdown-toggle');
        return !loginForm && userMenu;
      },
      { timeout: 30000 }
    );
    
    console.log('✅ Sesión iniciada correctamente');
    await new Promise(resolve => setTimeout(resolve, 2000));

    let todosLosProductos = [];

    // Categorías a scrapear
    const categoriasConfig = [
      { nombre: 'CCTV', url: 'https://www.sego.com.pe/shop/category/cctv-108', paginas: 20 },
      { nombre: 'CCTV - Accesorios', url: 'https://www.sego.com.pe/shop/category/cctv-accesorios-109', paginas: 5 },
      { nombre: 'CCTV - Baluns', url: 'https://www.sego.com.pe/shop/category/cctv-baluns-110', paginas: 2 },
      { nombre: 'CCTV - Lentes', url: 'https://www.sego.com.pe/shop/category/cctv-lentes-111', paginas: 2 },
      { nombre: 'CCTV - Soportes y Housings', url: 'https://www.sego.com.pe/shop/category/cctv-soportes-y-housings-112', paginas: 3 },
      { nombre: 'CCTV - Cámaras Analógicas', url: 'https://www.sego.com.pe/shop/category/cctv-camaras-analogicas-129', paginas: 3 },
      { nombre: 'Alarmas contra Robo', url: 'https://www.sego.com.pe/shop/category/alarmas-contra-robo-113', paginas: 5 },
      { nombre: 'Alarmas contra Incendio', url: 'https://www.sego.com.pe/shop/category/alarmas-contra-incendio-158', paginas: 2 },
      { nombre: 'Audio', url: 'https://www.sego.com.pe/shop/category/audio-114', paginas: 3 },
      { nombre: 'Control Acceso y Asistencia', url: 'https://www.sego.com.pe/shop/category/control-acceso-y-asistencia-120', paginas: 5 },
      { nombre: 'Networking', url: 'https://www.sego.com.pe/shop/category/networking-103', paginas: 5 },
      { nombre: 'Punto de Venta - POS', url: 'https://www.sego.com.pe/shop/category/punto-de-venta-pos-115', paginas: 2 },
      { nombre: 'Almacenamiento', url: 'https://www.sego.com.pe/shop/category/almacenamiento-116', paginas: 2 },
      { nombre: 'Automatización', url: 'https://www.sego.com.pe/shop/category/automatizacion-117', paginas: 2 },
      { nombre: 'Administrativo', url: 'https://www.sego.com.pe/shop/category/administrativo-118', paginas: 1 },
      { nombre: 'Fuentes,Transf,ups,etc', url: 'https://www.sego.com.pe/shop/category/fuentes-transf-ups-etc-153', paginas: 3 }
    ];

    for (const categoria of categoriasConfig) {
      progreso.categoriaActual = categoria.nombre;
      progreso.totalPaginas = categoria.paginas;
      
      console.log(`\n🏷️  CATEGORÍA: ${categoria.nombre}`);
      
      for (let pagina = 1; pagina <= categoria.paginas; pagina++) {
        progreso.paginaActual = pagina;
        
        const url = pagina === 1 ? categoria.url : `${categoria.url}/page/${pagina}`;
        
        console.log(`📦 Scrapeando página ${pagina}/${categoria.paginas}`);
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        try {
          await page.waitForSelector('.oe_currency_value', { timeout: 15000 });
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }

        const productos = await page.evaluate((categoriaNombre) => {
          const items = [];
          const productElements = document.querySelectorAll('[itemtype*="Product"]');
          
          productElements.forEach((el) => {
            try {
              let nombre = null;
              const nombreSelectors = ['[itemprop="name"]', 'h6', 'h5', 'h4'];
              
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
              
              // Extraer imagen
              const imagenEl = el.querySelector('img');
              const imagen = imagenEl?.src || imagenEl?.getAttribute('data-src');
              
              if (nombre && precio) {
                items.push({
                  nombre,
                  precio,
                  imagen: imagen || 'https://via.placeholder.com/300x200?text=Producto+Sego',
                  categoria: categoriaNombre,
                  sku: sku || '',
                  stock: stock || ''
                });
              }
            } catch (e) {
              console.error('Error:', e);
            }
          });
          
          return items;
        }, categoria.nombre);

        todosLosProductos = [...todosLosProductos, ...productos];
        progreso.productosEncontrados = todosLosProductos.length;
        
        console.log(`✓ Encontrados: ${productos.length} productos (Total: ${todosLosProductos.length})`);
      }
    }

    console.log(`\n📊 Total productos encontrados: ${todosLosProductos.length}`);
    console.log('💾 Insertando en Supabase...');

    let insertados = 0;
    for (const producto of todosLosProductos) {
      const { data: existente } = await supabase
        .from('productos')
        .select('id')
        .eq('nombre', producto.nombre)
        .single();

      if (!existente) {
        const { error } = await supabase
          .from('productos')
          .insert([producto]);

        if (!error) {
          insertados++;
          progreso.productosInsertados = insertados;
        }
      }
    }

    console.log('✅ SCRAPING COMPLETADO');
    console.log(`   📦 Total encontrados: ${todosLosProductos.length}`);
    console.log(`   ✓ Insertados: ${insertados}`);

  } catch (error) {
    console.error('❌ Error durante el scraping:', error);
    throw error;
  } finally {
    await browser.close();
    scrapingEnProgreso = false;
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
  console.log(`📡 Endpoint de scraping: POST /api/scrape`);
  console.log(`📊 Endpoint de progreso: GET /api/scrape/progreso`);
});
