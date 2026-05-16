import { useState, useEffect } from "react";
import api from "../api/axios";
import { useMes } from "../hooks/useMes";
import MetricCard from "../components/MetricCard";
import SelectorMes from "../components/SelectorMes";
import GraficaDona from "../components/GraficaDona";
import GraficaBarras from "../components/GraficaBarras";
import GraficaLinea from "../components/GraficaLinea";
import FormMes from "../components/FormMes";

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

export default function Dashboard() {
  const hoy = new Date();
  const [mes, setMes] = useState(MESES_ORDEN[hoy.getMonth()]);
  const [anio, setAnio] = useState(hoy.getFullYear());

  const { datos, loading, setDatos } = useMes(mes, anio);

  const [categorias, setCategorias] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [disponibleAcum, setDisponibleAcum] = useState(0);

  // Cargar categorías del usuario
  useEffect(() => {
    api.get("/categorias").then((res) => setCategorias(res.data));
  }, []);

  // Cargar historial del año para gráficas
  useEffect(() => {
    api.get(`/meses?anio=${anio}`).then((res) => setHistorial(res.data));
  }, [anio]);

  // Calcular disponible acumulado hasta el mes seleccionado
  useEffect(() => {
    if (historial.length === 0) return;
    const idxActual = MESES_ORDEN.indexOf(mes);
    const acum = historial
      .filter((m) => MESES_ORDEN.indexOf(m.mes) <= idxActual)
      .reduce((s, m) => s + m.balance, 0);
    setDisponibleAcum(acum);
  }, [historial, mes]);

  const handleCambioMes = (nuevoMes, nuevoAnio) => {
    setMes(nuevoMes);
    setAnio(nuevoAnio);
  };

  const handleGuardado = (nuevosDatos) => {
    setDatos(nuevosDatos);
    // Recargar historial para actualizar gráficas
    api.get(`/meses?anio=${anio}`).then((res) => setHistorial(res.data));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ak-white">Dashboard</h1>
        <SelectorMes mes={mes} anio={anio} onChange={handleCambioMes} />
      </div>

      {/* Métricas */}
      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-ak-gray rounded-xl border border-ak-gray2 p-4 h-20 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            titulo="Ingresos"
            valor={datos?.ingresos}
            tipo="positivo"
            subtitulo={mes}
          />
          <MetricCard
            titulo="Gastos"
            valor={datos?.total_gastos}
            tipo="negativo"
            subtitulo={mes}
          />
          <MetricCard
            titulo="Ahorro"
            valor={datos?.ahorros}
            tipo="neutro"
            subtitulo={mes}
          />
          <MetricCard
            titulo="Disponible acumulado"
            valor={disponibleAcum}
            tipo={disponibleAcum >= 0 ? "positivo" : "negativo"}
            subtitulo={`hasta ${mes}`}
          />
        </div>
      )}

      {/* Gráficas + Formulario */}
      <div className="grid grid-cols-3 gap-6">
        {/* Gráficas — 2/3 del ancho */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Dona */}
            <div className="bg-ak-gray rounded-xl border border-ak-gray2 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                Distribución de gastos — {mes}
              </p>
              <div className="h-56">
                {/* ✅ Pasar loading a la dona */}
                <GraficaDona gastos={datos?.gastos_detalle} loading={loading} />
              </div>
            </div>
            {/* Barras */}
            <div className="bg-ak-gray rounded-xl border border-ak-gray2 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                Ingresos vs Gastos vs Ahorros
              </p>
              <div className="h-56">
                <GraficaBarras meses={historial} />
              </div>
            </div>
          </div>

          {/* Línea */}
          <div className="bg-ak-gray rounded-xl border border-ak-gray2 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              Evolución del balance — {anio}
            </p>
            <div className="h-48">
              <GraficaLinea meses={historial} />
            </div>
          </div>
        </div>

        {/* Formulario — 1/3 del ancho */}
        <div className="col-span-1">
          {categorias.length > 0 && (
            <FormMes
              mes={mes}
              anio={anio}
              datosIniciales={datos}
              categorias={categorias}
              onGuardado={handleGuardado}
            />
          )}
        </div>
      </div>
    </div>
  );
}
