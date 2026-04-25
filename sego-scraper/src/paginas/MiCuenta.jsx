import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'
import { Mail, User, Phone, Lock, CheckCircle, Calendar, Edit, Key, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function MiCuenta() {
  const [usuario, setUsuario] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
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

    // Obtener perfil del usuario
    const { data: perfilData, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error al obtener perfil:', error)
    } else {
      setPerfil(perfilData)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-800">Mi Cuenta</h1>
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                Volver a la Tienda
              </button>
            </div>
            <p className="text-gray-600">Información de tu perfil</p>
          </div>

          {/* Información del Perfil */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  Email
                </label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-800 font-semibold">{usuario?.email}</p>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2 flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  Nombre Completo
                </label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-800 font-semibold">{perfil?.nombre || 'No especificado'}</p>
                </div>
              </div>

              {/* Celular */}
              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-blue-600" />
                  Celular
                </label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-800 font-semibold">{perfil?.celular || 'No especificado'}</p>
                </div>
              </div>

              {/* Rol */}
              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Lock size={16} className="text-blue-600" />
                  Rol
                </label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-800 font-semibold capitalize">{perfil?.rol || 'usuario'}</p>
                </div>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-blue-600" />
                  Estado
                </label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className={`font-semibold flex items-center gap-2 ${perfil?.activo ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircle size={16} />
                    {perfil?.activo ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
              </div>

              {/* Fecha de Registro */}
              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600" />
                  Miembro desde
                </label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-800 font-semibold">
                    {new Date(perfil?.created_at).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => window.location.href = '/editar-perfil'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                Editar Perfil
              </button>
              <button
                onClick={() => window.location.href = '/cambiar-contrasena'}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Key size={18} />
                Cambiar Contraseña
              </button>
              <button
                onClick={() => window.location.href = '/mis-ordenes'}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Mis Órdenes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
