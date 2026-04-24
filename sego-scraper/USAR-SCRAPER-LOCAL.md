# 🎯 Cómo usar el Scraper Local (Recomendado)

## Por qué usar el scraper local

Después de probar Railway y Render, la solución más confiable es ejecutar el scraper en tu computadora:

✅ **Ventajas**:
- Funciona al 100% (Chrome instalado en tu PC)
- Login manual (más seguro y confiable)
- Ves el progreso en tiempo real
- Sin costos adicionales
- Sin limitaciones de memoria o timeout

## 📋 Pasos para scrapear productos

### 1. Abrir terminal en la carpeta del proyecto

```bash
cd C:\Users\Alfredo\Desktop\bradatec-catalogo-web-sego\sego-scraper
```

### 2. Ejecutar el scraper

```bash
node scraper-local.js
```

### 3. Hacer login manualmente

- Se abrirá un navegador Chrome
- Ve a la página de login de Sego
- Inicia sesión con tus credenciales:
  - Email: bradatecsrl@gmail.com
  - Contraseña: 20608918371
- Espera a que cargue la página principal
- El script detectará automáticamente que iniciaste sesión

### 4. Esperar a que termine

El script mostrará en la consola:
```
🚀 Iniciando scraping de Sego...
🔐 Abriendo página de login de Sego...

⏸️  PAUSA: Inicia sesión manualmente en el navegador
   1. Escribe tu email y contraseña
   2. Haz clic en "Iniciar sesión"
   3. Espera a que cargue la página principal
   4. El script continuará automáticamente...

✅ Sesión iniciada manualmente detectada

🏷️  CATEGORÍA: CCTV
📦 Scrapeando página 1/20
✓ Encontrados: 24 productos (Total: 24)
📦 Scrapeando página 2/20
✓ Encontrados: 24 productos (Total: 48)
...

📊 Total productos encontrados: 1250
💾 Insertando en Supabase...
✅ SCRAPING COMPLETADO
   📦 Total encontrados: 1250
   ✓ Insertados: 1250
```

### 5. Verificar en tu tienda

- Ve a https://bradatec.netlify.app/admin
- Deberías ver todos los productos importados
- También aparecerán en la tienda pública

## ⏱️ Tiempo estimado

- Login manual: 30 segundos
- Scraping completo: 10-15 minutos
- Total: ~15 minutos

## 🔄 ¿Cuándo scrapear?

Ejecuta el scraper cuando:
- Agregues nuevos productos en Sego
- Cambien los precios
- Quieras actualizar el catálogo
- Una vez por semana/mes es suficiente

## 💡 Tip: Eliminar productos antiguos antes de scrapear

Si quieres empezar desde cero:

1. Ve a tu panel admin
2. Haz clic en "Eliminar Todos" (botón rojo)
3. Confirma la eliminación
4. Ejecuta el scraper local
5. Todos los productos se importarán frescos

## 🚫 No necesitas el servidor en línea para scrapear

El servidor de Railway/Render es útil para otras funcionalidades futuras, pero NO es necesario para importar productos. El scraper local es más confiable.

## ❓ Preguntas frecuentes

**P: ¿Puedo cerrar el navegador mientras scrapea?**
R: No, el navegador debe permanecer abierto hasta que termine.

**P: ¿Puedo usar mi computadora mientras scrapea?**
R: Sí, pero no cierres el navegador de Chrome que se abrió.

**P: ¿Se duplicarán los productos si ejecuto el scraper varias veces?**
R: No, el script verifica si el producto ya existe antes de insertarlo.

**P: ¿Qué pasa si se interrumpe el scraping?**
R: Los productos que ya se insertaron quedarán en la base de datos. Puedes ejecutar el scraper nuevamente.

**P: ¿Puedo scrapear solo algunas categorías?**
R: Sí, puedes editar `scraper-local.js` y comentar las categorías que no quieras scrapear.

## 🎯 Conclusión

El scraper local es la solución más confiable y práctica para tu caso. No necesitas complicarte con servidores en la nube para esta funcionalidad.
