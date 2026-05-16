const MESES = [
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

export default function SelectorMes({ mes, anio, onChange }) {
  const anios = [2024, 2025, 2026, 2027];

  return (
    <div className="flex items-center gap-3">
      <select
        value={mes}
        onChange={(e) => onChange(e.target.value, anio)}
        className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-red text-ak-white rounded-lg px-3 py-2 text-sm outline-none"
      >
        {MESES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={anio}
        onChange={(e) => onChange(mes, Number(e.target.value))}
        className="bg-ak-gray2 border border-ak-gray2 focus:border-ak-red text-ak-white rounded-lg px-3 py-2 text-sm outline-none"
      >
        {anios.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}
