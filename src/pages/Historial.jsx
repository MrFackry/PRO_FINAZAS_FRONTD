import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const MESES_ORDEN = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function Historial() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(null);
  const [error, setError] = useState("");
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const anios = [2024, 2025, 2026, 2027];

  useEffect(() => {
    cargarHistorial();
  }, [anioFiltro]);

  const cargarHistorial = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/meses?anio=${anioFiltro}`);
      // Ordenar cronológicamente
      const ordenados = res.data.sort(
        (a, b) => MESES_ORDEN.indexOf(a.mes) - MESES_ORDEN.indexOf(b.mes),
      );
      setRegistros(ordenados);
    } catch {
      setError("Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, mes) => {
    if (
      !confirm(
        `¿Eliminar el registro de ${mes}? Esta acción no se puede deshacer.`,
      )
    )
      return;
    setEliminando(id);
    try {
      await api.delete(`/meses/${id}`);
      setRegistros((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Error al eliminar el registro");
    } finally {
      setEliminando(null);
    }
  };

  const handleEditar = (mes, anio) => {
    navigate(`/dashboard?mes=${mes}&anio=${anio}`);
  };

  const formatoCOP = (v) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(v ?? 0);

  // Totales del año filtrado
  const totalIngresos = registros.reduce((s, r) => s + (r.ingresos || 0), 0);
  const totalGastos = registros.reduce((s, r) => s + (r.total_gastos || 0), 0);
  const totalAhorros = registros.reduce((s, r) => s + (r.ahorros || 0), 0);
  const balanceAnual = registros.reduce((s, r) => s + (r.balance || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ak-white">Historial</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Todos tus registros mensuales
          </p>
        </div>
        <select
          value={anioFiltro}
          onChange={(e) => setAnioFiltro(Number(e.target.value))}
          className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-red text-ak-white rounded-lg px-3 py-2 text-sm outline-none"
        >
          {anios.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-950 border border-ak-red text-red-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Resumen del año */}
      {registros.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Total ingresos",
              valor: totalIngresos,
              color: "text-green-400",
            },
            { label: "Total gastos", valor: totalGastos, color: "text-ak-red" },
            {
              label: "Total ahorros",
              valor: totalAhorros,
              color: "text-ak-gold",
            },
            {
              label: "Balance anual",
              valor: balanceAnual,
              color: balanceAnual >= 0 ? "text-green-400" : "text-ak-red",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-ak-gray rounded-xl border border-ak-gray2 p-4"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {m.label}
              </p>
              <p className={`text-lg font-semibold mt-1 ${m.color}`}>
                {formatoCOP(m.valor)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tabla de registros */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-ak-gray rounded-xl h-16 animate-pulse border border-ak-gray2"
            />
          ))}
        </div>
      ) : registros.length === 0 ? (
        <div className="bg-ak-gray rounded-xl border border-ak-gray2 p-12 text-center">
          <p className="text-gray-500 text-sm">
            No hay registros para {anioFiltro}.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-3 text-ak-red hover:underline text-sm"
          >
            Registrar el primer mes →
          </button>
        </div>
      ) : (
        <div className="bg-ak-gray rounded-xl border border-ak-gray2 overflow-hidden">
          {/* Cabecera */}
          <div className="grid grid-cols-7 gap-4 px-5 py-3 border-b border-ak-gray2">
            {[
              "Mes",
              "Ingresos",
              "Gastos",
              "Ahorros",
              "Balance",
              "Estado",
              "",
            ].map((h) => (
              <p
                key={h}
                className="text-xs text-gray-500 uppercase tracking-wide font-medium"
              >
                {h}
              </p>
            ))}
          </div>

          {/* Filas */}
          {registros.map((r, i) => (
            <div
              key={r.id}
              className={`grid grid-cols-7 gap-4 px-5 py-4 items-center transition-colors hover:bg-ak-gray2 ${
                i < registros.length - 1 ? "border-b border-ak-gray2" : ""
              }`}
            >
              {/* Mes */}
              <p className="text-sm font-medium text-ak-white">{r.mes}</p>

              {/* Ingresos */}
              <p className="text-sm text-green-400">{formatoCOP(r.ingresos)}</p>

              {/* Gastos */}
              <p className="text-sm text-ak-red">
                {formatoCOP(r.total_gastos)}
              </p>

              {/* Ahorros */}
              <p className="text-sm text-ak-gold">{formatoCOP(r.ahorros)}</p>

              {/* Balance */}
              <p
                className={`text-sm font-medium ${
                  r.balance >= 0 ? "text-green-400" : "text-ak-red"
                }`}
              >
                {formatoCOP(r.balance)}
              </p>

              {/* Estado */}
              <span
                className={`text-xs px-2 py-1 rounded-full w-fit ${
                  r.estado === "cerrado"
                    ? "bg-green-950 text-green-400"
                    : "bg-yellow-950 text-yellow-400"
                }`}
              >
                {r.estado === "cerrado" ? "Cerrado" : "Borrador"}
              </span>

              {/* Acciones */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => handleEditar(r.mes, r.anio)}
                  className="text-xs text-gray-400 hover:text-ak-white bg-ak-gray2 hover:bg-ak-gray rounded-lg px-3 py-1.5 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(r.id, r.mes)}
                  disabled={eliminando === r.id}
                  className="text-xs text-gray-400 hover:text-ak-red bg-ak-gray2 hover:bg-ak-gray rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                >
                  {eliminando === r.id ? "..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
