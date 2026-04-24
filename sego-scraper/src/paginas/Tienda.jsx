import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'
import ProductoCard from '../componentes/ProductoCard'
import ModalCarrito from '../componentes/ModalCarrito'
import CarritoSidebar from '../componentes/CarritoSidebar'
import ModalCheckout from '../componentes/ModalCheckout'

export default function Tienda() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas')
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [moneda, setMoneda] = useState('USD') // USD o PEN
  const [tipoCambio, setTipoCambio] = useState(3.47) // Tipo de cambio por defecto
  const [cargandoTipoCambio, setCargandoTipoCambio] = useState(false)
  const [modalCarrito, setModalCarrito] = useState(null) // Producto agregado al carrito
  const [carrito, setCarrito] = useState(() => {
    // Cargar carrito desde localStorage al iniciar
    const carritoGuardado = localStorage.getItem('carrito')
    return carritoGuardado ? JSON.parse(carritoGuardado) : []
  })
  const [mostrarCarritoSidebar, setMostrarCarritoSidebar] = useState(false) // Mostrar sidebar del carrito
  const [mostrarCheckout, setMostrarCheckout] = useState(false) // Mostrar modal de checkout
  const [mensaje, setMensaje] = useState('') // Mensaje de éxito/error
  const [tipo, setTipo] = useState('') // Tipo de mensaje
  const [usuario, setUsuario] = useState(null) // Usuario autenticado
  const [esAdmin, setEsAdmin] = useState(false) // Si el usuario es admin
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false) // Menú móvil
  const navigate = useNavigate()

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  useEffect(() => {
    obtenerProductos()
    obtenerCategorias()
    obtenerTipoCambio()
    verificarUsuario()
    
    // Actualizar tipo de cambio cada 5 minutos
    const intervalo = setInterval(() => {
      obtenerTipoCambio()
    }, 5 * 60 * 1000) // 5 minutos
    
    return () => clearInterval(intervalo)
  }, [])

  const verificarUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)
    
    if (user) {
      // Verificar si el usuario es admin
      const { data: perfil, error } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single()
      
      console.log('=== DIAGNÓSTICO DE USUARIO ===')
      console.log('Usuario ID:', user.id)
      console.log('Usuario Email:', user.email)
      console.log('Perfil obtenido:', perfil)
      console.log('Error al obtener perfil:', error)
      console.log('Rol del usuario:', perfil?.rol)
      console.log('Es Admin?:', perfil?.rol === 'admin')
      console.log('==============================')
      
      setEsAdmin(perfil?.rol === 'admin')
    } else {
      setEsAdmin(false)
      console.log('Usuario actual: No autenticado')
    }
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    setUsuario(null)
    setEsAdmin(false)
    setCarrito([])
    setMenuMovilAbierto(false)
    localStorage.removeItem('carrito')
    console.log('Sesión cerrada')
  }

  const obtenerTipoCambio = async () => {
    setCargandoTipoCambio(true)
    try {
      // Intentar múltiples APIs en orden de prioridad
      
      // Opción 1: API de cuantoestaeldolar.pe (la que aparece en Google)
      try {
        const response1 = await fetch('https://cuantoestaeldolar.pe/api/exchange/latest')
        const data1 = await response1.json()
        
        if (data1 && data1.venta) {
          const tipoCambioDolar = parseFloat(data1.venta)
          setTipoCambio(tipoCambioDolar)
          console.log('✅ Tipo de cambio cuantoestaeldolar.pe:', tipoCambioDolar.toFixed(3))
          setCargandoTipoCambio(false)
          return
        }
      } catch (error) {
        console.log('⚠️ API cuantoestaeldolar.pe no disponible, intentando alternativa...')
      }
      
      // Opción 2: API de SUNAT (oficial Perú)
      try {
        const response2 = await fetch('https://api.apis.net.pe/v1/tipo-cambio-sunat')
        const data2 = await response2.json()
        
        if (data2.compra && data2.venta) {
          // Usar el precio de venta (más común para conversiones)
          const tipoCambioSunat = parseFloat(data2.venta)
          setTipoCambio(tipoCambioSunat)
          console.log('✅ Tipo de cambio SUNAT:', tipoCambioSunat.toFixed(3))
          setCargandoTipoCambio(false)
          return
        }
      } catch (error) {
        console.log('⚠️ API SUNAT no disponible, intentando alternativa...')
      }
      
      // Opción 3: ExchangeRate-API (respaldo internacional)
      try {
        const response3 = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const data3 = await response3.json()
        
        if (data3.rates && data3.rates.PEN) {
          setTipoCambio(data3.rates.PEN)
          console.log('✅ Tipo de cambio ExchangeRate-API:', data3.rates.PEN.toFixed(3))
          setCargandoTipoCambio(false)
          return
        }
      } catch (error) {
        console.log('⚠️ ExchangeRate-API no disponible, intentando alternativa...')
      }
      
      // Opción 4: Open Exchange Rates (último respaldo)
      try {
        const response4 = await fetch('https://open.er-api.com/v6/latest/USD')
        const data4 = await response4.json()
        
        if (data4.rates && data4.rates.PEN) {
          setTipoCambio(data4.rates.PEN)
          console.log('✅ Tipo de cambio Open Exchange Rates:', data4.rates.PEN.toFixed(3))
          setCargandoTipoCambio(false)
          return
        }
      } catch (error) {
        console.log('⚠️ Open Exchange Rates no disponible')
      }
      
      // Si todas las APIs fallan, mantener el tipo de cambio por defecto
      console.log('⚠️ Usando tipo de cambio por defecto: 3.47')
      
    } catch (error) {
      console.error('❌ Error al obtener tipo de cambio:', error)
    }
    setCargandoTipoCambio(false)
  }

  const obtenerCategorias = async () => {
    const { data } = await supabase
      .from('productos')
      .select('categoria')
    
    if (data) {
      const categoriasUnicas = [...new Set(data.map(p => p.categoria).filter(c => c))]
      setCategorias(['Todas', ...categoriasUnicas.sort()])
    }
  }

  const obtenerProductos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al obtener productos:', error)
    } else {
      console.log('Productos cargados:', data?.length || 0)
      setProductos(data || [])
    }
    setLoading(false)
  }

  const productosFiltrados = productos.filter(producto => {
    const cumpleCategoria = categoriaSeleccionada === 'Todas' || producto.categoria === categoriaSeleccionada
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return cumpleCategoria && cumpleBusqueda
  })

  const agregarAlCarrito = (producto) => {
    // Agregar producto al carrito
    const productoExistente = carrito.find(item => item.id === producto.id)
    
    if (productoExistente) {
      // Si ya existe, incrementar cantidad
      setCarrito(carrito.map(item => 
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
    } else {
      // Si no existe, agregarlo con cantidad 1
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
    }
    
    setModalCarrito(producto)
    console.log('Producto agregado al carrito:', producto)
  }

  const cerrarModal = () => {
    setModalCarrito(null)
  }

  const continuarComprando = () => {
    setModalCarrito(null)
  }

  const verCarrito = () => {
    setModalCarrito(null)
    setMostrarCarritoSidebar(true)
  }

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    setCarrito(carrito.map(item =>
      item.id === productoId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ))
  }

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.id !== productoId))
  }

  // Calcular total de items en el carrito
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0)

  // Calcular total del carrito
  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      const extraerPrecio = (precioStr) => {
        if (!precioStr) return 0;
        const match = precioStr.match(/[\d,]+\.?\d*/);
        if (match) {
          return parseFloat(match[0].replace(',', ''));
        }
        return 0;
      };
      
      const precioNumerico = extraerPrecio(item.precio);
      const precioConvertido = moneda === 'PEN' ? precioNumerico * tipoCambio : precioNumerico;
      return total + (precioConvertido * item.cantidad);
    }, 0);
  }

  const abrirCheckout = () => {
    setMostrarCarritoSidebar(false)
    setMostrarCheckout(true)
  }

  const handlePedidoCreado = (pedido) => {
    setMostrarCheckout(false)
    setCarrito([])
    localStorage.removeItem('carrito')
    setMensaje(`✓ ¡Pedido #${pedido.id.substring(0, 8)} creado exitosamente! Nos pondremos en contacto contigo pronto.`)
    setTipo('success')
    setTimeout(() => {
      setMensaje('')
    }, 5000)
  }

  // Calcular valores para el checkout
  const total = calcularTotal()
  const subtotalSinIGV = total / 1.18
  const igv = total - subtotalSinIGV

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Pública */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          {/* Header principal */}
          <div className="flex justify-between items-center">
            <h1 className="text-lg md:text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
              Bradatec - Catálogo 
            </h1>
            
            {/* Botones de usuario en desktop */}
            <div className="hidden md:flex items-center gap-3">
              {usuario ? (
                <>
                  {/* Selector de Moneda */}
                  <div className="flex items-center gap-2 bg-blue-700 rounded-lg px-3 py-2">
                    <span className="text-sm font-semibold">Moneda:</span>
                    <button
                      onClick={() => setMoneda('USD')}
                      className={`px-3 py-1 rounded transition ${
                        moneda === 'USD' 
                          ? 'bg-white text-blue-600 font-bold' 
                          : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                    >
                      $ USD
                    </button>
                    <button
                      onClick={() => setMoneda('PEN')}
                      className={`px-3 py-1 rounded transition ${
                        moneda === 'PEN' 
                          ? 'bg-white text-blue-600 font-bold' 
                          : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                    >
                      S/ PEN
                    </button>
                  </div>
                  
                  {/* Tipo de cambio */}
                  <div className="text-sm bg-blue-700 rounded-lg px-3 py-2 flex items-center gap-2">
                    <div>
                      <span className="text-blue-200">T.C:</span>{' '}
                      <span className="font-bold">S/ {tipoCambio.toFixed(3)}</span>
                    </div>
                    <button
                      onClick={obtenerTipoCambio}
                      disabled={cargandoTipoCambio}
                      className="text-xs bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded transition disabled:opacity-50"
                      title="Actualizar tipo de cambio"
                    >
                      {cargandoTipoCambio ? '⏳' : '🔄'}
                    </button>
                  </div>

                  <span className="text-sm text-blue-100">{usuario.email}</span>
                  {esAdmin && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded transition text-sm font-semibold"
                    >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={cerrarSesion}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition text-sm"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/admin/login')}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition text-sm"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate('/registro')}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded transition text-sm font-semibold"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Controles móviles */}
          <div className="md:hidden mt-3 space-y-2">
            {usuario && (
              <>
                {/* Selector de moneda móvil */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 bg-blue-700 rounded-lg px-3 py-2 flex-1">
                    <span className="text-xs font-semibold">Moneda:</span>
                    <button
                      onClick={() => setMoneda('USD')}
                      className={`px-2 py-1 rounded transition text-xs ${
                        moneda === 'USD' 
                          ? 'bg-white text-blue-600 font-bold' 
                          : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                    >
                      $ USD
                    </button>
                    <button
                      onClick={() => setMoneda('PEN')}
                      className={`px-2 py-1 rounded transition text-xs ${
                        moneda === 'PEN' 
                          ? 'bg-white text-blue-600 font-bold' 
                          : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                    >
                      S/ PEN
                    </button>
                  </div>
                  
                  {/* Tipo de cambio móvil */}
                  <div className="text-xs bg-blue-700 rounded-lg px-3 py-2 flex items-center gap-2">
                    <span className="text-blue-200">T.C:</span>
                    <span className="font-bold">S/ {tipoCambio.toFixed(3)}</span>
                    <button
                      onClick={obtenerTipoCambio}
                      disabled={cargandoTipoCambio}
                      className="text-xs bg-blue-600 hover:bg-blue-500 px-1 py-1 rounded transition disabled:opacity-50"
                    >
                      {cargandoTipoCambio ? '⏳' : '🔄'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Botones de usuario móvil */}
            <div className="flex flex-wrap gap-2">
              {usuario ? (
                <>
                  <span className="text-xs text-blue-100 w-full">{usuario.email}</span>
                  {esAdmin && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded transition text-xs font-semibold flex-1"
                    >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={cerrarSesion}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition text-xs flex-1"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/admin/login')}
                    className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded transition text-xs flex-1"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate('/registro')}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition text-xs font-semibold flex-1"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-4 md:p-8 mb-4 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">
            Catálogo de Productos Bradatec
          </h2>
          <p className="text-blue-100 text-sm md:text-lg">
            Explora nuestra selección completa de productos de seguridad y tecnología
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">🔍 Buscar</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos por nombre..."
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>

            {/* Categorías */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">📂 Categoría</label>
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div className="text-xs md:text-sm text-gray-600">
              Mostrando <span className="font-bold text-blue-600">{productosFiltrados.length}</span> de <span className="font-bold">{productos.length}</span> productos
            </div>
            {(busqueda || categoriaSeleccionada !== 'Todas') && (
              <button
                onClick={() => {
                  setBusqueda('')
                  setCategoriaSeleccionada('Todas')
                }}
                className="text-xs md:text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-xl mb-2">No se encontraron productos</p>
            <p className="text-gray-400">Intenta con otros filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <ProductoCard 
                key={producto.id} 
                producto={producto}
                moneda={moneda}
                tipoCambio={tipoCambio}
                onAgregarCarrito={agregarAlCarrito}
                mostrarPrecio={!!usuario}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de carrito */}
      {modalCarrito && (
        <ModalCarrito
          producto={modalCarrito}
          moneda={moneda}
          tipoCambio={tipoCambio}
          totalCarrito={calcularTotal()}
          totalItems={totalItems}
          onClose={cerrarModal}
          onContinuar={continuarComprando}
          onVerCarrito={verCarrito}
        />
      )}

      {/* Botón flotante del carrito */}
      {totalItems > 0 && (
        <button
          onClick={() => setMostrarCarritoSidebar(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 md:p-4 shadow-2xl transition-all duration-300 hover:scale-110 z-40 group"
          title="Ver carrito"
        >
          <div className="relative">
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {/* Badge con cantidad */}
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 font-bold text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center animate-pulse">
              {totalItems}
            </span>
          </div>
          {/* Tooltip - solo visible en desktop */}
          <div className="hidden md:block absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'} - {moneda === 'PEN' ? 'S/' : '$'} {calcularTotal().toFixed(2)}
            </div>
          </div>
        </button>
      )}

      {/* Sidebar del carrito */}
      {mostrarCarritoSidebar && (
        <CarritoSidebar
          carrito={carrito}
          moneda={moneda}
          tipoCambio={tipoCambio}
          onClose={() => setMostrarCarritoSidebar(false)}
          onActualizarCantidad={actualizarCantidad}
          onEliminar={eliminarDelCarrito}
          onProceder={abrirCheckout}
        />
      )}

      {/* Modal de Checkout */}
      {mostrarCheckout && (
        <ModalCheckout
          carrito={carrito}
          moneda={moneda}
          tipoCambio={tipoCambio}
          subtotalSinIGV={subtotalSinIGV}
          igv={igv}
          total={total}
          onClose={() => setMostrarCheckout(false)}
          onPedidoCreado={handlePedidoCreado}
        />
      )}

      {/* Mensaje de éxito */}
      {mensaje && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mensaje}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Bradatec - Catálogo de Productos Sego
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Todos los productos son propiedad de Sego Perú
          </p>
        </div>
      </footer>
    </div>
  )
}
