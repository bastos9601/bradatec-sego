import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import Navbar from '../componentes/Navbar'
import ProductoCard from '../componentes/ProductoCard'

export default function Dashboard() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas')
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    obtenerProductos()
    obtenerCategorias()
  }, [])

  const obtenerCategorias = async () => {
    const { data } = await supabase
      .from('productos')
      .select('categoria')
    
    if (data) {
      const categoriasUnicas = [...new Set(data.map(p => p.categoria).filter(c => c))]
      setCategorias(['Todas', ...categoriasUnicas])
    }
  }

  const obtenerProductos = async () => {
    setLoading(true)
    let query = supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener productos:', error)
    } else {
      setProductos(data || [])
    }
    setLoading(false)
  }

  const productosFiltrados = productos.filter(producto => {
    const cumpleCategoria = categoriaSeleccionada === 'Todas' || producto.categoria === categoriaSeleccionada
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return cumpleCategoria && cumpleBusqueda
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Productos Sego
        </h2>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Buscar</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categorías */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Mostrando {productosFiltrados.length} de {productos.length} productos
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
