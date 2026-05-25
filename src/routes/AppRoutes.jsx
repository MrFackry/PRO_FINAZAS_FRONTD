// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Categorias from "../pages/Categorias";
import Resumen from "../pages/Resumen";
import Privacidad from "../pages/Privacidad";
import Layout from "../components/Layout";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-ak-black flex items-center justify-center">
        <p className="text-ak-red animate-pulse text-lg">Cargando...</p>
      </div>
    );
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" />;
}

export default function AppRoutes() {
  const anioActual = new Date().getFullYear();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* ✅ Ruta pública — NO requiere login ni PublicRoute */}
      <Route path="/privacidad" element={<Privacidad />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/categorias"
        element={
          <PrivateRoute>
            <Layout>
              <Categorias />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path={`/resumen/:anio`}
        element={
          <PrivateRoute>
            <Layout>
              <Resumen />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
