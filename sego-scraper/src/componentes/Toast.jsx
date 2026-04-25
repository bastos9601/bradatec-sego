import { useEffect } from 'react'

export default function Toast({ mensaje, tipo, onClose, duracion = 5000 }) {
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        onClose()
      }, duracion)
      return () => clearTimeout(timer)
    }
  }, [mensaje, duracion, onClose])

  if (!mensaje) return null

  const estoilos = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    pedido: 'bg-purple-500'
  }

  const iconos = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    pedido: '🛒'
  }

  return (
    <div className={`fixed top-4 right-4 ${estoilos[tipo] || estoilos.info} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn z-50 max-w-sm`}>
      <span className="text-2xl">{iconos[tipo] || iconos.info}</span>
      <div className="flex-1">
        <p className="font-semibold">{mensaje}</p>
      </div>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition ml-2"
      >
        ✕
      </button>
    </div>
  )
}
