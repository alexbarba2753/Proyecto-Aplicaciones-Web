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

        <Route element={<PublicRoute />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirmar/:token" element={<Confirm />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/recuperarpassword/:token" element={<Reset />} />
        </Route>


        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={null} />
          <Route path="profile" element={<ProfileUser />} />  
          <Route path="list"    element={<div>Lista</div>} />
          <Route path="create"  element={<div>Crear</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App