import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Register() {
  // 1. Agregamos confirmPassword al estado inicial
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 2. Validación de coincidencia
    if (form.password !== form.confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    // Validación opcional de longitud mínima
    if (form.password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres");
    }

    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      // Añade esto para ver el objeto completo en la consola
      console.error("Error completo:", err);
      console.log("Datos que intentaste enviar:", form);

      setError(err.response?.data?.error || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ak-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ak-red mb-1">FinanzasPro</h1>
          <p className="text-gray-500 text-sm">Control financiero personal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-ak-gray rounded-2xl border border-ak-gray2 p-8 flex flex-col gap-4"
        >
          {error && (
            <div className="bg-red-950 border border-ak-red text-red-300 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="usuario"
              required
              className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-red rounded-lg px-4 py-2.5 text-sm text-ak-white outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="usuario@email.com"
              required
              className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-red rounded-lg px-4 py-2.5 text-sm text-ak-white outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-red rounded-lg px-4 py-2.5 text-sm text-ak-white outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              // 3. Feedback visual: si ya escribió algo y no coincide, borde rojo
              className={`bg-ak-gray2 border rounded-lg px-4 py-2.5 text-sm text-ak-white outline-none transition-colors ${
                form.confirmPassword && form.password !== form.confirmPassword
                  ? "border-red-500"
                  : "border-ak-gray2 focus:border-ak-red"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-ak-red hover:bg-ak-red-dark text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="text-center text-xs text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-ak-red hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
