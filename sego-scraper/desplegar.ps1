# Script para desplegar Edge Function de Supabase
# Uso: .\desplegar.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DESPLEGAR EDGE FUNCTION - SEGO SCRAPER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la carpeta correcta
Write-Host "[1/5] Verificando ubicacion..." -ForegroundColor Yellow
if (-not (Test-Path "supabase\functions\scrape_productos\index.ts")) {
    Write-Host "ERROR: No se encuentra el archivo index.ts" -ForegroundColor Red
    Write-Host "Asegurate de estar en la carpeta sego-scraper" -ForegroundColor Red
    Write-Host "Ejecuta: cd sego-scraper" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "OK - Ubicacion correcta" -ForegroundColor Green
Write-Host ""

# Verificar archivos
Write-Host "[2/5] Verificando archivos..." -ForegroundColor Yellow
$files = @(
    "supabase\functions\scrape_productos\index.ts",
    "supabase\schema.sql",
    ".env"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  OK - $file" -ForegroundColor Green
    } else {
        Write-Host "  FALTA - $file" -ForegroundColor Yellow
    }
}
Write-Host ""

# Login
Write-Host "[3/5] Iniciando sesion en Supabase..." -ForegroundColor Yellow
Write-Host "Se abrira tu navegador para autorizar..." -ForegroundColor Cyan
npx supabase login
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Fallo el login" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "OK - Login exitoso" -ForegroundColor Green
Write-Host ""

# Vincular proyecto
Write-Host "[4/5] Vinculando proyecto..." -ForegroundColor Yellow
Write-Host "Obtén tu Project Reference ID de:" -ForegroundColor Cyan
Write-Host "  https://supabase.com > Tu Proyecto > Settings > General" -ForegroundColor Cyan
Write-Host ""
$projectRef = Read-Host "Ingresa tu Project Reference ID"

if ([string]::IsNullOrWhiteSpace($projectRef)) {
    Write-Host "ERROR: Debes ingresar un Project Reference ID" -ForegroundColor Red
    pause
    exit 1
}

npx supabase link --project-ref $projectRef
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Fallo al vincular proyecto" -ForegroundColor Red
    Write-Host "Verifica que el Reference ID sea correcto" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "OK - Proyecto vinculado" -ForegroundColor Green
Write-Host ""

# Desplegar
Write-Host "[5/5] Desplegando funcion..." -ForegroundColor Yellow
npx supabase functions deploy scrape_productos
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Fallo el despliegue" -ForegroundColor Red
    pause
    exit 1
}
Write-Host ""

# Verificar
Write-Host "Verificando despliegue..." -ForegroundColor Yellow
npx supabase functions list
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  DESPLIEGUE EXITOSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Verifica tu archivo .env" -ForegroundColor White
Write-Host "  2. Ejecuta: npm run dev" -ForegroundColor White
Write-Host "  3. Abre: http://localhost:5173" -ForegroundColor White
Write-Host ""
pause
