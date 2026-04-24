@echo off
echo ========================================
echo   DESPLEGAR SOLUCION FINAL SKU
echo ========================================
echo.

echo [1/5] Agregando archivos modificados...
git add .

echo.
echo [2/5] Creando commit...
git commit -m "Fix: Usar SKU como unique constraint, generar SKU si esta vacio"

echo.
echo [3/5] Subiendo cambios a GitHub...
git push

echo.
echo [4/5] Railway detectara los cambios y redesplegar automaticamente
echo.
echo ========================================
echo   DESPLIEGUE COMPLETADO
echo ========================================
echo.
echo IMPORTANTE - PASOS OBLIGATORIOS:
echo.
echo 1. CREAR INDICE EN SUPABASE (OBLIGATORIO)
echo    - Ve a Supabase Dashboard
echo    - SQL Editor -> New Query
echo    - Ejecuta:
echo    CREATE UNIQUE INDEX IF NOT EXISTS productos_sku_unique ON productos (sku);
echo.
echo 2. ESPERAR A QUE RAILWAY REDESPLIEGUE (2-3 minutos)
echo.
echo 3. PROBAR IMPORTACION
echo    - Panel Admin -> Conectar Cuenta de Sego
echo    - Panel Admin -> Importar Productos Sego
echo    - Verificar logs en Railway
echo.
echo LOGS ESPERADOS:
echo - "Productos con SKU valido: 1944/1944"
echo - "Lote 1 insertado correctamente (100 productos)"
echo - "SCRAPING COMPLETADO"
echo - "Insertados/Actualizados: 1944"
echo.
echo CAMBIOS APLICADOS:
echo - Generar SKU si esta vacio (basado en nombre)
echo - Usar onConflict: 'sku' en lugar de 'id'
echo - Filtrar productos con SKU valido
echo - Mejor manejo de errores
echo.
pause
