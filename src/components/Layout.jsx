import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const anioActual = new Date().getFullYear();

  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
    navigate("/login");
  };

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/historial", label: "Historial" },
    { path: "/categorias", label: "Categorías" },
    { path: `/resumen/${anioActual}`, label: "Resumen" },
  ];

  return (
    <div className="min-h-screen bg-ak-black text-ak-white">
      {/* Navbar */}
      <nav className="bg-ak-black border-b border-ak-red px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <span className="text-ak-red font-bold text-lg tracking-wide">
          FinanzasPro
        </span>

        {/* Links de navegación */}
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm transition-colors ${
                location.pathname === link.path
                  ? "text-ak-red border-b-2 border-ak-red pb-0.5"
                  : "text-gray-400 hover:text-ak-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Usuario y logout —  separados correctamente */}
        <div className="flex items-center gap-3">
          {/* Avatar + nombre → navega a perfil */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/perfil")}
          >
            <div className="w-7 h-7 rounded-full bg-ak-red hover:bg-ak-red-dark flex items-center justify-center text-xs font-bold transition-colors">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-400 hover:text-ak-white transition-colors">
              {user?.nombre}
            </span>
          </div>

          {/*  Botón salir separado — no hereda el onClick del div */}
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-ak-red transition-colors border-l border-ak-gray2 pl-3 ml-1"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
