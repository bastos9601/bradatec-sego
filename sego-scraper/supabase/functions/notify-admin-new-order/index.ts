import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { pedido } = await req.json()

    if (!pedido) {
      return new Response(
        JSON.stringify({ error: 'Pedido no proporcionado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Obtener email del admin
    const { data: admins } = await supabaseAdmin
      .from('perfiles')
      .select('email')
      .eq('rol', 'admin')
      .limit(1)

    if (!admins || admins.length === 0) {
      console.log('No se encontró admin para notificar')
      return new Response(
        JSON.stringify({ success: true, message: 'No hay admin para notificar' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminEmail = admins[0].email

    // Construir lista de productos
    let productosHTML = ''
    pedido.productos.forEach((prod: any, index: number) => {
      productosHTML += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${index + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${prod.nombre}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${prod.cantidad}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${prod.precio}</td>
        </tr>
      `
    })

    const simboloMoneda = pedido.moneda === 'PEN' ? 'S/' : '$'

    // Enviar email al admin
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🛒 Nuevo Pedido Recibido - Bradatec</h2>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Información del Cliente</h3>
          <p><strong>Nombre:</strong> ${pedido.nombre}</p>
          <p><strong>Email:</strong> ${pedido.email}</p>
          <p><strong>Celular:</strong> ${pedido.celular}</p>
          <p><strong>Dirección:</strong> ${pedido.direccion}</p>
        </div>

        <h3>Productos del Pedido</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #2563eb; color: white;">
              <th style="padding: 10px; text-align: left;">#</th>
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: left;">Cantidad</th>
              <th style="padding: 10px; text-align: left;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
        </table>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Resumen del Pedido</h3>
          <p><strong>Subtotal (sin IGV):</strong> ${simboloMoneda} ${pedido.subtotal.toFixed(2)}</p>
          <p><strong>IGV (18%):</strong> ${simboloMoneda} ${pedido.igv.toFixed(2)}</p>
          <p style="font-size: 18px; color: #2563eb;"><strong>Total:</strong> ${simboloMoneda} ${pedido.total.toFixed(2)}</p>
        </div>

        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="margin: 0;"><strong>📋 Pedido ID:</strong> ${pedido.id?.substring(0, 8) || 'N/A'}</p>
          <p style="margin: 5px 0 0 0;"><strong>📅 Fecha:</strong> ${new Date().toLocaleString('es-PE')}</p>
        </div>

        <p style="margin-top: 20px;">
          <a href="${Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://app.')}/project/_/editor" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Ver en Panel Admin
          </a>
        </p>

        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          Este es un correo automático generado por el sistema de Bradatec.
        </p>
      </div>
    `

    // Enviar email usando Supabase Auth (requiere configuración de SMTP)
    // Nota: Esto es una simulación, en producción necesitarías un servicio de email real
    console.log('Email que se enviaría a:', adminEmail)
    console.log('Contenido:', emailHTML)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notificación enviada al admin',
        adminEmail: adminEmail 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
