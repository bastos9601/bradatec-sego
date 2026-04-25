@echo off
echo ========================================
echo   DESPLEGAR CAMPOS DNI/RUC EN PEDIDOS
echo ========================================
echo.

echo [1/5] Agregando archivos modificados...
git add .

echo.
echo [2/5] Creando commit...
git commit -m "Feature: Agregar campos DNI/RUC en formulario de pedidos"

echo.
echo [3/5] Subiendo cambios a GitHub...
git push

echo.
echo [4/5] Aplicar migracion SQL en Supabase
echo.
echo IMPORTANTE: Debes aplicar la migracion SQL manualmente:
echo.
echo 1. Ve a Supabase Dashboard: https://supabase.com/dashboard
echo 2. Selecciona tu proyecto
echo 3. SQL Editor - New Query
echo 4. Copia el contenido de: supabase/migration-add-documento-pedidos.sql
echo 5. Presiona Run
echo.
echo O usa Supabase CLI:
echo   cd sego-scraper
echo   supabase db push
echo.

echo [5/5] Netlify detectara los cambios y redesplegar automaticamente
echo.
echo ========================================
echo   DESPLIEGUE COMPLETADO
echo ========================================
echo.
echo CAMBIOS APLICADOS:
echo - Agregado selector de tipo de documento (DNI/RUC)
echo - Agregado campo de numero de documento
echo - Actualizado mensaje de WhatsApp con DNI/RUC
echo - Creada migracion SQL para agregar columnas
echo.
echo PROXIMO PASO:
echo 1. Aplicar migracion SQL en Supabase
echo 2. Esperar 2-3 minutos a que Netlify redespliegue
echo 3. Abrir tienda y hacer un pedido
echo 4. Verificar que aparecen los campos DNI/RUC
echo 5. Confirmar pedido y verificar en WhatsApp
echo.
pause
