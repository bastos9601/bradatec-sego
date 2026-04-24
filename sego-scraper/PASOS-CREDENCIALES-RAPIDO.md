# ⚡ Configurar Credenciales de Sego - Guía Rápida

## 🎯 3 Pasos Simples

### PASO 1: Ir a Supabase Secrets

1. https://supabase.com
2. Tu proyecto
3. **Edge Functions** > **scrape_productos** > **Settings**
4. Sección **Secrets**

### PASO 2: Agregar 2 Secretos

**Secreto 1:**
- Name: `SEGO_USERNAME`
- Value: tu email de Sego

**Secreto 2:**
- Name: `SEGO_PASSWORD`
- Value: tu contraseña de Sego

### PASO 3: Redesplegar

```bash
cd sego-scraper
npx supabase functions deploy scrape_productos
```

---

## ✅ Verificar

Ve a http://localhost:5173/admin y haz clic en "Actualizar Productos"

En Supabase Logs deberías ver:
```
Login exitoso, sesión iniciada
Productos encontrados: X
```

---

## 📸 Capturas de Referencia

### Dónde están los Secrets:

```
Supabase Dashboard
└── Edge Functions
    └── scrape_productos
        └── Settings (pestaña)
            └── Secrets (sección)
                └── [Add Secret] (botón)
```

### Cómo se ven los Secrets:

```
Name: SEGO_USERNAME
Value: [tu_email@gmail.com]
[Save]

Name: SEGO_PASSWORD  
Value: [tu_contraseña]
[Save]
```

---

## 🚀 ¡Listo!

Ahora tu sistema scrapeará productos REALES de Sego con precios actualizados.

Si no tienes credenciales de Sego, el sistema usará el catálogo de ejemplo automáticamente.
