@echo off
echo ========================================
echo   DESPLEGAR EDGE FUNCTION - SEGO SCRAPER
echo ========================================
echo.

echo [1/4] Verificando archivos...
if not exist "supabase\functions\scrape_productos\index.ts" (
    echo ERROR: No se encuentra el archivo index.ts
    echo Asegurate de estar en la carpeta sego-scraper
    pause
    exit /b 1
)
echo OK - Archivo encontrado
echo.

echo [2/4] Iniciando sesion en Supabase...
echo Se abrira tu navegador para autorizar...
npx supabase login
if errorlevel 1 (
    echo ERROR: Fallo el login
    pause
    exit /b 1
)
echo.

echo [3/4] Vinculando proyecto...
set /p PROJECT_REF="Ingresa tu Project Reference ID: "
npx supabase link --project-ref %PROJECT_REF%
if errorlevel 1 (
    echo ERROR: Fallo al vincular proyecto
    pause
    exit /b 1
)
echo.

echo [4/4] Desplegando funcion...
npx supabase functions deploy scrape_productos
if errorlevel 1 (
    echo ERROR: Fallo el despliegue
    pause
    exit /b 1
)
echo.

echo ========================================
echo   DESPLIEGUE EXITOSO!
echo ========================================
echo.
echo Ahora puedes ejecutar: npm run dev
echo.
pause
