import { useState } from 'react'

export default function ProductoCard({ producto, moneda, tipoCambio, onAgregarCarrito, mostrarPrecio, onVerDetalles }) {
  const [mostrarDetalles, setMostrarDetalles] = useState(false)

  // Extraer el precio numérico del string (ej: "$ 154.92" -> 154.92)
  const extraerPrecio = (precioStr) => {
    if (!precioStr) return 0;
    const match = precioStr.match(/[\d,]+\.?\d*/);
    if (match) {
      return parseFloat(match[0].replace(',', ''));
    }
    return 0;
  };

  const precioNumerico = extraerPrecio(producto.precio);
  
  // Convertir precio según la moneda seleccionada
  const precioConvertido = moneda === 'PEN' && tipoCambio
    ? precioNumerico * tipoCambio 
    : precioNumerico;

  const simboloMoneda = moneda === 'PEN' ? 'S/' : '$';
  const precioFormateado = `${simboloMoneda} ${precioConvertido.toFixed(2)}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="h-48 bg-gray-200 flex items-center justify-center relative group-hover:overflow-visible">
        {producto.stock && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
            {producto.stock}
          </span>
        )}
        
        {/* Botones de acción que aparecen al hacer hover */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button 
            onClick={() => setMostrarDetalles(true)}
            className="bg-white hover:bg-blue-600 hover:text-white text-gray-700 p-2 rounded-full shadow-lg transition-colors"
            title="Ver detalles"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>

        {/* Imagen del producto */}
        <div className="w-full h-full overflow-hidden cursor-pointer" onClick={() => setMostrarDetalles(true)}>
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen'
              }}
            />
          ) : (
            <span className="text-gray-400">Sin imagen</span>
          )}
        </div>

        {/* Botón de agregar al carrito (aparece en la parte inferior al hacer hover) */}
        {mostrarPrecio && (
          <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button 
              onClick={() => onAgregarCarrito(producto)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold flex items-center justify-center gap-2 shadow-lg"
              title="Agregar al carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Agregar al Carrito
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {producto.categoria && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {producto.categoria}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {producto.nombre}
        </h3>
        {producto.sku && (
          <p className="text-xs text-gray-500 mb-2">
            SKU: <span className="font-mono">{producto.sku}</span>
          </p>
        )}
        <div className="border-t pt-2 mt-2">
          {mostrarPrecio ? (
            <>
              <p className="text-xs text-gray-500 mb-1">Precio con IGV</p>
              <p className="text-2xl font-bold text-blue-600">
                {precioFormateado}
              </p>
              {moneda === 'PEN' && (
                <p className="text-xs text-gray-400 mt-1">
                  Precio original: {producto.precio}
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500 mb-2">
                Inicia sesión para ver precios
              </p>
              <button 
                onClick={() => window.location.href = '/registro'}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(producto.created_at).toLocaleDateString('es-PE')}
        </p>
      </div>

      {/* Modal de detalles */}
      {mostrarDetalles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Detalles del Producto</h2>
              <button
                onClick={() => setMostrarDetalles(false)}
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
                  <p className="text-sm text-gray-600">Precio con IGV</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {simboloMoneda} {precioConvertido.toFixed(2)}
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

              {/* Botón de agregar al carrito */}
              {mostrarPrecio && (
                <button
                  onClick={() => {
                    onAgregarCarrito(producto)
                    setMostrarDetalles(false)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition mb-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Agregar al Carrito
                </button>
              )}

              {/* Botón cerrar */}
              <button
                onClick={() => setMostrarDetalles(false)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
