import { useState, useEffect } from 'react'

export default function ModalProductoDetalle({ producto, onClose, moneda, tipoCambio }) {
  const [precioConvertido, setPrecioConvertido] = useState(0)

  useEffect(() => {
    if (producto && tipoCambio && moneda === 'PEN') {
      const extraerPrecio = (precioStr) => {
        if (!precioStr) return 0
        const match = precioStr.match(/[\d,]+\.?\d*/)
        if (match) {
          return parseFloat(match[0].replace(',', ''))
        }
        return 0
      }
      const precio = extraerPrecio(producto.precio)
      setPrecioConvertido(precio * tipoCambio)
    }
  }, [producto, tipoCambio, moneda])

  if (!producto) return null

  const extraerPrecio = (precioStr) => {
    if (!precioStr) return 0
    const match = precioStr.match(/[\d,]+\.?\d*/)
    if (match) {
      return parseFloat(match[0].replace(',', ''))
    }
    return 0
  }

  const precioNumerico = extraerPrecio(producto.precio)
  const simboloMoneda = moneda === 'PEN' ? 'S/' : '$'
  const precioFinal = moneda === 'PEN' ? precioConvertido : precioNumerico

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Detalles del Producto</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Imagen */}
          <div className="mb-6">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-auto max-h-96 object-contain rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'
              }}
            />
          </div>

          {/* Nombre */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {producto.nombre}
          </h1>

          {/* Categoría */}
          {producto.categoria && (
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                📂 {producto.categoria}
              </span>
            </div>
          )}

          {/* SKU */}
          {producto.sku && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>SKU:</strong> <span className="font-mono">{producto.sku}</span>
              </p>
            </div>
          )}

          {/* Stock */}
          {producto.stock && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>Stock:</strong> <span className="text-green-600 font-semibold">{producto.stock}</span>
              </p>
            </div>
          )}

          {/* Precios */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <div className="mb-3">
              <p className="text-sm text-gray-600">Precio Lista</p>
              <p className="text-2xl font-bold text-blue-600">
                {simboloMoneda} {precioFinal.toFixed(2)}
              </p>
            </div>
            {moneda === 'PEN' && tipoCambio && (
              <div className="text-xs text-gray-500">
                Precio original: $ {precioNumerico.toFixed(2)}
                <br />
                Tipo de cambio: 1 USD = S/ {tipoCambio.toFixed(2)}
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 leading-relaxed">
              {producto.descripcion ? (
                <p>{producto.descripcion}</p>
              ) : (
                <p className="text-gray-500 italic">
                  No hay descripción disponible para este producto.
                </p>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Fecha de Registro</p>
              <p className="text-sm font-semibold text-gray-800">
                {producto.created_at 
                  ? new Date(producto.created_at).toLocaleDateString('es-PE')
                  : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">ID del Producto</p>
              <p className="text-xs font-mono text-gray-800 truncate">
                {producto.id}
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
