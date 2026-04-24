import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'
import Navbar from '../componentes/Navbar'

export default function Admin() {
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState('')
  const [productos, setProductos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    imagen: ''
  })
  const [vistaActual, setVistaActual] = useState('productos')
  const [usuarios, setUsuarios] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [datosEdicion, setDatosEdicion] = useState({
    nombre: '',
    email: '',
    celular: '',
    password: ''
  })
  const [mostrarModalPorcentaje, setMostrarModalPorcentaje] = useState(false)
  const [porcentajeAjuste, setPorcentajeAjuste] = useState(15)
  const [pedidoDetalle, setPedidoDetalle] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    verificarAdmin()
    obtenerProductos()
    obtenerUsuarios()
    obtenerPedidos()
  }, [])

  const verificarAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/admin/login')
      return
    }

    const { data } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (!data || data.rol !== 'admin') {
      navigate('/')
    }
  }

  const obtenerProductos = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false })
    setProductos(data || [])
  }

  const obtenerUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('id, rol, nombre, celular, email, created_at')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error al obtener usuarios:', error)
        return
      }

      setUsuarios(data || [])
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
    }
  }

  const obtenerPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error al obtener pedidos:', error)
        return
      }

      setPedidos(data || [])
    } catch (error) {
      console.error('Error al obtener pedidos:', error)
    }
  }

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado })
        .eq('id', pedidoId)

      if (error) {
        throw error
      }

      setMensaje(`✓ Estado actualizado a "${nuevoEstado}"`)
      setTipo('success')
      obtenerPedidos()
      
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      setMensaje(`✗ Error al actualizar estado: ${error.message}`)
      setTipo('error')
    }
  }

  const enviarWhatsApp = (pedido) => {
    // Limpiar el número de teléfono (quitar espacios, guiones, etc.)
    const celularLimpio = pedido.celular.replace(/\D/g, '')
    
    // Construir el mensaje
    let mensaje = `¡Hola ${pedido.nombre}! 👋\n\n`
    mensaje += `Te escribimos de *Bradatec* para informarte sobre tu pedido:\n\n`
    mensaje += `📦 *Pedido #${pedido.id.substring(0, 8)}*\n`
    mensaje += `📅 Fecha: ${new Date(pedido.created_at).toLocaleDateString('es-PE')}\n`
    mensaje += `📍 Estado: *${pedido.estado.toUpperCase()}*\n\n`
    
    mensaje += `*Productos:*\n`
    pedido.productos.forEach((prod, index) => {
      mensaje += `${index + 1}. ${prod.nombre}\n`
      mensaje += `   Cantidad: ${prod.cantidad}\n`
      mensaje += `   Precio: ${prod.precio}\n`
      // Agregar URL de la imagen si existe
      if (prod.imagen) {
        mensaje += `   🖼️ Ver imagen: ${prod.imagen}\n`
      }
      mensaje += `\n`
    })
    
    mensaje += `💰 *Resumen:*\n`
    mensaje += `Subtotal (sin IGV): ${pedido.moneda === 'PEN' ? 'S/' : '$'} ${pedido.subtotal.toFixed(2)}\n`
    mensaje += `IGV (18%): ${pedido.moneda === 'PEN' ? 'S/' : '$'} ${pedido.igv.toFixed(2)}\n`
    mensaje += `*Total: ${pedido.moneda === 'PEN' ? 'S/' : '$'} ${pedido.total.toFixed(2)}*\n\n`
    
    mensaje += `📍 *Dirección de envío:*\n${pedido.direccion}\n\n`
    
    // Mensaje según el estado
    if (pedido.estado === 'procesando') {
      mensaje += `✅ Tu pedido está siendo procesado. Te contactaremos pronto para confirmar los detalles.`
    } else if (pedido.estado === 'enviado') {
      mensaje += `🚚 Tu pedido ha sido enviado y está en camino.`
    } else if (pedido.estado === 'entregado') {
      mensaje += `✨ Tu pedido ha sido entregado. ¡Gracias por tu compra!`
    } else if (pedido.estado === 'cancelado') {
      mensaje += `❌ Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.`
    } else {
      mensaje += `📋 Tu pedido está pendiente de confirmación.`
    }
    
    mensaje += `\n\n¡Gracias por confiar en nosotros! 🙏`
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje)
    
    // Abrir WhatsApp Web o App
    const urlWhatsApp = `https://wa.me/${celularLimpio}?text=${mensajeCodificado}`
    window.open(urlWhatsApp, '_blank')
  }

  const eliminarPedido = async (pedidoId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', pedidoId)

      if (error) {
        throw error
      }

      setMensaje('✓ Pedido eliminado correctamente')
      setTipo('success')
      obtenerPedidos()
      
      // Si el modal de detalles está abierto con este pedido, cerrarlo
      if (pedidoDetalle && pedidoDetalle.id === pedidoId) {
        setPedidoDetalle(null)
      }
      
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      console.error('Error al eliminar pedido:', error)
      setMensaje(`✗ Error al eliminar pedido: ${error.message}`)
      setTipo('error')
    }
  }

  const actualizarRolUsuario = async (usuarioId, nuevoRol) => {
    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ rol: nuevoRol })
        .eq('id', usuarioId)

      if (error) {
        throw error
      }

      setMensaje(`✓ Rol actualizado a "${nuevoRol}" correctamente`)
      setTipo('success')
      obtenerUsuarios()
      
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      console.error('Error al actualizar rol:', error)
      setMensaje(`✗ Error al actualizar rol: ${error.message}`)
      setTipo('error')
    }
  }

  const eliminarUsuario = async (usuarioId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('perfiles')
        .delete()
        .eq('id', usuarioId)

      if (error) {
        throw error
      }

      setMensaje('✓ Usuario eliminado correctamente')
      setTipo('success')
      obtenerUsuarios()
      
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      setMensaje(`✗ Error al eliminar usuario: ${error.message}`)
      setTipo('error')
    }
  }

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditando(usuario)
    setDatosEdicion({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      celular: usuario.celular || '',
      password: ''
    })
  }

  const cerrarModalEdicion = () => {
    setUsuarioEditando(null)
    setDatosEdicion({
      nombre: '',
      email: '',
      celular: '',
      password: ''
    })
  }

  const guardarEdicionUsuario = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    try {
      // Actualizar nombre, celular y email en perfiles
      const perfilUpdates = {}
      if (datosEdicion.nombre) perfilUpdates.nombre = datosEdicion.nombre
      if (datosEdicion.celular !== undefined) perfilUpdates.celular = datosEdicion.celular
      if (datosEdicion.email) perfilUpdates.email = datosEdicion.email

      if (Object.keys(perfilUpdates).length > 0) {
        const { error: perfilError } = await supabase
          .from('perfiles')
          .update(perfilUpdates)
          .eq('id', usuarioEditando.id)

        if (perfilError) {
          throw perfilError
        }
      }

      setMensaje('✓ Usuario actualizado correctamente')
      setTipo('success')
      
      cerrarModalEdicion()
      obtenerUsuarios()
      
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      setMensaje(`✗ Error al actualizar usuario: ${error.message}`)
      setTipo('error')
    }

    setLoading(false)
  }

  const eliminarTodosProductos = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar TODOS los productos? Esta acción no se puede deshacer.')) {
      return
    }

    setLoading(true)
    setMensaje('')

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (error) {
        throw error
      }

      setMensaje('✓ Todos los productos han sido eliminados')
      setTipo('success')
      obtenerProductos()
    } catch (error) {
      console.error('Error al eliminar productos:', error)
      setMensaje(`✗ Error al eliminar: ${error.message}`)
      setTipo('error')
    }

    setLoading(false)
  }

  const ajustarPreciosPorcentaje = async () => {
    if (!confirm(`¿Estás seguro de que quieres ajustar TODOS los precios en ${porcentajeAjuste > 0 ? '+' : ''}${porcentajeAjuste}%?`)) {
      return
    }

    setLoading(true)
    setMensaje('Ajustando precios...')

    try {
      let productosActualizados = 0
      let errores = 0

      for (const producto of productos) {
        try {
          // Extraer el precio numérico del string
          const extraerPrecio = (precioStr) => {
            if (!precioStr) return 0
            const match = precioStr.match(/[\d,]+\.?\d*/)
            if (match) {
              return parseFloat(match[0].replace(',', ''))
            }
            return 0
          }

          const precioActual = extraerPrecio(producto.precio)
          if (precioActual === 0) {
            console.log(`Producto ${producto.id} tiene precio inválido: ${producto.precio}`)
            errores++
            continue
          }

          // Calcular nuevo precio con el porcentaje
          const factorAjuste = 1 + (porcentajeAjuste / 100)
          const nuevoPrecio = precioActual * factorAjuste

          // Mantener el formato original ($ o S/)
          const simbolo = producto.precio.includes('S/') ? 'S/' : '$'
          const nuevoPrecioFormateado = `${simbolo} ${nuevoPrecio.toFixed(2)}`

          // Actualizar en la base de datos
          const { error } = await supabase
            .from('productos')
            .update({ precio: nuevoPrecioFormateado })
            .eq('id', producto.id)

          if (error) {
            console.error(`Error al actualizar producto ${producto.id}:`, error)
            errores++
          } else {
            productosActualizados++
          }
        } catch (error) {
          console.error(`Error procesando producto ${producto.id}:`, error)
          errores++
        }
      }

      if (errores > 0) {
        setMensaje(`✓ Precios ajustados: ${productosActualizados} productos actualizados, ${errores} errores`)
        setTipo('success')
      } else {
        setMensaje(`✓ Todos los precios han sido ajustados exitosamente (${productosActualizados} productos)`)
        setTipo('success')
      }

      setMostrarModalPorcentaje(false)
      obtenerProductos()
    } catch (error) {
      console.error('Error al ajustar precios:', error)
      setMensaje(`✗ Error al ajustar precios: ${error.message}`)
      setTipo('error')
    }

    setLoading(false)
  }

  const eliminarProducto = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setMensaje('✓ Producto eliminado correctamente')
      setTipo('success')
      obtenerProductos()
      
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      setMensaje(`✗ Error al eliminar: ${error.message}`)
      setTipo('error')
    }
  }

  const agregarProductoManual = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    try {
      const { error } = await supabase
        .from('productos')
        .insert([{
          nombre: nuevoProducto.nombre,
          precio: nuevoProducto.precio,
          imagen: nuevoProducto.imagen || 'https://via.placeholder.com/300x200?text=Producto+Sego'
        }])

      if (error) {
        throw error
      }

      setMensaje('✓ Producto agregado correctamente')
      setTipo('success')
      setNuevoProducto({ nombre: '', precio: '', imagen: '' })
      setMostrarFormulario(false)
      obtenerProductos()
    } catch (error) {
      console.error('Error al agregar producto:', error)
      setMensaje(`✗ Error al agregar: ${error.message}`)
      setTipo('error')
    }

    setLoading(false)
  }

  const importarProductosSego = async () => {
    setLoading(true);
    setMensaje('Iniciando scraping de Sego...');

    try {
      const response = await fetch('http://localhost:3001/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setMensaje('✓ Scraping iniciado. Los productos se están importando en segundo plano...');
        setTipo('success');
        
        const intervalo = setInterval(async () => {
          try {
            const progresoResponse = await fetch('http://localhost:3001/api/scrape/progreso');
            const progresoData = await progresoResponse.json();
            
            if (progresoData.enProgreso) {
              const { progreso } = progresoData;
              setMensaje(
                `🔄 Scraping en progreso...\n` +
                `Categoría: ${progreso.categoriaActual}\n` +
                `Página: ${progreso.paginaActual}/${progreso.totalPaginas}\n` +
                `Productos encontrados: ${progreso.productosEncontrados}\n` +
                `Productos insertados: ${progreso.productosInsertados}`
              );
            } else {
              clearInterval(intervalo);
              setMensaje(`✓ Scraping completado: ${progresoData.progreso.productosInsertados} productos insertados`);
              setTipo('success');
              setLoading(false);
              obtenerProductos();
            }
          } catch (error) {
            console.error('Error obteniendo progreso:', error);
          }
        }, 2000);
        
      } else {
        setMensaje(`✗ Error: ${result.error || 'Error desconocido'}`);
        setTipo('error');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al iniciar scraping:', error);
      setMensaje(`✗ Error de conexión: ${error.message}`);
      setTipo('error');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Panel de Administración
        </h2>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setVistaActual('productos')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                vistaActual === 'productos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📦 Productos ({productos.length})
            </button>
            <button
              onClick={() => setVistaActual('usuarios')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                vistaActual === 'usuarios'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              👥 Usuarios ({usuarios.length})
            </button>
            <button
              onClick={() => setVistaActual('pedidos')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                vistaActual === 'pedidos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🛒 Pedidos ({pedidos.length})
            </button>
          </div>
        </div>

        {mensaje && (
          <div className={`mb-6 p-4 rounded-lg whitespace-pre-line ${
            tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {mensaje}
          </div>
        )}
        {vistaActual === 'productos' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Gestionar Productos</h3>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Recomendado:</strong> Usa "Importar Productos" para agregar productos reales de Sego.
                </p>
              </div>
              
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={importarProductosSego}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Importando...' : '📦 Importar Productos Sego'}
                </button>

                <button
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  ➕ Agregar Manual
                </button>

                <button
                  onClick={() => setMostrarModalPorcentaje(true)}
                  disabled={loading || productos.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
                  title="Ajustar precios de todos los productos"
                >
                  💰 Ajustar Precios
                </button>

                <button
                  onClick={eliminarTodosProductos}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
                >
                  🗑️ Eliminar Todos
                </button>
              </div>
            </div>

            {mostrarFormulario && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Agregar Producto Manualmente</h3>
                <form onSubmit={agregarProductoManual} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nombre del Producto</label>
                    <input
                      type="text"
                      value={nuevoProducto.nombre}
                      onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Cámara de Seguridad HD 1080p"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Precio</label>
                    <input
                      type="text"
                      value={nuevoProducto.precio}
                      onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: S/ 299.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">URL de Imagen (opcional)</label>
                    <input
                      type="text"
                      value={nuevoProducto.imagen}
                      onChange={(e) => setNuevoProducto({...nuevoProducto, imagen: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                    >
                      Guardar Producto
                    </button>
                    <button
                      type="button"
                      onClick={() => setMostrarFormulario(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Estadísticas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600">Total Productos</p>
                  <p className="text-3xl font-bold text-blue-600">{productos.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600">Última Actualización</p>
                  <p className="text-sm font-semibold text-green-600">
                    {productos[0] ? new Date(productos[0].created_at).toLocaleString('es-PE') : 'N/A'}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-600">Estado</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {loading ? 'Actualizando...' : 'Activo'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                Lista de Productos ({productos.length})
              </h3>
              
              {productos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay productos para mostrar</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Imagen</th>
                        <th className="text-left py-3 px-4">Nombre</th>
                        <th className="text-left py-3 px-4">Precio</th>
                        <th className="text-left py-3 px-4">Fecha</th>
                        <th className="text-center py-3 px-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((producto) => (
                        <tr key={producto.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <img
                              src={producto.imagen}
                              alt={producto.nombre}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64?text=Sin+Imagen'
                              }}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-800">{producto.nombre}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-blue-600 font-semibold">{producto.precio}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-500">
                              {new Date(producto.created_at).toLocaleDateString('es-PE')}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => eliminarProducto(producto.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                            >
                              🗑️ Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {vistaActual === 'usuarios' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Gestionar Usuarios ({usuarios.length})
              </h3>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Información:</strong> Aquí puedes ver todos los usuarios registrados, cambiar sus roles (usuario/admin) y eliminar cuentas.
                </p>
              </div>

              {usuarios.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay usuarios registrados</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4">Nombre</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Celular</th>
                        <th className="text-left py-3 px-4">Rol</th>
                        <th className="text-left py-3 px-4">Fecha de Registro</th>
                        <th className="text-center py-3 px-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-800">{usuario.nombre || 'Sin nombre'}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-700">{usuario.email}</p>
                            <p className="text-xs text-gray-500 font-mono">ID: {usuario.id.substring(0, 8)}...</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-700">{usuario.celular || 'Sin celular'}</p>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={usuario.rol}
                              onChange={(e) => actualizarRolUsuario(usuario.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${
                                usuario.rol === 'admin'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              <option value="usuario">Usuario</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-600">
                              {usuario.created_at 
                                ? new Date(usuario.created_at).toLocaleDateString('es-PE', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'N/A'}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => abrirModalEdicion(usuario)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition text-sm"
                                title="Editar usuario"
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => eliminarUsuario(usuario.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition text-sm"
                                title="Eliminar usuario"
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                Estadísticas de Usuarios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600">Total Usuarios</p>
                  <p className="text-3xl font-bold text-blue-600">{usuarios.length}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-600">Administradores</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {usuarios.filter(u => u.rol === 'admin').length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600">Usuarios Regulares</p>
                  <p className="text-3xl font-bold text-green-600">
                    {usuarios.filter(u => u.rol === 'usuario').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista de Pedidos */}
        {vistaActual === 'pedidos' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Gestionar Pedidos ({pedidos.length})
              </h3>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Información:</strong> Aquí puedes ver todos los pedidos realizados por los clientes y actualizar su estado.
                </p>
              </div>

              {pedidos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay pedidos registrados</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4">ID Pedido</th>
                        <th className="text-left py-3 px-4">Cliente</th>
                        <th className="text-left py-3 px-4">Productos</th>
                        <th className="text-left py-3 px-4">Total</th>
                        <th className="text-left py-3 px-4">Estado</th>
                        <th className="text-left py-3 px-4">Fecha</th>
                        <th className="text-center py-3 px-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-mono text-sm text-gray-800">#{pedido.id.substring(0, 8)}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-800">{pedido.nombre}</p>
                            <p className="text-xs text-gray-500">{pedido.email}</p>
                            <p className="text-xs text-gray-500">📱 {pedido.celular}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-700">
                              {pedido.productos.length} {pedido.productos.length === 1 ? 'producto' : 'productos'}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-blue-600">
                              {pedido.moneda === 'PEN' ? 'S/' : '$'} {pedido.total.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              IGV: {pedido.moneda === 'PEN' ? 'S/' : '$'} {pedido.igv.toFixed(2)}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={pedido.estado}
                              onChange={(e) => actualizarEstadoPedido(pedido.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${
                                pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                pedido.estado === 'procesando' ? 'bg-blue-100 text-blue-800' :
                                pedido.estado === 'enviado' ? 'bg-purple-100 text-purple-800' :
                                pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="procesando">Procesando</option>
                              <option value="enviado">Enviado</option>
                              <option value="entregado">Entregado</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-600">
                              {new Date(pedido.created_at).toLocaleDateString('es-PE', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(pedido.created_at).toLocaleTimeString('es-PE', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => setPedidoDetalle(pedido)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition text-sm"
                                title="Ver detalles"
                              >
                                👁️ Ver Detalles
                              </button>
                              <button
                                onClick={() => enviarWhatsApp(pedido)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition text-sm"
                                title="Enviar por WhatsApp"
                              >
                                📱 WhatsApp
                              </button>
                              <button
                                onClick={() => eliminarPedido(pedido.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition text-sm"
                                title="Eliminar pedido"
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Estadísticas de Pedidos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                Estadísticas de Pedidos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600">Total Pedidos</p>
                  <p className="text-3xl font-bold text-blue-600">{pedidos.length}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {pedidos.filter(p => p.estado === 'pendiente').length}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-600">En Proceso</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {pedidos.filter(p => p.estado === 'procesando' || p.estado === 'enviado').length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600">Entregados</p>
                  <p className="text-3xl font-bold text-green-600">
                    {pedidos.filter(p => p.estado === 'entregado').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {usuarioEditando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Editar Usuario</h3>
                <button
                  onClick={cerrarModalEdicion}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={guardarEdicionUsuario} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
                  <input
                    type="text"
                    value={datosEdicion.nombre}
                    onChange={(e) => setDatosEdicion({...datosEdicion, nombre: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={datosEdicion.email}
                    onChange={(e) => setDatosEdicion({...datosEdicion, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Número de Celular</label>
                  <input
                    type="tel"
                    value={datosEdicion.celular}
                    onChange={(e) => setDatosEdicion({...datosEdicion, celular: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="999 999 999"
                  />
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                  <p className="text-xs text-blue-800">
                    ℹ️ <strong>Nota:</strong> Para cambiar contraseñas, los usuarios deben usar la opción "Olvidé mi contraseña" en la página de inicio de sesión.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    type="button"
                    onClick={cerrarModalEdicion}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Ajuste de Precios */}
        {mostrarModalPorcentaje && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">💰 Ajustar Precios</h3>
                <button
                  onClick={() => setMostrarModalPorcentaje(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Ajusta los precios de <strong>todos los productos</strong> por un porcentaje.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Ejemplos:</strong>
                    <br />• +15% = Aumentar precios en 15%
                    <br />• -10% = Reducir precios en 10%
                    <br />• +20% = Aumentar precios en 20%
                  </p>
                </div>

                <label className="block text-gray-700 font-semibold mb-2">
                  Porcentaje de Ajuste (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={porcentajeAjuste}
                    onChange={(e) => setPorcentajeAjuste(parseFloat(e.target.value))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-bold text-center"
                    placeholder="15"
                    step="0.1"
                  />
                  <span className="text-2xl font-bold text-gray-700">%</span>
                </div>

                {/* Vista previa del ajuste */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Precio actual: $100.00</span>
                      <span className="font-bold text-green-600">
                        → ${(100 * (1 + porcentajeAjuste / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Precio actual: $50.00</span>
                      <span className="font-bold text-green-600">
                        → ${(50 * (1 + porcentajeAjuste / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    ⚠️ <strong>Advertencia:</strong> Esta acción afectará a {productos.length} productos y no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={ajustarPreciosPorcentaje}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Ajustando...' : `Ajustar ${porcentajeAjuste > 0 ? '+' : ''}${porcentajeAjuste}%`}
                </button>
                <button
                  onClick={() => setMostrarModalPorcentaje(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Detalles del Pedido */}
        {pedidoDetalle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full my-8">
              <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between sticky top-0">
                <h3 className="text-2xl font-bold">Detalles del Pedido #{pedidoDetalle.id.substring(0, 8)}</h3>
                <button
                  onClick={() => setPedidoDetalle(null)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Información del Cliente */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">Información del Cliente</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-semibold">{pedidoDetalle.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold">{pedidoDetalle.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Celular:</span>
                      <span className="font-semibold">{pedidoDetalle.celular}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600 mb-1">Dirección de Envío:</span>
                      <span className="font-semibold">{pedidoDetalle.direccion}</span>
                    </div>
                  </div>
                </div>

                {/* Productos del Pedido */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">Productos ({pedidoDetalle.productos.length})</h4>
                  <div className="space-y-3">
                    {pedidoDetalle.productos.map((producto, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 flex gap-4">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=Producto'
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{producto.nombre}</p>
                          {producto.sku && (
                            <p className="text-xs text-gray-500">SKU: {producto.sku}</p>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-600">Cantidad: {producto.cantidad}</span>
                            <span className="font-bold text-blue-600">{producto.precio}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumen del Pedido */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">Resumen del Pedido</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal (sin IGV):</span>
                      <span className="font-semibold">
                        {pedidoDetalle.moneda === 'PEN' ? 'S/' : '$'} {pedidoDetalle.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IGV (18%):</span>
                      <span className="font-semibold">
                        {pedidoDetalle.moneda === 'PEN' ? 'S/' : '$'} {pedidoDetalle.igv.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        {pedidoDetalle.moneda === 'PEN' ? 'S/' : '$'} {pedidoDetalle.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estado y Fecha */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-600">Estado</h4>
                    <select
                      value={pedidoDetalle.estado}
                      onChange={(e) => {
                        actualizarEstadoPedido(pedidoDetalle.id, e.target.value)
                        setPedidoDetalle({...pedidoDetalle, estado: e.target.value})
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${
                        pedidoDetalle.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        pedidoDetalle.estado === 'procesando' ? 'bg-blue-100 text-blue-800' :
                        pedidoDetalle.estado === 'enviado' ? 'bg-purple-100 text-purple-800' :
                        pedidoDetalle.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="procesando">Procesando</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-600">Fecha del Pedido</h4>
                    <p className="text-sm text-gray-800">
                      {new Date(pedidoDetalle.created_at).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => enviarWhatsApp(pedidoDetalle)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
                  >
                    📱 Enviar por WhatsApp
                  </button>
                  <button
                    onClick={() => setPedidoDetalle(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
