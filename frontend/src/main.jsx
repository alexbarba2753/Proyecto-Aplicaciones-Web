import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css' // <-- Asegúrate de que index.css tenga el punto y la barra

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)