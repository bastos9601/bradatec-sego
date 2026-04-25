@echo off
echo ========================================
echo   DESPLEGAR ANALISIS DE DUPLICADOS
echo ========================================
echo.

echo [1/4] Agregando archivos modificados...
git add .

echo.
echo [2/4] Creando commit...
git commit -m "Improve: Mejor analisis de duplicados - Generar SKU automatico, mostrar detalles"

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
echo - Generar SKU automatico para productos sin SKU
echo - Detectar duplicados antes de insertar
echo - Mostrar analisis detallado de productos
echo - Mostrar lista de duplicados encontrados
echo.
echo PROXIMO PASO:
echo 1. Esperar 2-3 minutos a que Railway redespliegue
echo 2. Conectar cuenta de Sego en el panel admin
echo 3. Importar productos
echo 4. Verificar logs en Railway
echo.
echo LOGS ESPERADOS:
echo - "Total encontrados: 1044"
echo - "Productos unicos: 679"
echo - "Duplicados descartados: 365"
echo - "Insertados/Actualizados en BD: 679"
echo.
pause
