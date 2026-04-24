export default function CarritoSidebar({ carrito, moneda, tipoCambio, onClose, onActualizarCantidad, onEliminar, onProceder }) {
  const simboloMoneda = moneda === 'PEN' ? 'S/' : '$';

  // Extraer precio numérico
  const extraerPrecio = (precioStr) => {
    if (!precioStr) return 0;
    const match = precioStr.match(/[\d,]+\.?\d*/);
    if (match) {
      return parseFloat(match[0].replace(',', ''));
    }
    return 0;
  };

  // Calcular subtotal (precio con IGV incluido)
  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => {
      const precioNumerico = extraerPrecio(item.precio);
      const precioConvertido = moneda === 'PEN' ? precioNumerico * tipoCambio : precioNumerico;
      return total + (precioConvertido * item.cantidad);
    }, 0);
  };

  const total = calcularSubtotal(); // El total es el subtotal (precio ya incluye IGV)
  const subtotalSinIGV = total / 1.18; // Precio sin IGV
  const impuestos = total - subtotalSinIGV; // IGV incluido en el precio

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar del carrito */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slideIn">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">
              Tu carrito <span className="text-gray-500 text-sm">({carrito.length} {carrito.length === 1 ? 'producto' : 'productos'})</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {carrito.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {carrito.map((item) => {
                const precioNumerico = extraerPrecio(item.precio);
                const precioConvertido = moneda === 'PEN' ? precioNumerico * tipoCambio : precioNumerico;
                const precioTotal = precioConvertido * item.cantidad;

                return (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 relative">
                    {/* Botón eliminar */}
                    <button
                      onClick={() => onEliminar(item.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 transition"
                      title="Eliminar producto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    <div className="flex gap-4">
                      {/* Imagen */}
                      <div className="w-20 h-20 bg-white rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=Producto'
                          }}
                        />
                      </div>

                      {/* Información */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
                          {item.nombre}
                        </h3>
                        {item.sku && (
                          <p className="text-xs text-gray-500 mb-2">
                            SKU: {item.sku}
                          </p>
                        )}
                        <p className="text-xs text-gray-600 mb-2">
                          Marca: {item.categoria || 'N/A'}
                        </p>

                        {/* Controles de cantidad */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-white border rounded">
                            <button
                              onClick={() => onActualizarCantidad(item.id, Math.max(1, item.cantidad - 1))}
                              className="px-3 py-1 text-gray-600 hover:text-blue-600 transition"
                            >
                              −
                            </button>
                            <span className="px-3 py-1 font-semibold text-gray-800 min-w-[2rem] text-center">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
                              className="px-3 py-1 text-gray-600 hover:text-blue-600 transition"
                            >
                              +
                            </button>
                          </div>

                          {/* Precio */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              {simboloMoneda} {precioTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con totales */}
        {carrito.length > 0 && (
          <div className="border-t bg-white px-6 py-4">
            {/* Subtotal sin IGV */}
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal (sin IGV)</span>
              <span className="font-semibold">{simboloMoneda} {subtotalSinIGV.toFixed(2)}</span>
            </div>

            {/* Impuestos incluidos */}
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">IGV (18% incluido)</span>
              <span className="font-semibold">{simboloMoneda} {impuestos.toFixed(2)}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-4 pt-4 border-t">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                {simboloMoneda} {total.toFixed(2)}
              </span>
            </div>

            {/* Botón proceder */}
            <button 
              onClick={onProceder}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <span>Proceder</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
