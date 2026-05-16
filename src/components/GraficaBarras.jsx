import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function GraficaBarras({ meses }) {
  if (!meses || meses.length === 0)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">Sin datos históricos</p>
      </div>
    );

  const formato = (v) =>
    new Intl.NumberFormat("es-CO", {
      notation: "compact",
      compactDisplay: "short",
    }).format(v);

  const formatoTooltip = (v) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(v);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={meses}
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
        <XAxis
          dataKey="mes"
          tick={{ fill: "#9CA3AF", fontSize: 11 }}
          axisLine={{ stroke: "#2D2D2D" }}
        />
        <YAxis
          tickFormatter={formato}
          tick={{ fill: "#9CA3AF", fontSize: 11 }}
          axisLine={{ stroke: "#2D2D2D" }}
        />
        <Tooltip
          formatter={(v, name) => [formatoTooltip(v), name]}
          contentStyle={{
            background: "#1A1A1A",
            border: "1px solid #2D2D2D",
            borderRadius: 8,
          }}
          labelStyle={{ color: "#F0F0F0" }}
          itemStyle={{ color: "#F0F0F0" }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }} />
        <Bar
          dataKey="ingresos"
          name="Ingresos"
          fill="#2D5A1B"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="total_gastos"
          name="Gastos"
          fill="#CC0000"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="ahorros"
          name="Ahorros"
          fill="#C9A84C"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
