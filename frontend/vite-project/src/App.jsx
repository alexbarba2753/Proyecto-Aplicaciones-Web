import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home' 
import Login  from './pages/Login'
import { Register } from './pages/Register'
import { Confirm } from './pages/Confirm'
import { Forgot } from './pages/Forgot' 
import { Reset } from './pages/Reset' 
import Dashboard from './layout/Dashboard'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route element={<PublicRoute />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirmar/:token" element={<Confirm />} />
          <Route path='/forgot' element={<Forgot />} />
          <Route path='/recuperarpassword/:token' element={<Reset />} />
        </Route>

        <Route path='dashboard/*' element={
          <ProtectedRoute>
            <Routes>
              <Route element={<Dashboard />}>
                {/* Dejamos tu index en null tal como lo tenías para pintar tus cuadros */}
                <Route index element={null} />
              </Route>
            </Routes>
          </ProtectedRoute>
        } />

        {/* Ruta comodín */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App