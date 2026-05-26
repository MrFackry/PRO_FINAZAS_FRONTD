import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
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

          <button
            type="submit"
            disabled={loading}
            className="bg-ak-red hover:bg-ak-red-dark text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="text-center text-xs text-gray-500">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-ak-red hover:underline">
              Regístrate
            </Link>
          </p>
          <p className="text-center text-xs text-gray-600">
            <a
              href="/privacidad"
              target="_blank"
              className="hover:text-gray-400 transition-colors"
            >
              Política de Privacidad
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
