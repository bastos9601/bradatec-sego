-- ========================================
-- SOLUCIÓN RÁPIDA: Crear Admin
-- ========================================
-- Ejecuta esto en SQL Editor de Supabase
-- Reemplaza 'bradatecrl@gmail.com' con tu email

-- PASO 1: Ver tu usuario
SELECT 
  id as "UUID (copia esto)", 
  email, 
  created_at 
FROM auth.users;

-- PASO 2: Crear perfil de admin automáticamente
-- (Reemplaza el email con el tuyo)
INSERT INTO perfiles (id, rol)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'bradatecrl@gmail.com'
ON CONFLICT (id) DO UPDATE SET rol = 'admin';

-- PASO 3: Verificar que funcionó
SELECT 
  u.email as "Email",
  p.rol as "Rol",
  CASE 
    WHEN p.rol = 'admin' THEN '✅ LISTO'
    ELSE '❌ FALTA'
  END as "Estado"
FROM auth.users u
LEFT JOIN perfiles p ON u.id = p.id;

-- Si ves "✅ LISTO", ya puedes usar el scraping
-- Si ves "❌ FALTA", ejecuta el PASO 2 nuevamente
