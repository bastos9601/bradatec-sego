# 🔍 Verificar si los Secrets están Configurados

## Paso 1: Ver la pestaña "Registros" (Logs)

1. En Supabase, ve a **Edge Functions** > **scrape_productos**
2. Haz clic en la pestaña **"Registros"** (NO "Invocaciones")
3. Busca mensajes que digan:
   ```
   SEGO_USERNAME configurado: SÍ o NO
   SEGO_PASSWORD configurado: SÍ o NO
   ```

## Paso 2: Ver la pestaña "Ajustes" (Settings)

1. En la misma página, haz clic en **"Ajustes"** o **"Settings"**
2. Busca la sección **"Secrets"** o **"Variables de entorno"**
3. ¿Ves estos dos secrets?
   - `SEGO_USERNAME`
   - `SEGO_PASSWORD`

## Si NO ves los secrets:

### Agregarlos AHORA:

1. Haz clic en **"Agregar secreto"** o **"Add Secret"**
2. Primer secret:
   - Nombre: `SEGO_USERNAME`
   - Valor: [tu_email_de_sego@gmail.com]
   - Guardar
3. Segundo secret:
   - Nombre: `SEGO_PASSWORD`
   - Valor: [tu_contraseña_de_sego]
   - Guardar

### Redesplegar:

```bash
cd sego-scraper
npx supabase functions deploy scrape_productos
```

Espera 1-2 minutos y prueba nuevamente.

## Si SÍ ves los secrets pero sigue sin funcionar:

### Opción 1: Redesplegar forzado

```bash
cd sego-scraper
npx supabase functions deploy scrape_productos --no-verify-jwt
```

### Opción 2: Verificar que los valores sean correctos

1. Elimina los secrets existentes
2. Créalos nuevamente con los valores correctos
3. Redesplega

### Opción 3: Probar login manual

Ve a https://www.sego.com.pe/mi-cuenta/ y verifica que:
- Tu email y contraseña funcionen
- Puedas ver productos con precios

## Checklist de Verificación:

- [ ] Los secrets están en Settings > Secrets
- [ ] Los nombres son exactamente: `SEGO_USERNAME` y `SEGO_PASSWORD`
- [ ] Los valores son tu email y contraseña de Sego
- [ ] Redesplegaste la función después de agregar los secrets
- [ ] Esperaste 1-2 minutos después de redesplegar
- [ ] Los logs muestran "SEGO_USERNAME configurado: SÍ"

## Ubicación de los Secrets en Supabase:

```
Dashboard de Supabase
│
└── Edge Functions (menú lateral izquierdo)
    └── scrape_productos (haz clic)
        └── Settings (pestaña superior)
            └── Secrets (sección en la página)
                └── [Add Secret] (botón)
```

## Si todo falla:

Envíame una captura de pantalla de:
1. La pestaña "Settings" > sección "Secrets"
2. La pestaña "Registros" con los logs más recientes

Así podré ver exactamente qué está pasando.
