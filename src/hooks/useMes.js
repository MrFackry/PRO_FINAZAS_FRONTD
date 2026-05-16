import { useState, useEffect } from "react";
import api from "../api/axios";

export function useMes(mes, anio) {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mes || !anio) return;

    setLoading(true);
    setError(null);
    setDatos(null); //Limpiar datos anteriores al cambiar mes

    api
      .get(`/meses/${mes}/${anio}`)
      .then((res) => setDatos(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setDatos(null);
        else setError("Error al cargar los datos");
      })
      .finally(() => setLoading(false));
  }, [mes, anio]);

  return { datos, loading, error, setDatos };
}
