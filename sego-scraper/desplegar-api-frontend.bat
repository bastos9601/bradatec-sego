@echo off
echo ========================================
echo   DESPLEGAR API DE CAMBIO EN FRONTEND
echo ========================================
echo.

echo [1/4] Agregando archivos modificados...
git add .

echo.
echo [2/4] Creando commit...
git commit -m "Feature: Mover API de cambio de moneda al frontend - Accesible para todos los usuarios"

echo.
echo [3/4] Subiendo cambios a GitHub...
git push

echo.
echo [4/4] Netlify detectara los cambios y redesplegar automaticamente
echo.
echo ========================================
echo   DESPLIEGUE COMPLETADO
echo ========================================
echo.
echo CAMBIOS APLICADOS:
echo - Creado src/config/api.js con API key publica
echo - Removida API key del .env
echo - Removida funcion obtenerTipoCambio del backend
echo - Removido endpoint GET /api/tipo-cambio
echo - Actualizado Tienda.jsx para usar API del frontend
echo.
echo VENTAJAS:
echo - Todos los usuarios pueden cambiar moneda
echo - No requiere estar logueado
echo - Funciona mas rapido
echo - Reduce carga en servidor
echo.
echo PROXIMO PASO:
echo 1. Esperar 2-3 minutos a que Netlify redespliegue
echo 2. Abrir tienda sin estar logueado
echo 3. Presionar botones USD/PEN
echo 4. Verificar que funciona correctamente
echo.
pause
