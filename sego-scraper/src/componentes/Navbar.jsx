import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [rol, setRol] = useState(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    obtenerUsuario()
  }, [])

  const obtenerUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      const { data } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single()
      if (data) setRol(data.rol)
    }
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    setMenuAbierto(false)
    navigate('/')
  }

  const irA = (ruta) => {
    navigate(ruta)
    setMenuAbierto(false)
  }

  // Si estamos en la página pública, no mostrar este navbar
  if (location.pathname === '/') {
    return null
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 
            className="text-xl md:text-2xl font-bold cursor-pointer" 
            onClick={() => irA('/')}
          >
            Bradatec - Admin
          </h1>

          {/* Botón hamburguesa para móviles */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Menú"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {menuAbierto ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>

          {/* Menú desktop */}
          <div className="hidden md:flex gap-4 items-center">
            {user && (
              <>
                <span className="text-sm">{user.email}</span>
                {rol === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded transition"
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Ver Tienda
                </button>
                <button
                  onClick={cerrarSesion}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {menuAbierto && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {user && (
              <>
                <div className="text-sm text-blue-100 border-b border-blue-500 pb-2">
                  {user.email}
                </div>
                {rol === 'admin' && (
                  <button
                    onClick={() => irA('/admin')}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 px-4 py-3 rounded transition text-left font-semibold"
                  >
                    📊 Panel Admin
                  </button>
                )}
                <button
                  onClick={() => irA('/')}
                  className="w-full bg-blue-700 hover:bg-blue-800 px-4 py-3 rounded transition text-left font-semibold"
                >
                  🏪 Ver Tienda
                </button>
                <button
                  onClick={cerrarSesion}
                  className="w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded transition text-left font-semibold"
                >
                  🚪 Cerrar Sesión
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

