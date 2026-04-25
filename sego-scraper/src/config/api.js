// Configuración de API de Cambio de Divisas
export const CURRENCY_API_KEY = 'cur_live_gfZF8jZXg4HbNsWNWDUqCe8iwHO61hhblVXT9kMP';
export const CURRENCY_API_URL = `https://api.currencyapi.com/v3/latest?apikey=${CURRENCY_API_KEY}&base_currency=USD&currencies=PEN`;

// Función para obtener tipo de cambio (SOLO Currency API)
export async function obtenerTipoCambioAPI() {
  try {
    console.log('💱 Obteniendo tipo de cambio de Currency API...');
    const response = await fetch(CURRENCY_API_URL);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    const tipoCambio = data.data.PEN.value;
    
    console.log(`✅ Tipo de cambio obtenido: 1 USD = ${tipoCambio.toFixed(2)} PEN`);
    return tipoCambio;
  } catch (error) {
    console.error('❌ Error obteniendo tipo de cambio:', error.message);
    throw error; // Lanzar error en lugar de retornar null
  }
}
