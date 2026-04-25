import { useState } from 'react'
import { supabase } from '../supabase/client'

export default function ModalCheckout({ 
  carrito, 
  moneda, 
  tipoCambio, 
  subtotalSinIGV, 
  igv, 
  total, 
  onClose, 
  onPedidoCreado 
}) {
  const [loading, setLoading] = useState(false)
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '',
    email: '',
    celular: '',
    tipoDocumento: 'DNI', // DNI o RUC
    numeroDocumento: '',
    direccion: ''
  })
  const [error, setError] = useState('')

  const simboloMoneda = moneda === 'PEN' ? 'S/' : '$'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Debes iniciar sesión para realizar un pedido')
        setLoading(false)
        return
      }

      // Preparar datos del pedido
      const pedido = {
        usuario_id: user.id,
        nombre: datosEnvio.nombre,
        email: datosEnvio.email,
        celular: datosEnvio.celular,
        tipo_documento: datosEnvio.tipoDocumento,
        numero_documento: datosEnvio.numeroDocumento,
        direccion: datosEnvio.direccion,
        productos: carrito.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
          sku: item.sku,
          imagen: item.imagen
        })),
        subtotal: subtotalSinIGV,
        igv: igv,
        total: total,
        moneda: moneda,
        estado: 'pendiente'
      }

      // Insertar pedido en la base de datos
      const { data, error: insertError } = await supabase
        .from('pedidos')
        .insert([pedido])
        .select()

      if (insertError) {
        throw insertError
      }

      console.log('Pedido creado:', data)
      
      // Notificar al admin por WhatsApp
      try {
        // Obtener el celular del admin desde la base de datos
        const { data: adminData } = await supabase
          .from('perfiles')
          .select('celular')
          .eq('rol', 'admin')
          .limit(1)
          .single()
        
        const adminWhatsApp = adminData?.celular || import.meta.env.VITE_ADMIN_WHATSAPP || '51999999999'
        
        const simboloMoneda = moneda === 'PEN' ? 'S/' : '$'
        
        let mensajeAdmin = `🛒 *NUEVO PEDIDO RECIBIDO* 🛒\n\n`
        mensajeAdmin += `📦 *Pedido #${data[0].id.substring(0, 8)}*\n`
        mensajeAdmin += `📅 ${new Date().toLocaleString('es-PE')}\n\n`
        
        mensajeAdmin += `👤 *Cliente:*\n`
        mensajeAdmin += `Nombre: ${datosEnvio.nombre}\n`
        mensajeAdmin += `Email: ${datosEnvio.email}\n`
        mensajeAdmin += `Celular: ${datosEnvio.celular}\n`
        mensajeAdmin += `${datosEnvio.tipoDocumento}: ${datosEnvio.numeroDocumento}\n`
        mensajeAdmin += `Dirección: ${datosEnvio.direccion}\n\n`
        
        mensajeAdmin += `📋 *Productos:*\n`
        carrito.forEach((prod, index) => {
          mensajeAdmin += `${index + 1}. ${prod.nombre}\n`
          mensajeAdmin += `   Cantidad: ${prod.cantidad}\n`
          mensajeAdmin += `   Precio: ${prod.precio}\n`
          // Agregar URL de la imagen
          if (prod.imagen) {
            mensajeAdmin += `   🖼️ Imagen: ${prod.imagen}\n`
          }
          mensajeAdmin += `\n`
        })
        
        mensajeAdmin += `💰 *Total: ${simboloMoneda} ${total.toFixed(2)}*\n`
        mensajeAdmin += `(Subtotal: ${simboloMoneda} ${subtotalSinIGV.toFixed(2)} + IGV: ${simboloMoneda} ${igv.toFixed(2)})\n\n`
        
        mensajeAdmin += `⚠️ *Acción requerida:* Revisaremos su pedido .`
        
        const mensajeCodificado = encodeURIComponent(mensajeAdmin)
        const urlWhatsApp = `https://wa.me/${adminWhatsApp}?text=${mensajeCodificado}`
        
        // Abrir WhatsApp en una nueva ventana
        window.open(urlWhatsApp, '_blank')
        
        console.log('Notificación de WhatsApp enviada al admin')
      } catch (notifyError) {
        console.error('Error al notificar admin:', notifyError)
        // No fallar el pedido si falla la notificación
      }
      
      // Llamar callback de éxito
      onPedidoCreado(data[0])
      
    } catch (error) {
      console.error('Error al crear pedido:', error)
      setError(`Error al crear pedido: ${error.message}`)
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-2xl font-bold">Finalizar Pedido</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Resumen del pedido */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Resumen del Pedido</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Productos:</span>
                <span className="font-semibold">{carrito.length} {carrito.length === 1 ? 'producto' : 'productos'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal (sin IGV):</span>
                <span className="font-semibold">{simboloMoneda} {subtotalSinIGV.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IGV (18%):</span>
                <span className="font-semibold">{simboloMoneda} {igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-blue-600">{simboloMoneda} {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Formulario de datos de envío */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold mb-3">Datos de Envío</h3>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={datosEnvio.nombre}
                onChange={(e) => setDatosEnvio({...datosEnvio, nombre: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email *
              </label>
              <input
                type="email"
                value={datosEnvio.email}
                onChange={(e) => setDatosEnvio({...datosEnvio, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Celular / Teléfono *
              </label>
              <input
                type="tel"
                value={datosEnvio.celular}
                onChange={(e) => setDatosEnvio({...datosEnvio, celular: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="999 999 999"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-gray-700 font-semibold mb-2">
                  Tipo de Documento *
                </label>
                <select
                  value={datosEnvio.tipoDocumento}
                  onChange={(e) => setDatosEnvio({...datosEnvio, tipoDocumento: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  {datosEnvio.tipoDocumento === 'DNI' ? 'Número de DNI' : 'Número de RUC'} *
                </label>
                <input
                  type="text"
                  value={datosEnvio.numeroDocumento}
                  onChange={(e) => setDatosEnvio({...datosEnvio, numeroDocumento: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={datosEnvio.tipoDocumento === 'DNI' ? '12345678' : '20123456789'}
                  maxLength={datosEnvio.tipoDocumento === 'DNI' ? '8' : '11'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Dirección de Envío *
              </label>
              <textarea
                value={datosEnvio.direccion}
                onChange={(e) => setDatosEnvio({...datosEnvio, direccion: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Av. Principal 123, Distrito, Ciudad"
                rows="3"
                required
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Nota:</strong> Tu pedido será revisado por nuestro equipo y nos pondremos en contacto contigo para confirmar los detalles.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Confirmar Pedido'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
