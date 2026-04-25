@echo off
echo ========================================
echo   DESPLEGAR CONVERSION DE PRECIOS
echo ========================================
echo.

echo [1/4] Agregando archivos modificados...
git add .

echo.
echo [2/4] Creando commit...
git commit -m "Feature: Conversion automatica de precios USD a PEN"

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
echo - Integracion de API de cambio de divisas
echo - Conversion automatica USD a PEN durante scraping
echo - Cache de tipo de cambio (1 hora)
echo - Fallback a valor por defecto si falla API
echo - Endpoint GET /api/tipo-cambio
echo.
echo PROXIMO PASO:
echo 1. Esperar 2-3 minutos a que Railway redespliegue
echo 2. Conectar cuenta de Sego en el panel admin
echo 3. Importar productos
echo 4. Verificar logs en Railway
echo.
echo LOGS ESPERADOS:
echo - "Obteniendo tipo de cambio USD a PEN..."
echo - "Tipo de cambio actualizado: 1 USD = 3.85 PEN"
echo - Precios convertidos a S/ (Soles Peruanos)
echo.
echo VERIFICAR EN SUPABASE:
echo - Tabla productos debe tener precios en S/
echo - Ejemplo: "S/ 1150.15" en lugar de "$ 299.00"
echo.
pause
