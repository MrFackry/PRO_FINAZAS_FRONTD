import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Agregar el token automáticamente a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//  Solo redirigir al login si NO es la verificación inicial
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";

    //  Ignorar 401 de /auth/me — AuthContext lo maneja solo
    const esVerificacionInicial = url.includes("/auth/me");
    const esLogin = url.includes("/auth/login");
    const esRegister = url.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      !esVerificacionInicial &&
      !esLogin &&
      !esRegister
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
