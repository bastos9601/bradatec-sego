export default function ModalCarrito({ producto, moneda, tipoCambio, totalCarrito, totalItems, onClose, onContinuar, onVerCarrito }) {
  const simboloMoneda = moneda === 'PEN' ? 'S/' : '$';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative animate-fadeIn">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenido */}
        <div className="p-6">
          {/* Ícono de éxito */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-20 h-20 object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x80?text=Producto'
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <div className="text-center mb-4">
            <p className="text-gray-600 text-sm mb-2">
              Existen {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'} en su carrito.
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-1">
              Total del carrito: <span className="text-blue-600">{simboloMoneda} {totalCarrito.toFixed(2)}</span>
            </p>
          </div>

          {/* Producto agregado */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
            <h3 className="text-blue-600 font-bold text-center mb-2">
              {producto.nombre}
            </h3>
            <p className="text-center text-green-600 text-sm font-semibold">
              Añadido correctamente al carrito.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={onContinuar}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Continuar comprando
            </button>
            <button
              onClick={onVerCarrito}
              className="flex-1 bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-4 rounded-lg border-2 border-blue-600 transition"
            >
              Ver Carro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
