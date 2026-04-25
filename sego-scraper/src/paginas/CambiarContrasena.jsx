import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Save, ArrowLeft } from 'lucide-react'

export default function CambiarContrasena() {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cambiando, setCambiando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState('')
  const [formData, setFormData] = useState({
    passwordActual: '',
    passwordNueva: '',
    passwordConfirmar: ''
  })
  const [mostrarPassword, setMostrarPassword] = useState({
    actual: false,
    nueva: false,
    confirmar: false
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
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleMostrarPassword = (campo) => {
    setMostrarPassword(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCambiando(true)
    setMensaje('')

    try {
      // Validaciones
      if (!formData.passwordActual) {
        setMensaje('Debes ingresar tu contraseña actual')
        setTipo('error')
        setCambiando(false)
        return
      }

      if (!formData.passwordNueva) {
        setMensaje('Debes ingresar una contraseña nueva')
        setTipo('error')
        setCambiando(false)
        return
      }

      if (formData.passwordNueva.length < 6) {
        setMensaje('La contraseña debe tener al menos 6 caracteres')
        setTipo('error')
        setCambiando(false)
        return
      }

      if (formData.passwordNueva !== formData.passwordConfirmar) {
        setMensaje('Las contraseñas nuevas no coinciden')
        setTipo('error')
        setCambiando(false)
        return
      }

      if (formData.passwordActual === formData.passwordNueva) {
        setMensaje('La contraseña nueva debe ser diferente a la actual')
        setTipo('error')
        setCambiando(false)
        return
      }

      // Primero, verificar que la contraseña actual es correcta
      // Intentar hacer login con las credenciales actuales
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: usuario.email,
        password: formData.passwordActual
      })

      if (signInError) {
        setMensaje('La contraseña actual es incorrecta')
        setTipo('error')
        setCambiando(false)
        return
      }

      // Cambiar la contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.passwordNueva
      })

      if (updateError) {
        throw updateError
      }

      setMensaje('✓ Contraseña cambiada correctamente')
      setTipo('success')
      
      // Limpiar formulario
      setFormData({
        passwordActual: '',
        passwordNueva: '',
        passwordConfirmar: ''
      })

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/mi-cuenta')
      }, 2000)
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      setMensaje(`✗ Error: ${error.message}`)
      setTipo('error')
    }

    setCambiando(false)
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
              <h1 className="text-3xl font-bold text-gray-800">Cambiar Contraseña</h1>
              <button
                onClick={() => navigate('/mi-cuenta')}
                className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                Volver
              </button>
            </div>
            <p className="text-gray-600">Actualiza tu contraseña de acceso</p>
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contraseña Actual */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Lock size={16} className="text-blue-600" />
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword.actual ? 'text' : 'password'}
                    name="passwordActual"
                    value={formData.passwordActual}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleMostrarPassword('actual')}
                    className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                  >
                    {mostrarPassword.actual ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Contraseña Nueva */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Lock size={16} className="text-blue-600" />
                  Contraseña Nueva
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword.nueva ? 'text' : 'password'}
                    name="passwordNueva"
                    value={formData.passwordNueva}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => toggleMostrarPassword('nueva')}
                    className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                  >
                    {mostrarPassword.nueva ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              {/* Confirmar Contraseña Nueva */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Lock size={16} className="text-blue-600" />
                  Confirmar Contraseña Nueva
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword.confirmar ? 'text' : 'password'}
                    name="passwordConfirmar"
                    value={formData.passwordConfirmar}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => toggleMostrarPassword('confirmar')}
                    className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                  >
                    {mostrarPassword.confirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={cambiando}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {cambiando ? 'Cambiando...' : 'Cambiar Contraseña'}
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

          {/* Requisitos de Seguridad */}
          <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg p-6">
            <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
              <Lock size={18} />
              Requisitos de Seguridad
            </h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>• La contraseña debe tener al menos 6 caracteres</li>
              <li>• Debe ser diferente a tu contraseña actual</li>
              <li>• Las dos contraseñas nuevas deben coincidir</li>
              <li>• Serás desconectado después de cambiar tu contraseña</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
