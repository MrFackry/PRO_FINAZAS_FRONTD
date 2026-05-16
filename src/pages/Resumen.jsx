import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import GraficaBarras from "../components/GraficaBarras";
import GraficaLinea from "../components/GraficaLinea";

export default function Resumen() {
  const { anio } = useParams();
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/resumen/${anio}`)
      .then((res) => setDatos(res.data))
      .catch(() => setError("No hay datos para este año"))
      .finally(() => setLoading(false));
  }, [anio]);

  const formato = (v) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(v ?? 0);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-ak-red animate-pulse">Cargando resumen...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-ak-white">
          Resumen anual — {anio}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {datos?.meses?.length} mes(es) registrados
        </p>
      </div>

      {/* Métricas anuales */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            titulo: "Total ingresos",
            valor: datos?.total_ingresos,
            tipo: "positivo",
          },
          {
            titulo: "Total gastos",
            valor: datos?.total_gastos,
            tipo: "negativo",
          },
          {
            titulo: "Total ahorros",
            valor: datos?.total_ahorros,
            tipo: "neutro",
          },
          {
            titulo: "Balance anual",
            valor: datos?.balance_anual,
            tipo: datos?.balance_anual >= 0 ? "positivo" : "negativo",
          },
        ].map((m) => (
          <div
            key={m.titulo}
            className="bg-ak-gray rounded-xl border border-ak-gray2 p-4"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {m.titulo}
            </p>
            <p
              className={`text-xl font-semibold mt-1 ${
                m.tipo === "positivo"
                  ? "text-green-400"
                  : m.tipo === "negativo"
                    ? "text-ak-red"
                    : "text-ak-gold"
              }`}
            >
              {formato(m.valor)}
            </p>
          </div>
        ))}
      </div>

      {/* Mejor y peor mes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-ak-gray rounded-xl border border-green-900 p-4">
          <p className="text-xs text-green-500 uppercase tracking-wide mb-1">
            🏆 Mejor mes
          </p>
          <p className="text-base font-semibold text-ak-white">
            {datos?.mejor_mes?.mes}
          </p>
          <p className="text-sm text-green-400">
            {formato(datos?.mejor_mes?.balance)}
          </p>
        </div>
        <div className="bg-ak-gray rounded-xl border border-red-900 p-4">
          <p className="text-xs text-ak-red uppercase tracking-wide mb-1">
            📉 Peor mes
          </p>
          <p className="text-base font-semibold text-ak-white">
            {datos?.peor_mes?.mes}
          </p>
          <p className="text-sm text-ak-red">
            {formato(datos?.peor_mes?.balance)}
          </p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-ak-gray rounded-xl border border-ak-gray2 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
            Ingresos vs Gastos vs Ahorros
          </p>
          <div className="h-56">
            <GraficaBarras meses={datos?.meses} />
          </div>
        </div>
        <div className="bg-ak-gray rounded-xl border border-ak-gray2 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
            Evolución del balance
          </p>
          <div className="h-56">
            <GraficaLinea meses={datos?.meses} />
          </div>
        </div>
      </div>

      {/* Top categorías */}
      <div className="bg-ak-gray rounded-xl border border-ak-gray2 p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">
          Top categorías del año
        </p>
        <div className="flex flex-col gap-2">
          {datos?.gastos_por_categoria?.map((cat, i) => {
            const pct =
              datos.total_gastos > 0
                ? (cat.total / datos.total_gastos) * 100
                : 0;
            return (
              <div key={cat.nombre} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                <span className="text-base w-6">{cat.icono}</span>
                <span className="text-sm text-ak-white w-28">{cat.nombre}</span>
                <div className="flex-1 bg-ak-gray2 rounded-full h-1.5">
                  <div
                    className="bg-ak-red h-1.5 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-20 text-right">
                  {formato(cat.total)}
                </span>
                <span className="text-xs text-gray-600 w-10 text-right">
                  {pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
