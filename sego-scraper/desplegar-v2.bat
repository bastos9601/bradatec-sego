@echo off
echo ========================================
echo   DESPLEGAR MEJORAS DE SESIONES V2
echo ========================================
echo.

echo [1/4] Agregando archivos modificados...
git add .

echo.
echo [2/4] Creando commit...
git commit -m "Improve: Mejor manejo de sesiones persistentes - Validar cookies, permitir recursos, mejor error handling"

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
echo - Mejor validacion de sesiones (verifica si hay productos)
echo - Permitir recursos (CSS/JS) cuando se usan sesiones guardadas
echo - Mejor error handling al guardar cookies
echo - Fallback automatico a login si sesion no funciona
echo.
echo PROXIMO PASO:
echo 1. Esperar 2-3 minutos a que Railway redespliegue
echo 2. Probar conectando cuenta de Sego en el panel admin
echo 3. Importar productos
echo 4. Verificar logs en Railway
echo.
echo LOGS ESPERADOS:
echo - "Sesion valida, productos detectados correctamente"
echo - O "Sesion no valida, haciendo login nuevamente"
echo.
pause
