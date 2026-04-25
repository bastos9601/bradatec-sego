import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, Save, ArrowLeft } from 'lucide-react'

export default function EditarPerfil() {
  const [usuario, setUsuario] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    email: ''
  })
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
      setFormData({
        nombre: perfilData.nombre || '',
        celular: perfilData.celular || '',
        email: perfilData.email || user.email || ''
      })
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje('')

    try {
      // Validaciones
      if (!formData.nombre || !formData.nombre.trim()) {
        setMensaje('El nombre es requerido')
        setTipo('error')
        setGuardando(false)
        return
      }

      if (!formData.celular || !formData.celular.trim()) {
        setMensaje('El celular es requerido')
        setTipo('error')
        setGuardando(false)
        return
      }

      // Actualizar perfil
      const { error } = await supabase
        .from('perfiles')
        .update({
          nombre: formData.nombre.trim(),
          celular: formData.celular.trim(),
          email: formData.email.trim()
        })
        .eq('id', usuario.id)

      if (error) {
        throw error
      }

      setMensaje('✓ Perfil actualizado correctamente')
      setTipo('success')
      
      // Recargar datos
      setTimeout(() => {
        verificarUsuario()
      }, 1500)
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      setMensaje(`✗ Error: ${error.message}`)
      setTipo('error')
    }

    setGuardando(false)
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
              <h1 className="text-3xl font-bold text-gray-800">Editar Perfil</h1>
              <button
                onClick={() => navigate('/mi-cuenta')}
                className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                Volver
              </button>
            </div>
            <p className="text-gray-600">Actualiza tu información personal</p>
          </div>

          {/* Mensaje */}
          {mensaje && (
            <div className={`mb-6 p-4 rounded-lg ${
              tipo === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {mensaje}
            </div>
          )}

          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (solo lectura) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  Email (no se puede cambiar)
                </label>
                <input
                  type="email"
                  value={usuario?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para cambiar tu email, contacta con soporte
                </p>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              {/* Celular */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-blue-600" />
                  Número de Celular
                </label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="999 999 999"
                  required
                />
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/mi-cuenta')}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mt-6">
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ Información</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los cambios se guardarán inmediatamente</li>
              <li>• Tu email no se puede cambiar desde aquí</li>
              <li>• Para cambiar tu contraseña, usa la opción "Cambiar Contraseña"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
