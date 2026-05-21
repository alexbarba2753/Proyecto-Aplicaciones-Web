import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer } from 'react-toastify';
import { useFetch } from "../hooks/useFetch";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { fetchDataBackend, loading } = useFetch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const registerUser = async (dataForm) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/registro`;
    await fetchDataBackend(url, dataForm, "POST");
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen w-full bg-white">
      <ToastContainer />

      {/* Contenedor del Formulario (Lado Izquierdo) */}
      <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-black mb-1 text-center uppercase text-zinc-500 tracking-tight">
            Bienvenido(a)
          </h1>
          <small className="text-zinc-400 block text-center mb-6 text-sm">
            Por favor ingresa tus datos para el registro en PraxisFlow
          </small> 
          
          {/* Formulario */}
          <form onSubmit={handleSubmit(registerUser)} className="space-y-4">
            
            {/* Campo nombre */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Nombre</label>
              <input 
                type="text" 
                placeholder="Ingresa tu nombre" 
                className="block w-full rounded-lg border border-zinc-300 py-2 px-3 text-zinc-600 focus:outline-emerald-500 bg-zinc-50"
                {...register("nombre", { required: "El nombre es obligatorio" })}
              />
              {errors.nombre && <p className="text-red-600 text-xs mt-1 font-medium">{errors.nombre.message}</p>}
            </div>

            {/* Campo apellido */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Apellido</label>
              <input 
                type="text" 
                placeholder="Ingresa tu apellido" 
                className="block w-full rounded-lg border border-zinc-300 py-2 px-3 text-zinc-600 focus:outline-emerald-500 bg-zinc-50"
                {...register("apellido", { required: "El apellido es obligatorio" })}
              />
              {errors.apellido && <p className="text-red-600 text-xs mt-1 font-medium">{errors.apellido.message}</p>}
            </div>

            {/* Campo dirección */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Dirección</label>
              <input 
                type="text" 
                placeholder="Ingresa tu dirección de domicilio" 
                className="block w-full rounded-lg border border-zinc-300 py-2 px-3 text-zinc-600 focus:outline-emerald-500 bg-zinc-50"
                {...register("direccion", { required: "La dirección es obligatoria" })}
              />
              {errors.direccion && <p className="text-red-600 text-xs mt-1 font-medium">{errors.direccion.message}</p>}
            </div>

            {/* Campo celular */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Celular</label>
              <input 
                type="text" 
                inputMode="tel" 
                placeholder="Ingresa tu celular" 
                className="block w-full rounded-lg border border-zinc-300 py-2 px-3 text-zinc-600 focus:outline-emerald-500 bg-zinc-50"
                {...register("celular", { required: "El celular es obligatorio" })}
              />
              {errors.celular && <p className="text-red-600 text-xs mt-1 font-medium">{errors.celular.message}</p>}
            </div>

            {/* Campo correo electrónico */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-700">Correo electrónico</label>
              <input 
                type="email" 
                placeholder="Ingresa tu correo electrónico" 
                className="block w-full rounded-lg border border-zinc-300 py-2 px-3 text-zinc-600 focus:outline-emerald-500 bg-zinc-50" 
                {...register("email", { required: "El correo electrónico es obligatorio" })}
              />
              {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-zinc-700">Contraseña</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="************"
                  className="w-full rounded-lg border border-zinc-300 py-2 pl-3 pr-10 text-zinc-600 focus:outline-emerald-500 bg-zinc-50"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 flex items-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            {/* Botón Register */}
            <div className="pt-2">
              <button 
                className="bg-emerald-600 text-white font-medium py-2.5 w-full rounded-xl shadow-sm transition-all duration-300 hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            </div>
          </form>

          {/* Enlace para iniciar sesión si ya tiene una cuenta */}
          <div className="mt-6 text-sm flex justify-between items-center border-t border-zinc-100 pt-4">
            <p className="text-zinc-500">¿Ya posees una cuenta?</p>
            <Link 
              to="/login" 
              className="py-1.5 px-4 bg-zinc-100 text-zinc-700 font-medium rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Imagen Lateral (Lado Derecho - Se oculta en móviles) */}
      <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-[url('/public/images/dogregister.jpg')] bg-no-repeat bg-cover bg-center sm:block hidden">
      </div>
    </div>
  );
};

export default Register;