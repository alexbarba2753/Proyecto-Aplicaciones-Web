import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Home } from './pages/Home'
import Login from './pages/Login'
import { Register } from './pages/Register'
import { Confirm } from './pages/Confirm'
import { Forgot } from './pages/Forgot'
import { Reset } from './pages/Reset'
import Dashboard from './layout/Dashboard'
import ProfileUser from './pages/ProfileUser'   
import AulasLista from './pages/AulasLista'
import AulaDetalle from './pages/AulaDetalle'
import AulaCrear from './pages/AulaCrear'
import GoogleCallbackPage from './pages/GoogleCallbackPage'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'
import storeAuth from './context/storeAuth'
import storeProfile from './context/userProfile'

function App() {
  const { profile } = storeProfile()
  const { token } = storeAuth()

  useEffect(() => {
    if (token) profile()
  }, [token])

  return (
    <BrowserRouter>
      <Routes>

        {/* 🆕 Ruta de callback de Google OAuth (fuera de PublicRoute/ProtectedRoute) */}
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

        <Route element={<PublicRoute />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirmar/:token" element={<Confirm />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/recuperarpassword/:token" element={<Reset />} />
        </Route>

        {/* ✅ Dashboard como layout con hijos directos */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={null} />
          <Route path="profile" element={<ProfileUser />} />
          <Route path="aulas" element={<AulasLista />} />
          <Route path="aulas/crear" element={<AulaCrear />} />
          <Route path="aulas/:id" element={<AulaDetalle />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App