@echo off
echo ========================================
echo   DESPLEGAR FIX DE SESIONES
echo ========================================
echo.

echo [1/4] Agregando archivos modificados...
git add .

echo.
echo [2/4] Creando commit...
git commit -m "Fix: Corregir deteccion de productos con sesiones guardadas - Agregar esperas y screenshots debug"

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
echo IMPORTANTE:
echo 1. Aplicar migracion SQL en Supabase (ver APLICAR-MIGRACION-SESIONES.md)
echo 2. Esperar 2-3 minutos a que Railway redespliegue
echo 3. Probar conectando cuenta de Sego en el panel admin
echo 4. Verificar logs en Railway para confirmar que funciona
echo.
pause
