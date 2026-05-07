import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ak-black flex items-center justify-center">
        <p className="text-ak-red animate-pulse text-lg">Cargando...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}
