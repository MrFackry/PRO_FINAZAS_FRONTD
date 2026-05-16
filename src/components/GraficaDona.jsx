import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORES = [
  "#CC0000",
  "#8B0000",
  "#C9A84C",
  "#2D5A1B",
  "#1A4A6B",
  "#6B3A1A",
  "#4A1A6B",
  "#1A6B4A",
];

export default function GraficaDona({ gastos, loading }) {
  // ✅ Mientras carga mostrar skeleton
  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 text-sm animate-pulse">Cargando...</p>
      </div>
    );

  // ✅ Filtrar gastos con monto > 0 y normalizar la key de categorias
  const data = (gastos || [])
    .filter((g) => Number(g.monto) > 0)
    .map((g) => {
      const cat = g.categorias || g.categoria || {};
      return {
        name: cat.nombre || "Sin categoría",
        icono: cat.icono || "📦",
        value: Number(g.monto),
      };
    });

  if (data.length === 0)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">Sin gastos registrados</p>
      </div>
    );

  const formato = (v) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(v);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius="55%"
          outerRadius="75%"
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORES[i % COLORES.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => formato(v)}
          contentStyle={{
            background: "#1A1A1A",
            border: "1px solid #2D2D2D",
            borderRadius: 8,
          }}
          labelStyle={{ color: "#F0F0F0" }}
          itemStyle={{ color: "#F0F0F0" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
