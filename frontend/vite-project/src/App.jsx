import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home' 
import Login  from './pages/Login'
import { Register } from './pages/Register'
import { Confirm } from './pages/Confirm'
import { Forgot } from './pages/Forgot' 
import { Reset } from './pages/Reset' 
import Dashboard from './layout/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirmar/:token" element={<Confirm />} />
        <Route path='/forgot' element={<Forgot />} />
        <Route path='/recuperarpassword/:token' element={<Reset />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={null} />
        </Route>

        {/* Ruta comodín */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App