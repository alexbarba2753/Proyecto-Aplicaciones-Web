import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react' 
import { Home } from './pages/Home' 
import Login  from './pages/Login'
import { Register } from './pages/Register'
import { Confirm } from './pages/Confirm'
import { Forgot } from './pages/Forgot' 
import { Reset } from './pages/Reset' 
import Dashboard from './layout/Dashboard'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'
import storeAuth from './context/storeAuth'
import storeProfile from './context/userProfile' 


function App() {

  const { profile } = storeProfile()
  const { token } = storeAuth()

  useEffect(() => {
    if (token) {
      profile()
    }
  }, [token])

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
                {/* Tu index en null para pintar tus cuadros */}
                <Route index element={null} />
              </Route>
            </Routes>
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App