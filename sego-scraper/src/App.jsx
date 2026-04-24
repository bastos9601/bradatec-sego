import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Tienda from './paginas/Tienda'
import Admin from './paginas/Admin'
import ResetPassword from './paginas/ResetPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Redirigir rutas antiguas */}
        <Route path="/login" element={<Navigate to="/admin/login" />} />
        <Route path="/dashboard" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
