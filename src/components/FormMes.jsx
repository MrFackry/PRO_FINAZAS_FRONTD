import api from "../api/axios";
import { useState, useEffect } from "react";
import { getSugerencias } from "../config/sugerencias";
import InputMoneda from "./InputMoneda";

function usePais() {
  const [pais, setPais] = useState("CO");
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => setPais(d.country_code || "CO"))
      .catch(() => setPais("CO"));
  }, []);
  return pais;
}

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

  const pais = usePais();
  const sugerencias = getSugerencias(pais);

  useEffect(() => {
    console.log("USE EFFECT DISPARADO", {
      datosIniciales,
      categorias,
      mes,
      anio,
    });

    if (!categorias || categorias.length === 0) return;

    if (datosIniciales) {
      console.log("CARGANDO DATOS EXISTENTES");

      setIngresos(datosIniciales.ingresos || "");
      setAhorros(datosIniciales.ahorros || "");

      console.log(
        "DETALLE COMPLETO",
        JSON.stringify(datosIniciales.gastos_detalle, null, 2),
      );

      const gastosMap = {};

      datosIniciales.gastos_detalle?.forEach((g) => {
        const categoriaId = g.categoria_id || g.categorias?.id;

        gastosMap[categoriaId] = {
          monto: g.monto,
          nota: g.nota || "",
        };
      });
      console.log("GASTOS MAP", gastosMap);
      console.log("GASTOS DETALLE", datosIniciales.gastos_detalle);
      setGastos(
        categorias.map((c) => ({
          categoria_id: c.id,
          monto: gastosMap[c.id]?.monto ?? "",
          nota: gastosMap[c.id]?.nota ?? "",
        })),
      );
    } else {
      console.log("MES NUEVO");

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
  }, [datosIniciales, categorias, mes, anio]);

  console.log("FORM RENDER", {
    ingresos,
    ahorros,
    gastos,
    datosIniciales,
    mes,
    anio,
  });

  const totalGastos = gastos.reduce((s, g) => s + (Number(g.monto) || 0), 0);
  const balance =
    (Number(ingresos) || 0) - totalGastos - (Number(ahorros) || 0);

  const actualizarGasto = (idx, campo, valor) =>
    setGastos((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, [campo]: valor } : g)),
    );

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

      {/*  Ingresos y Ahorros — solo InputMoneda, sin duplicados */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Ingresos</label>
          <InputMoneda
            value={ingresos}
            onChange={setIngresos}
            placeholder="0"
            className="bg-ak-gray2 border border-ak-gray2 focus:border-green-500 rounded-lg px-3 py-2 text-sm text-ak-white outline-none"
          />
          <div className="flex gap-1 flex-wrap mt-1">
            {sugerencias.map((s) => (
              <button
                key={s.valor}
                type="button"
                onClick={() => setIngresos(s.valor)}
                className="text-xs bg-ak-gray2 hover:bg-ak-red text-gray-400 hover:text-white rounded px-2 py-1 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Ahorros</label>
          <InputMoneda
            value={ahorros}
            onChange={setAhorros}
            placeholder="0"
            className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-gold rounded-lg px-3 py-2 text-sm text-ak-white outline-none"
          />
        </div>
      </div>

      {/* Gastos por categoría */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Gastos</p>
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
                <InputMoneda
                  value={gasto.monto}
                  onChange={(val) => actualizarGasto(idx, "monto", val)}
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
          className={`text-base font-semibold ${balance >= 0 ? "text-green-400" : "text-ak-red"}`}
        >
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
