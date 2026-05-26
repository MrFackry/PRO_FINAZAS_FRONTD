export const SUGERENCIAS_INGRESOS = {
  CO: [
    { label: "Sal. mínimo", valor: 1423500 },
    { label: "2 salarios", valor: 2847000 },
    { label: "1M", valor: 1000000 },
    { label: "2M", valor: 2000000 },
    { label: "3M", valor: 3500000 },
    { label: "5M", valor: 5000000 },
    { label: "10M", valor: 10000000 },
  ],
  MX: [
    { label: "Sal. mínimo", valor: 7310 },
    { label: "Promedio", valor: 15000 },
    { label: "30K", valor: 30000 },
    { label: "50K", valor: 50000 },
  ],
  AR: [
    { label: "Sal. mínimo", valor: 202800 },
    { label: "Promedio", valor: 500000 },
    { label: "800K", valor: 800000 },
    { label: "1M", valor: 1000000 },
  ],
  DEFAULT: [
    { label: "1M", valor: 1000000 },
    { label: "2M", valor: 2000000 },
    { label: "5M", valor: 5000000 },
    { label: "10M", valor: 10000000 },
  ],
};

//Helper para obtener sugerencias por país
export const getSugerencias = (pais) =>
  SUGERENCIAS_INGRESOS[pais] || SUGERENCIAS_INGRESOS.DEFAULT;
