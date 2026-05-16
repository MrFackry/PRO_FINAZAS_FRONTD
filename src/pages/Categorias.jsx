import { useState, useEffect } from "react";
import api from "../api/axios";

const ICONOS = [
  "🏠",
  "🛒",
  "🚗",
  "🏥",
  "💡",
  "🎮",
  "📦",
  "🐾",
  "👕",
  "🍔",
  "💊",
  "📱",
  "✈️",
  "🎓",
  "💰",
  "🏋️",
];

function ModalCategoria({ categoria, onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    nombre: categoria?.nombre || "",
    tipo: categoria?.tipo || "variable",
    icono: categoria?.icono || "📦",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGuardar = async () => {
    if (!form.nombre.trim()) return setError("El nombre es requerido");
    setLoading(true);
    setError("");
    try {
      if (categoria) {
        const res = await api.put(`/categorias/${categoria.id}`, form);
        onGuardar(res.data, "editar");
      } else {
        const res = await api.post("/categorias", form);
        onGuardar(res.data, "crear");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-ak-gray border border-ak-gray2 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ak-white">
            {categoria ? "Editar categoría" : "Nueva categoría"}
          </h2>
          <button
            onClick={onCerrar}
            className="text-gray-500 hover:text-ak-white text-lg"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-950 border border-ak-red text-red-300 text-xs rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            placeholder="Ej: Arriendo"
            className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-red rounded-lg px-3 py-2 text-sm text-ak-white outline-none"
          />
        </div>

        {/* Tipo */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Tipo</label>
          <div className="flex gap-2">
            {["fijo", "variable"].map((t) => (
              <button
                key={t}
                onClick={() => setForm((p) => ({ ...p, tipo: t }))}
                className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                  form.tipo === t
                    ? "bg-ak-red text-white"
                    : "bg-ak-gray2 text-gray-400 hover:text-ak-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Ícono */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400">Ícono</label>
          <div className="grid grid-cols-8 gap-1">
            {ICONOS.map((ic) => (
              <button
                key={ic}
                onClick={() => setForm((p) => ({ ...p, icono: ic }))}
                className={`text-lg p-1 rounded-lg transition-colors ${
                  form.icono === ic
                    ? "bg-ak-red"
                    : "bg-ak-gray2 hover:bg-ak-gray2"
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={onCerrar}
            className="flex-1 bg-ak-gray2 hover:bg-ak-gray text-gray-400 rounded-lg py-2 text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="flex-1 bg-ak-red hover:bg-ak-red-dark text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'nueva' | categoria
  const [eliminando, setEliminando] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categorias");
      setCategorias(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardado = (data, tipo) => {
    if (tipo === "crear") {
      setCategorias((prev) => [...prev, data]);
    } else {
      setCategorias((prev) => prev.map((c) => (c.id === data.id ? data : c)));
    }
    setModal(null);
  };

  const handleDesactivar = async (id) => {
    setError("");
    setEliminando(id);
    try {
      await api.delete(`/categorias/${id}`);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(
        err.response?.data?.error || "No se puede eliminar esta categoría",
      );
    } finally {
      setEliminando(null);
    }
  };

  const fijas = categorias.filter((c) => c.tipo === "fijo");
  const variables = categorias.filter((c) => c.tipo === "variable");

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ak-white">Categorías</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Personaliza en qué gastas tu dinero
          </p>
        </div>
        <button
          onClick={() => setModal("nueva")}
          className="bg-ak-red hover:bg-ak-red-dark text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          + Nueva categoría
        </button>
      </div>

      {error && (
        <div className="bg-red-950 border border-ak-red text-red-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-ak-gray rounded-xl h-14 animate-pulse border border-ak-gray2"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Fijas */}
          {fijas.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Fijas ({fijas.length})
              </p>
              {fijas.map((cat) => (
                <CategoriaRow
                  key={cat.id}
                  categoria={cat}
                  onEditar={() => setModal(cat)}
                  onEliminar={() => handleDesactivar(cat.id)}
                  eliminando={eliminando === cat.id}
                />
              ))}
            </div>
          )}

          {/* Variables */}
          {variables.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Variables ({variables.length})
              </p>
              {variables.map((cat) => (
                <CategoriaRow
                  key={cat.id}
                  categoria={cat}
                  onEditar={() => setModal(cat)}
                  onEliminar={() => handleDesactivar(cat.id)}
                  eliminando={eliminando === cat.id}
                />
              ))}
            </div>
          )}

          {categorias.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">
              No tienes categorías aún.{" "}
              <button
                onClick={() => setModal("nueva")}
                className="text-ak-red hover:underline"
              >
                Crea la primera
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modal && (
        <ModalCategoria
          categoria={modal === "nueva" ? null : modal}
          onGuardar={handleGuardado}
          onCerrar={() => setModal(null)}
        />
      )}
    </div>
  );
}

function CategoriaRow({ categoria, onEditar, onEliminar, eliminando }) {
  return (
    <div className="bg-ak-gray border border-ak-gray2 rounded-xl px-4 py-3 flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <span className="text-xl">{categoria.icono}</span>
        <div>
          <p className="text-sm text-ak-white">{categoria.nombre}</p>
          <p className="text-xs text-gray-500 capitalize">{categoria.tipo}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEditar}
          className="text-xs text-gray-400 hover:text-ak-white bg-ak-gray2 rounded-lg px-3 py-1.5 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={onEliminar}
          disabled={eliminando}
          className="text-xs text-gray-400 hover:text-ak-red bg-ak-gray2 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
        >
          {eliminando ? "..." : "Eliminar"}
        </button>
      </div>
    </div>
  );
}
