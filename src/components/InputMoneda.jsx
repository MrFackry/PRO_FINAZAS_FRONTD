import { useState, useEffect } from "react";

export default function InputMoneda({
  value,
  onChange,
  placeholder = "0",
  className = "",
}) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (value === "" || value === null || value === undefined) {
      setDisplay("");
    } else {
      setDisplay(formatear(Number(value)));
    }
  }, [value]);

  // Formatear número con puntos de miles
  const formatear = (num) => {
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleChange = (e) => {
    const raw = e.target.value;

    // Quitar todo lo que no sea dígito
    const soloNumeros = raw.replace(/\D/g, "");

    if (soloNumeros === "") {
      setDisplay("");
      onChange("");
      return;
    }

    const numero = Number(soloNumeros);
    setDisplay(formatear(numero));
    onChange(numero); // Enviar número limpio al padre
  };

  return (
    <input
      type="text"
      inputMode="numeric" // Teclado numérico en móvil
      value={display}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
