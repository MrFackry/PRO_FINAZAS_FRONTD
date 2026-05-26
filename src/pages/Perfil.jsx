import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth";
import api from "../api/axios";

const MONEDAS = [
  { code: "COP", label: "Peso colombiano", simbolo: "$", pais: "🇨🇴" },
  { code: "MXN", label: "Peso mexicano", simbolo: "$", pais: "🇲🇽" },
  { code: "ARS", label: "Peso argentino", simbolo: "$", pais: "🇦🇷" },
  { code: "USD", label: "Dólar americano", simbolo: "$", pais: "🇺🇸" },
  { code: "EUR", label: "Euro", simbolo: "€", pais: "🇪🇺" },
  { code: "PEN", label: "Sol peruano", simbolo: "S/", pais: "🇵🇪" },
  { code: "CLP", label: "Peso chileno", simbolo: "$", pais: "🇨🇱" },
  { code: "BRL", label: "Real brasileño", simbolo: "R$", pais: "🇧🇷" },
];

function SeccionPerfil({ titulo, children }) {
  return (
    <div className="bg-ak-gray rounded-xl border border-ak-gray2 p-6">
      <h2 className="text-sm font-semibold text-ak-red uppercase tracking-wide mb-4">
        {titulo}
      </h2>
      {children}
    </div>
  );
}

export default function Perfil() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  // ─── Contraseña ─────────────────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });
  const [loadingPass, setLoadingPass] = useState(false);
  const [errorPass, setErrorPass] = useState("");
  const [successPass, setSuccessPass] = useState("");

  // ─── Moneda ─────────────────────────────────────────────────────────────
  const [monedaSel, setMonedaSel] = useState(user?.moneda || "COP");
  const [loadingMoneda, setLoadingMoneda] = useState(false);
  const [errorMoneda, setErrorMoneda] = useState("");
  const [successMoneda, setSuccessMoneda] = useState("");

  // ─── Eliminar cuenta ────────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState("");

  const handlePassword = async (e) => {
    e.preventDefault();
    setErrorPass("");
    setSuccessPass("");
    if (passwordForm.nueva !== passwordForm.confirmar)
      return setErrorPass("Las contraseñas nuevas no coinciden");
    if (passwordForm.nueva.length < 6)
      return setErrorPass("Mínimo 6 caracteres");
    setLoadingPass(true);
    try {
      await api.put("/auth/password", {
        passwordActual: passwordForm.actual,
        passwordNueva: passwordForm.nueva,
      });
      setSuccessPass("Contraseña actualizada correctamente");
      setPasswordForm({ actual: "", nueva: "", confirmar: "" });
    } catch (err) {
      setErrorPass(err.response?.data?.error || "Error al actualizar");
    } finally {
      setLoadingPass(false);
    }
  };

  const handleMoneda = async () => {
    setErrorMoneda("");
    setSuccessMoneda("");
    if (monedaSel === user?.moneda)
      return setErrorMoneda("Ya tienes esa moneda seleccionada");
    setLoadingMoneda(true);
    try {
      const res = await api.put("/auth/moneda", { moneda: monedaSel });
      // ✅ Actualizar el usuario en el contexto
      setUser(res.data);
      setSuccessMoneda("Moneda actualizada correctamente");
    } catch (err) {
      setErrorMoneda(err.response?.data?.error || "Error al actualizar");
    } finally {
      setLoadingMoneda(false);
    }
  };

  const handleEliminar = async () => {
    setErrorDelete("");
    if (confirmDelete !== user?.nombre && confirmDelete !== user?.email)
      return setErrorDelete(
        "Escribe tu nombre de usuario o email para confirmar",
      );
    setLoadingDelete(true);
    try {
      await api.delete("/auth/cuenta");
      logout();
      navigate("/login");
    } catch (err) {
      setErrorDelete(
        err.response?.data?.error || "Error al eliminar la cuenta",
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h1 className="text-xl font-semibold text-ak-white">Mi perfil</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configuración y preferencias de tu cuenta
        </p>
      </div>

      {/* Info de la cuenta */}
      <SeccionPerfil titulo="Información de la cuenta">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ak-red flex items-center justify-center text-2xl font-bold text-white">
            {user?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-base font-medium text-ak-white">
              {user?.nombre}
            </p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              Moneda actual:{" "}
              <span className="text-ak-gold">{user?.moneda || "COP"}</span>
            </p>
          </div>
        </div>
      </SeccionPerfil>

      {/* ✅ Moneda */}
      <SeccionPerfil titulo="Moneda">
        <p className="text-xs text-gray-500 mb-4">
          Selecciona la moneda con la que registras tus finanzas.
        </p>

        {errorMoneda && (
          <div className="bg-red-950 border border-ak-red text-red-300 text-xs rounded-lg px-3 py-2 mb-3">
            {errorMoneda}
          </div>
        )}
        {successMoneda && (
          <div className="bg-green-950 border border-green-700 text-green-300 text-xs rounded-lg px-3 py-2 mb-3">
            {successMoneda}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          {MONEDAS.map((m) => (
            <button
              key={m.code}
              type="button"
              onClick={() => setMonedaSel(m.code)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                monedaSel === m.code
                  ? "border-ak-red bg-ak-red-dark text-ak-white"
                  : "border-ak-gray2 bg-ak-gray2 text-gray-400 hover:border-ak-red hover:text-ak-white"
              }`}
            >
              <span className="text-base">{m.pais}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-xs">{m.code}</span>
                <span className="text-xs opacity-70">{m.label}</span>
              </div>
              {monedaSel === m.code && (
                <span className="ml-auto text-ak-red text-xs">✓</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleMoneda}
          disabled={loadingMoneda || monedaSel === user?.moneda}
          className="w-full bg-ak-red hover:bg-ak-red-dark text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loadingMoneda ? "Guardando..." : "Guardar moneda"}
        </button>
      </SeccionPerfil>

      {/* Cambiar contraseña */}
      <SeccionPerfil titulo="Cambiar contraseña">
        <form onSubmit={handlePassword} className="flex flex-col gap-3">
          {errorPass && (
            <div className="bg-red-950 border border-ak-red text-red-300 text-xs rounded-lg px-3 py-2">
              {errorPass}
            </div>
          )}
          {successPass && (
            <div className="bg-green-950 border border-green-700 text-green-300 text-xs rounded-lg px-3 py-2">
              {successPass}
            </div>
          )}
          {[
            { name: "actual", label: "Contraseña actual" },
            { name: "nueva", label: "Nueva contraseña" },
            { name: "confirmar", label: "Confirmar nueva" },
          ].map((campo) => (
            <div key={campo.name} className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">{campo.label}</label>
              <input
                type="password"
                value={passwordForm[campo.name]}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    [campo.name]: e.target.value,
                  }))
                }
                placeholder="••••••••"
                className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-red rounded-lg px-3 py-2 text-sm text-ak-white outline-none"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loadingPass}
            className="bg-ak-red hover:bg-ak-red-dark text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50 mt-1"
          >
            {loadingPass ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
      </SeccionPerfil>

      {/* Zona de peligro */}
      <SeccionPerfil titulo="⚠️ Zona de peligro">
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Eliminar tu cuenta es una acción{" "}
          <strong className="text-ak-red">permanente e irreversible</strong>. Se
          eliminarán todos tus registros, categorías y datos financieros.
        </p>
        {errorDelete && (
          <div className="bg-red-950 border border-ak-red text-red-300 text-xs rounded-lg px-3 py-2 mb-3">
            {errorDelete}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400">
            Escribe tu nombre de usuario o email para confirmar
          </label>
          <input
            type="text"
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            placeholder={user?.nombre || user?.email}
            className="bg-ak-gray2 border border-red-900 focus:border-ak-red rounded-lg px-3 py-2 text-sm text-ak-white outline-none"
          />
          <button
            onClick={handleEliminar}
            disabled={loadingDelete || !confirmDelete}
            className="bg-transparent border border-ak-red text-ak-red hover:bg-ak-red hover:text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-30 mt-1"
          >
            {loadingDelete
              ? "Eliminando..."
              : "Eliminar mi cuenta permanentemente"}
          </button>
        </div>
      </SeccionPerfil>
    </div>
  );
}
