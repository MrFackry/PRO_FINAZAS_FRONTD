import { useState, useEffect } from "react";
import api from "../api/axios";

export default function FormMes({
  mes,
  anio,
  datosIniciales,
  categorias,
  onGuardado,
}) {
  const [ingresos, setIngresos] = useState("");
  const [ahorros, setAhorros] = useState("");
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ CORRECCIÓN — useEffect reconstruye gastos mezclando
  // datos del mes con TODAS las categorías del usuario
  useEffect(() => {
    if (!categorias || categorias.length === 0) return;

    if (datosIniciales) {
      setIngresos(datosIniciales.ingresos || "");
      setAhorros(datosIniciales.ahorros || "");

      // ✅ Mapa de gastos guardados por categoria_id
      const gastosMap = {};
      datosIniciales.gastos_detalle?.forEach((g) => {
        gastosMap[g.categoria_id] = {
          monto: g.monto,
          nota: g.nota || "",
        };
      });

      // ✅ Reconstruir con TODAS las categorías — las que
      // no tienen gasto quedan en vacío en vez de desaparecer
      setGastos(
        categorias.map((c) => ({
          categoria_id: c.id,
          monto: gastosMap[c.id]?.monto ?? "",
          nota: gastosMap[c.id]?.nota ?? "",
        })),
      );
    } else {
      // Mes nuevo — todos los campos vacíos
      setIngresos("");
      setAhorros("");
      setGastos(
        categorias.map((c) => ({
          categoria_id: c.id,
          monto: "",
          nota: "",
        })),
      );
    }
  }, [datosIniciales, mes, anio]); // ✅ Quitamos categorias de deps para evitar loop infinito

  const totalGastos = gastos.reduce((s, g) => s + (Number(g.monto) || 0), 0);
  const balance =
    (Number(ingresos) || 0) - totalGastos - (Number(ahorros) || 0);

  const actualizarGasto = (idx, campo, valor) => {
    setGastos((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, [campo]: valor } : g)),
    );
  };

  const handleGuardar = async () => {
    setError("");
    if (!ingresos) return setError("Los ingresos son requeridos");

    const gastosValidos = gastos.filter((g) => Number(g.monto) > 0);
    if (gastosValidos.length === 0) return setError("Agrega al menos un gasto");

    setLoading(true);
    try {
      const res = await api.post("/meses", {
        mes,
        anio,
        ingresos: Number(ingresos),
        ahorros: Number(ahorros || 0),
        gastos: gastosValidos,
      });
      onGuardado(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Buscar nombre e ícono directo en categorias — nunca falla
  const getCatNombre = (id) =>
    categorias.find((c) => c.id === id)?.nombre || "Sin nombre";

  const getCatIcono = (id) =>
    categorias.find((c) => c.id === id)?.icono || "📦";

  const formatoCOP = (v) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(v);

  return (
    <div className="bg-ak-gray rounded-xl border border-ak-gray2 p-6 flex flex-col gap-5">
      <h2 className="text-sm font-semibold text-ak-red uppercase tracking-wide">
        Registrar — {mes} {anio}
      </h2>

      {error && (
        <div className="bg-red-950 border border-ak-red text-red-300 text-xs rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Ingresos y Ahorros */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Ingresos</label>
          <input
            type="number"
            value={ingresos}
            onChange={(e) => setIngresos(e.target.value)}
            placeholder="0"
            className="bg-ak-gray2 border border-ak-gray2 focus:border-green-500 rounded-lg px-3 py-2 text-sm text-ak-white outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Ahorros</label>
          <input
            type="number"
            value={ahorros}
            onChange={(e) => setAhorros(e.target.value)}
            placeholder="0"
            className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-gold rounded-lg px-3 py-2 text-sm text-ak-white outline-none"
          />
        </div>
      </div>

      {/* Gastos por categoría */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Gastos</p>

        {/* ✅ Mostrar loading si categorias aún no cargaron */}
        {gastos.length === 0 ? (
          <p className="text-xs text-gray-500 py-2">Cargando categorías...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {gastos.map((gasto, idx) => (
              <div key={gasto.categoria_id} className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">
                  {getCatIcono(gasto.categoria_id)}{" "}
                  {getCatNombre(gasto.categoria_id)}
                </label>
                <input
                  type="number"
                  value={gasto.monto}
                  onChange={(e) =>
                    actualizarGasto(idx, "monto", e.target.value)
                  }
                  placeholder="0"
                  className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-red rounded-lg px-3 py-2 text-sm text-ak-white outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Balance calculado */}
      <div className="bg-ak-black rounded-lg border border-ak-gray2 px-4 py-3 flex justify-between items-center">
        <span className="text-xs text-gray-400">Balance calculado</span>
        <span
          className={`text-base font-semibold ${
            balance >= 0 ? "text-green-400" : "text-ak-red"
          }`}
        >
          {/* ✅ Mostrar 0 si no hay ingresos aún */}
          {ingresos ? formatoCOP(balance) : formatoCOP(0)}
        </span>
      </div>

      <button
        onClick={handleGuardar}
        disabled={loading}
        className="bg-ak-red hover:bg-ak-red-dark text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar mes"}
      </button>
    </div>
  );
}
