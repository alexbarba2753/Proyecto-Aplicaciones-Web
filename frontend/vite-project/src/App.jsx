import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home' 
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Confirm } from './pages/Confirm' 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Home />} />

        {/* Rutas de autenticación */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* 🎓 NUEVA: Ruta para capturar el token de la ESFOT que viaja por la URL */}
        <Route path="confirmar/:token" element={<Confirm />} />

        {/* Ruta comodín */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App