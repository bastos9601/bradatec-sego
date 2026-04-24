@echo off
echo ========================================
echo   DESPLEGAR FIX DE DUPLICADOS
echo ========================================
echo.

echo [1/4] Agregando archivos modificados...
git add .

echo.
echo [2/4] Creando commit...
git commit -m "Fix: Mejor insercion de productos - Usar ID unico, insertar en lotes"

echo.
echo [3/4] Subiendo cambios a GitHub...
git push

echo.
echo [4/4] Railway detectara los cambios y redesplegar automaticamente
echo.
echo ========================================
echo   DESPLIEGUE COMPLETADO
echo ========================================
echo.
echo CAMBIOS APLICADOS:
echo - Generar ID unico para cada producto (nombre + precio)
echo - Insertar en lotes de 100 productos
echo - Mejor manejo de errores
echo - Logs mas detallados
echo.
echo PROXIMO PASO:
echo 1. Esperar 2-3 minutos a que Railway redespliegue
echo 2. Conectar cuenta de Sego en el panel admin
echo 3. Importar productos
echo 4. Verificar logs en Railway
echo.
echo LOGS ESPERADOS:
echo - "Insertando lote 1/20 (100 productos)..."
echo - "Lote 1 insertado correctamente"
echo - "SCRAPING COMPLETADO"
echo - "Insertados/Actualizados: 1944"
echo.
pause
