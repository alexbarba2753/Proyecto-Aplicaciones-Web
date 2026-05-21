import { useState } from 'react';

function App() {
  // Un estado simple de prueba para verificar que React funciona dinámicamente
  const [selectedRole, setSelectedRole] = useState('Ninguno');

  const roles = ['Estudiante', 'Tutor Académico', 'Supervisor Externo'];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 font-sans">
      {/* Navbar Simple */}
      <header className="bg-zinc-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-emerald-400">PraxisFlow</h1>
        <span className="text-sm text-zinc-400">Sistema de Gestión de Prácticas Preprofesionales</span>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          <h2 className="text-2xl font-bold text-zinc-800 text-center mb-2">¡Entorno Base Listo!</h2>
          <p className="text-zinc-500 text-center text-sm mb-6">
            React 19 + Tailwind v4 están procesando las funcionalidades correctamente.
          </p>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Prueba de Estado (Roles del Sistema):
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left border ${
                    selectedRole === role
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Alerta de estado dinámico */}
            <div className="mt-4 p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-center">
              <p className="text-xs text-zinc-600">
                Rol seleccionado para pruebas: <strong className="text-zinc-900">{selectedRole}</strong>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-200 text-center py-3 text-xs text-zinc-500 border-t border-zinc-300">
        &copy; {new Date().getFullYear()} PraxisFlow - Panel de Desarrollo Técnico
      </footer>
    </div>
  );
}

export default App;