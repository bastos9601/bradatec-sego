import { useState } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Verificar el rol y estado del usuario
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('rol, activo')
        .eq('id', data.user.id)
        .single()
      
      // Verificar si el usuario está activo
      if (perfil && !perfil.activo) {
        setError('❌ Tu cuenta ha sido desactivada. Contacta al administrador.')
        // Cerrar sesión inmediatamente
        await supabase.auth.signOut()
        setLoading(false)
        return
      }
      
      // Redirigir según el rol
      if (perfil?.rol === 'admin') {
        navigate('/admin')
      } else {
        navigate('/') // Usuarios regulares van a la tienda
      }
    }
  }

  const handleRecuperarPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMensaje('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      setMensaje('✓ Se ha enviado un correo de recuperación a tu email. Revisa tu bandeja de entrada.')
      setEmail('')
      
      // Volver al login después de 3 segundos
      setTimeout(() => {
        setMostrarRecuperacion(false)
        setMensaje('')
      }, 3000)
    } catch (error) {
      console.error('Error al recuperar contraseña:', error)
      setError(`Error: ${error.message}`)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {mostrarRecuperacion ? 'Recuperar Contraseña' : 'Inicio de Sesión'}
          </h2>
          <p className="text-gray-600 text-sm">
            {mostrarRecuperacion 
              ? 'Ingresa tu email para recuperar tu contraseña' 
              : 'Accede a tu cuenta de Bradatec'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {mensaje}
          </div>
        )}

        {!mostrarRecuperacion ? (
          // Formulario de Login
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@bradatec.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setMostrarRecuperacion(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>
        ) : (
          // Formulario de Recuperación
          <form onSubmit={handleRecuperarPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Te enviaremos un correo con instrucciones para restablecer tu contraseña
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Correo de Recuperación'}
            </button>

            <button
              type="button"
              onClick={() => {
                setMostrarRecuperacion(false)
                setError('')
                setMensaje('')
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
            >
              Volver al Login
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate('/registro')}
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            ← Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  )
}
