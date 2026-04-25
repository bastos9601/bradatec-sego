import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Tienda from './paginas/Tienda'
import Admin from './paginas/Admin'
import ResetPassword from './paginas/ResetPassword'
import MiCuenta from './paginas/MiCuenta'
import MisOrdenes from './paginas/MisOrdenes'
import EditarPerfil from './paginas/EditarPerfil'
import CambiarContrasena from './paginas/CambiarContrasena'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/mi-cuenta" element={<MiCuenta />} />
        <Route path="/mis-ordenes" element={<MisOrdenes />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
        {/* Redirigir rutas antiguas */}
        <Route path="/login" element={<Navigate to="/admin/login" />} />
        <Route path="/dashboard" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
