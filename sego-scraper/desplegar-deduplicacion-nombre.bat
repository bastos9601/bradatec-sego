@echo off
echo ========================================
echo   DESPLEGAR DEDUPLICACION POR NOMBRE
echo ========================================
echo.

echo [1/4] Agregando archivos modificados...
git add .

echo.
echo [2/4] Creando commit...
git commit -m "Improve: Deduplicacion por nombre en lugar de SKU - Soportar multiples SKUs por producto"

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
echo - Usar NOMBRE como identificador unico (no SKU)
echo - Soportar multiples SKUs por producto
echo - Deduplicacion correcta por nombre
echo - Mostrar variantes encontradas
echo.
echo PROXIMO PASO:
echo 1. Esperar 2-3 minutos a que Railway redespliegue
echo 2. Conectar cuenta de Sego en el panel admin
echo 3. Importar productos
echo 4. Verificar logs en Railway
echo.
echo LOGS ESPERADOS:
echo - "Total encontrados: 1044"
echo - "Productos unicos (por nombre): 679"
echo - "Duplicados descartados: 365"
echo - "Insertados/Actualizados en BD: 679"
echo.
pause
