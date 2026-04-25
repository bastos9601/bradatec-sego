import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Clock, Zap, Truck, CheckCircle, XCircle, ArrowLeft, ChevronDown } from 'lucide-react'

export default function MisOrdenes() {
  const [usuario, setUsuario] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    verificarUsuario()
  }, [])

  const verificarUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      navigate('/admin/login')
      return
    }

    setUsuario(user)
    obtenerPedidos(user.id)
  }

  const obtenerPedidos = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al obtener pedidos:', error)
      } else {
        setPedidos(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }

    setLoading(false)
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'procesando':
        return 'bg-blue-100 text-blue-800'
      case 'enviado':
        return 'bg-purple-100 text-purple-800'
      case 'entregado':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoEmoji = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <Clock size={18} className="text-yellow-600" />
      case 'procesando':
        return <Zap size={18} className="text-blue-600" />
      case 'enviado':
        return <Truck size={18} className="text-purple-600" />
      case 'entregado':
        return <CheckCircle size={18} className="text-green-600" />
      case 'cancelado':
        return <XCircle size={18} className="text-red-600" />
      default:
        return <ShoppingBag size={18} className="text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tus órdenes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-800">Mis Órdenes</h1>
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                Volver a la Tienda
              </button>
            </div>
            <p className="text-gray-600">Historial de tus compras</p>
          </div>

          {/* Lista de Órdenes */}
          {pedidos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="flex justify-center mb-4">
                <ShoppingBag size={64} className="text-gray-300" />
              </div>
              <p className="text-gray-600 text-lg mb-2">No tienes órdenes aún</p>
              <p className="text-gray-400 mb-6">Comienza a comprar en nuestra tienda</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Ir a la Tienda
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() => setPedidoSeleccionado(pedido)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Información principal */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          Pedido #{pedido.id.substring(0, 8)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(pedido.estado)}`}>
                          {getEstadoEmoji(pedido.estado)} {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        📅 {new Date(pedido.created_at).toLocaleDateString('es-PE')}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {pedido.moneda === 'PEN' ? 'S/' : '$'} {pedido.total.toFixed(2)}
                      </p>
                    </div>

                    {/* Flecha */}
                    <div className="text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Detalles del Pedido</h2>
              <button
                onClick={() => setPedidoSeleccionado(null)}
                className="text-white hover:text-gray-200 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Información General */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Número de Pedido</p>
                    <p className="font-bold text-gray-800">#{pedidoSeleccionado.id.substring(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className={`font-bold ${getEstadoColor(pedidoSeleccionado.estado)}`}>
                      {getEstadoEmoji(pedidoSeleccionado.estado)} {pedidoSeleccionado.estado.charAt(0).toUpperCase() + pedidoSeleccionado.estado.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-bold text-gray-800">
                      {new Date(pedidoSeleccionado.created_at).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Moneda</p>
                    <p className="font-bold text-gray-800">{pedidoSeleccionado.moneda}</p>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Productos</h3>
                <div className="space-y-3">
                  {pedidoSeleccionado.productos && pedidoSeleccionado.productos.map((prod, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      {prod.imagen && (
                        <img
                          src={prod.imagen}
                          alt={prod.nombre}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64?text=Sin+Imagen'
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{prod.nombre}</p>
                        <p className="text-sm text-gray-600">Cantidad: {prod.cantidad}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{prod.precio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información de Envío */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Información de Envío</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Nombre</p>
                  <p className="font-semibold text-gray-800 mb-4">{pedidoSeleccionado.nombre}</p>
                  
                  <p className="text-sm text-gray-600 mb-2">Dirección</p>
                  <p className="font-semibold text-gray-800 mb-4">{pedidoSeleccionado.direccion}</p>
                  
                  <p className="text-sm text-gray-600 mb-2">Celular</p>
                  <p className="font-semibold text-gray-800">{pedidoSeleccionado.celular}</p>
                </div>
              </div>

              {/* Resumen de Pago */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal (sin IGV)</span>
                    <span className="font-semibold text-gray-800">
                      {pedidoSeleccionado.moneda === 'PEN' ? 'S/' : '$'} {pedidoSeleccionado.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IGV (18%)</span>
                    <span className="font-semibold text-gray-800">
                      {pedidoSeleccionado.moneda === 'PEN' ? 'S/' : '$'} {pedidoSeleccionado.igv.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {pedidoSeleccionado.moneda === 'PEN' ? 'S/' : '$'} {pedidoSeleccionado.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón Cerrar */}
              <button
                onClick={() => setPedidoSeleccionado(null)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
