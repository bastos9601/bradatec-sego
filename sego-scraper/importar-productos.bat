@echo off
echo ========================================
echo   IMPORTAR PRODUCTOS DE SEGO
echo ========================================
echo.
echo Este script abrira un navegador Chrome
echo donde podras iniciar sesion manualmente
echo en Sego y scrapear todos los productos.
echo.
echo Presiona cualquier tecla para continuar...
pause > nul

cd /d "%~dp0"
node scraper-local.js

echo.
echo ========================================
echo   SCRAPING COMPLETADO
echo ========================================
echo.
echo Los productos han sido importados a tu base de datos.
echo Puedes verificarlos en: https://bradatec.netlify.app/admin
echo.
pause
