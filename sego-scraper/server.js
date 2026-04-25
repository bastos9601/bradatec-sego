import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para permitir todas las peticiones
app.use(cors({
  origin: '*', // Permitir todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

// Endpoint para conectar cuenta de Sego (guardar cookies)
app.post('/api/conectar-sego', async (req, res) => {
  const { email, password, userId } = req.body;
  
  if (!email || !password || !userId) {
    return res.status(400).json({ 
      error: 'Se requieren email, password y userId' 
    });
  }

  try {
    console.log('🔐 Conectando cuenta de Sego...');
    
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Anti-bot
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // Cargar página con timeout más largo
    await page.goto('https://www.sego.com.pe/web/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    await page.waitForSelector('input[name="login"]', { timeout: 15000 });
    
    await page.type('input[name="login"]', email, { delay: 50 });
    await page.type('input[name="password"]', password, { delay: 50 });
    
    // Enviar formulario con Enter (más robusto)
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
      page.keyboard.press('Enter')
    ]);
    
    // Verificar que el login fue exitoso
    const sigueLogueado = await page.evaluate(() => {
      return !!document.querySelector('.o_user_menu, .dropdown-toggle');
    });
    
    if (!sigueLogueado) {
      await browser.close();
      return res.status(401).json({ 
        error: 'Credenciales incorrectas o login falló' 
      });
    }
    
    // Guardar cookies
    const cookies = await page.cookies();
    
    console.log('💾 Guardando cookies:', cookies.length, 'cookies encontradas');
    console.log('🔑 Cookies importantes:', cookies.filter(c => 
      c.name.includes('session') || c.name.includes('token') || c.name.includes('auth')
    ).map(c => c.name));
    
    // Guardar en Supabase
    const { error } = await supabase
      .from('sego_sessions')
      .upsert({
        user_id: userId,
        email: email,
        cookies: cookies
      }, {
        onConflict: 'user_id'
      });
    
    await browser.close();
    
    if (error) {
      console.error('Error guardando sesión:', error);
      return res.status(500).json({ 
        error: 'Error guardando sesión' 
      });
    }
    
    console.log('✅ Sesión de Sego guardada correctamente');
    res.json({ 
      ok: true,
      message: 'Cuenta conectada exitosamente' 
    });
    
  } catch (error) {
    console.error('Error conectando Sego:', error);
    res.status(500).json({ 
      error: 'Error al conectar con Sego: ' + error.message 
    });
  }
});

// Endpoint para verificar si hay sesión guardada
app.get('/api/sego-session/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('sego_sessions')
      .select('email, created_at')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      return res.json({ connected: false });
    }
    
    res.json({ 
      connected: true,
      email: data.email,
      connectedAt: data.created_at
    });
  } catch (error) {
    res.json({ connected: false });
  }
});

// Endpoint para iniciar el scraping
app.post('/api/scrape', async (req, res) => {
  if (scrapingEnProgreso) {
    return res.status(400).json({ 
      error: 'Ya hay un scraping en progreso',
      progreso 
    });
  }

  // Obtener credenciales o userId del request body
  const { username, password, userId } = req.body;
  
  // Si no hay userId, requerir credenciales
  if (!userId && (!username || !password)) {
    return res.status(400).json({ 
      error: 'Se requiere userId o credenciales de Sego (username y password)' 
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
  ejecutarScraping(username, password, userId).catch(error => {
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

async function ejecutarScraping(username, password, userId) {
  console.log('🚀 Iniciando scraping de Sego...');
  
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Anti-bot: User Agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // Ocultar que es bot
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });
    
    // 🔥 IMPORTANTE: NO bloquear recursos cuando usamos sesiones
    // Las cookies pueden no funcionar correctamente sin CSS/JS
    if (!userId) {
      // Solo bloquear recursos si NO hay sesión guardada (login nuevo)
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
          req.abort();
        } else {
          req.continue();
        }
      });
      console.log('⚡ Bloqueando recursos pesados para login más rápido');
    } else {
      console.log('📦 Permitiendo todos los recursos para sesión guardada');
    }
    
    // Intentar usar sesión guardada primero
    let usandoSesionGuardada = false;
    let sesionValida = false;
    
    if (userId) {
      console.log('🔍 Buscando sesión guardada...');
      const { data, error } = await supabase
        .from('sego_sessions')
        .select('cookies, email')
        .eq('user_id', userId)
        .single();
      
      if (!error && data && data.cookies && data.cookies.length > 0) {
        console.log('✅ Sesión encontrada, intentando usar cookies guardadas');
        console.log('🔧 Cookies a cargar:', data.cookies.length);
        
        try {
          // 1. Ir a página base primero
          await page.goto('https://www.sego.com.pe', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });
          
          console.log('📍 En página base, cargando cookies...');
          
          // 2. Cargar cookies
          await page.setCookie(...data.cookies);
          
          // Esperar a que las cookies se apliquen
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          console.log('🔄 Cookies cargadas, navegando a tienda...');
          
          // 3. Ir a categoría CCTV para verificar
          await page.goto('https://www.sego.com.pe/shop/category/cctv-108', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });
          
          console.log('📍 En página de categoría CCTV');
          
          // Esperar a que productos se carguen
          try {
            await page.waitForSelector('[itemtype*="Product"]', { timeout: 15000 });
            console.log('✅ Selector de productos encontrado');
          } catch (e) {
            console.log('⚠️ Selector de productos no encontrado, esperando más...');
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
          
          // Contar productos
          const count = await page.evaluate(() => {
            return document.querySelectorAll('[itemtype*="Product"]').length;
          });
          console.log('🧪 Productos detectados:', count);
          
          if (count > 0) {
            console.log('✅ Sesión válida, productos detectados correctamente');
            usandoSesionGuardada = true;
            sesionValida = true;
            progreso.categoriaActual = 'Sesión restaurada';
          } else {
            console.log('⚠️ Sesión no válida (0 productos), haciendo login nuevamente...');
            usandoSesionGuardada = false;
          }
          
        } catch (e) {
          console.log('❌ Error al usar sesión guardada:', e.message);
          usandoSesionGuardada = false;
        }
      }
    }
    
    // Si no hay sesión guardada o no funcionó, hacer login
    if (!usandoSesionGuardada) {
      if (!username || !password) {
        throw new Error('Se requieren credenciales para hacer login');
      }
      
      console.log('🔐 Iniciando sesión en Sego...');
      console.log('👤 Usuario:', username);
      
      // Cargar página con timeout más largo
      await page.goto('https://www.sego.com.pe/web/login', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      
      // Esperar inputs
      await page.waitForSelector('input[name="login"]', { timeout: 15000 });
      
      // Escribir lento (anti-bot)
      await page.type('input[name="login"]', username, { delay: 50 });
      await page.type('input[name="password"]', password, { delay: 50 });
      
      // Screenshot para debug (opcional)
      // await page.screenshot({ path: 'login-debug.png', fullPage: true });
      
      // Enviar formulario con Enter (más robusto que click)
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
        page.keyboard.press('Enter')
      ]);
      
      // Validar que el login fue exitoso
      const logged = await page.evaluate(() => {
        return !!document.querySelector('.o_user_menu, .dropdown-toggle');
      });
      
      if (!logged) {
        throw new Error('Login fallido - credenciales incorrectas o página no cargó correctamente');
      }
      
      console.log('✅ Login completado exitosamente');
      progreso.categoriaActual = 'Login exitoso';
      
      // Guardar cookies para próxima vez (si tenemos userId)
      if (userId) {
        try {
          const cookies = await page.cookies();
          console.log('💾 Guardando', cookies.length, 'cookies...');
          
          const { error } = await supabase
            .from('sego_sessions')
            .upsert({
              user_id: userId,
              email: username,
              cookies: cookies
            }, {
              onConflict: 'user_id'
            });
          
          if (error) {
            console.error('⚠️ Error guardando cookies:', error);
          } else {
            console.log('✅ Cookies guardadas correctamente para próxima vez');
          }
        } catch (e) {
          console.error('❌ Error al guardar cookies:', e.message);
        }
      }
    }

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
        
        // Más rápido: domcontentloaded en vez de networkidle2
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        
        // 🔥 ESPERAR A QUE LOS PRODUCTOS SE CARGUEN
        try {
          await page.waitForSelector('[itemtype*="Product"]', { timeout: 15000 });
          console.log('✅ Productos detectados en página');
        } catch (e) {
          console.log('⚠️ No se detectaron productos, intentando con selector alternativo...');
          try {
            await page.waitForSelector('.oe_product_cart', { timeout: 10000 });
          } catch (e2) {
            console.log('⚠️ Selector alternativo tampoco funcionó, continuando...');
          }
        }
        
        try {
          await page.waitForSelector('.oe_currency_value', { timeout: 15000 });
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Delay inteligente (simula humano)
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));

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
        
        // 🔥 DEBUG: Si no se encontraron productos, tomar screenshot
        if (productos.length === 0) {
          console.log('⚠️ No se encontraron productos en esta página, tomando screenshot...');
          await page.screenshot({ 
            path: `debug-no-products-${categoria.nombre.replace(/[^a-z0-9]/gi, '-')}-p${pagina}.png`, 
            fullPage: true 
          });
        }
      }
    }

    console.log(`\n📊 Total productos encontrados: ${todosLosProductos.length}`);
    console.log('💾 Procesando productos para inserción...');

    // 🔥 ESTRATEGIA: Usar NOMBRE como identificador único (no SKU)
    // Razón: Sego tiene múltiples SKUs por producto (variantes)
    // Ejemplo: "Tipo de Cambio" tiene SKU: HK-DS-KI6608-P y HK-IDS7208HQH-M1/XT
    
    const nombreMap = new Map();
    const productosUnicos = [];
    const productosDuplicados = [];

    for (const prod of todosLosProductos) {
      const nombreNormalizado = prod.nombre.toLowerCase().trim();
      
      if (nombreMap.has(nombreNormalizado)) {
        // Es un duplicado (mismo nombre)
        productosDuplicados.push({
          nombre: prod.nombre,
          sku: prod.sku || 'SIN SKU',
          precio: prod.precio,
          categoria: prod.categoria
        });
      } else {
        // Es único
        nombreMap.set(nombreNormalizado, true);
        productosUnicos.push({
          ...prod,
          // Generar ID único usando UUID v4
          id: uuidv4()
        });
      }
    }
    
    console.log(`📊 Análisis de productos:`);
    console.log(`   ✓ Total encontrados: ${todosLosProductos.length}`);
    console.log(`   ✓ Productos únicos (por nombre): ${productosUnicos.length}`);
    console.log(`   ⚠️ Productos duplicados (ignorados): ${productosDuplicados.length}`);
    
    if (productosDuplicados.length > 0 && productosDuplicados.length <= 10) {
      console.log(`\n   Duplicados encontrados:`);
      productosDuplicados.forEach((dup, i) => {
        console.log(`   ${i + 1}. ${dup.nombre} | SKU: ${dup.sku} | ${dup.precio} | ${dup.categoria}`);
      });
    } else if (productosDuplicados.length > 10) {
      console.log(`   (Mostrando primeros 10 de ${productosDuplicados.length})`);
      productosDuplicados.slice(0, 10).forEach((dup, i) => {
        console.log(`   ${i + 1}. ${dup.nombre} | SKU: ${dup.sku} | ${dup.precio} | ${dup.categoria}`);
      });
    }

    // Insertar en lotes para evitar timeout
    const tamanoLote = 100;
    let productosInsertados = 0;
    let erroresInsercion = 0;

    console.log(`\n💾 Insertando en Supabase (modo masivo)...`);

    for (let i = 0; i < productosUnicos.length; i += tamanoLote) {
      const lote = productosUnicos.slice(i, i + tamanoLote);
      const numeroLote = Math.floor(i / tamanoLote) + 1;
      const totalLotes = Math.ceil(productosUnicos.length / tamanoLote);
      
      console.log(`📦 Insertando lote ${numeroLote}/${totalLotes} (${lote.length} productos)...`);

      try {
        const { error } = await supabase
          .from('productos')
          .upsert(lote, { 
            onConflict: 'sku',
            ignoreDuplicates: false
          });

        if (error) {
          console.error(`⚠️ Error en lote ${numeroLote}:`, error.message);
          erroresInsercion++;
        } else {
          productosInsertados += lote.length;
          console.log(`✅ Lote ${numeroLote} insertado/actualizado correctamente (${lote.length} productos)`);
        }
      } catch (e) {
        console.error(`❌ Error al insertar lote ${numeroLote}:`, e.message);
        erroresInsercion++;
      }
    }

    progreso.productosInsertados = productosInsertados;
    
    console.log(`\n✅ SCRAPING COMPLETADO`);
    console.log(`   📦 Total encontrados en Sego: ${todosLosProductos.length}`);
    console.log(`   ✓ Productos únicos (sin duplicados): ${productosUnicos.length}`);
    console.log(`   ⚠️ Duplicados descartados: ${productosDuplicados.length}`);
    console.log(`   ✓ Insertados/Actualizados en BD: ${productosInsertados}`);
    
    if (erroresInsercion > 0) {
      console.log(`   ❌ Errores en inserción: ${erroresInsercion}`);
    }

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
