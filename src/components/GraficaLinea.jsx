import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

export default function GraficaLinea({ meses }) {
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
      <LineChart
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
          formatter={(v) => [formatoTooltip(v), "Balance"]}
          contentStyle={{
            background: "#1A1A1A",
            border: "1px solid #2D2D2D",
            borderRadius: 8,
          }}
          labelStyle={{ color: "#F0F0F0" }}
          itemStyle={{ color: "#F0F0F0" }}
        />
        <ReferenceLine y={0} stroke="#CC0000" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#3B82F6"
          strokeWidth={2.5}
          dot={{ fill: "#3B82F6", r: 4 }}
          activeDot={{ r: 6 }}
          name="Balance"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
