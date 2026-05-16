export default function MetricCard({
  titulo,
  valor,
  tipo = "neutro",
  subtitulo,
}) {
  const colores = {
    positivo: "text-green-400",
    negativo: "text-ak-red",
    neutro: "text-ak-gold",
    info: "text-blue-400",
  };

  const formato = (v) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(v ?? 0);

  return (
    <div className="bg-ak-gray rounded-xl border border-ak-gray2 p-4 flex flex-col gap-1">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{titulo}</p>
      <p className={`text-xl font-semibold ${colores[tipo]}`}>
        {formato(valor)}
      </p>
      {subtitulo && <p className="text-xs text-gray-500">{subtitulo}</p>}
    </div>
  );
}
