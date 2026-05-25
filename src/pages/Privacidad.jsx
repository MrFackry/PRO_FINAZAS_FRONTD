import { useNavigate } from "react-router-dom";
export default function Privacidad() {
  const navigate = useNavigate();

  const secciones = [
    {
      titulo: "1. Quiénes somos",
      contenido: `FinanzasPro es una aplicación de gestión financiera personal. 
      El responsable del tratamiento de tus datos es el administrador de la plataforma. 
      Si tienes preguntas sobre esta política puedes contactarnos en: 
      daniel.d.arcos05@gmail.com`,
    },
    {
      titulo: "2. Qué datos recopilamos",
      contenido: `Recopilamos únicamente los datos que tú mismo ingresas:
      • Nombre y correo electrónico (para tu cuenta)
      • Datos financieros: ingresos, gastos por categoría y ahorros mensuales
      • Categorías de gastos personalizadas
      
      No recopilamos datos de navegación, ubicación, ni información de dispositivos.`,
    },
    {
      titulo: "3. Para qué usamos tus datos",
      contenido: `Tus datos se usan exclusivamente para:
      • Mostrarte tu propio resumen financiero
      • Calcular tu balance y disponible acumulado
      • Generar tus gráficas y reportes personales
      
      Nunca usamos tus datos para publicidad, análisis de mercado 
      ni los compartimos con terceros bajo ninguna circunstancia.`,
    },
    {
      titulo: "4. Cómo protegemos tus datos",
      contenido: `Aplicamos las siguientes medidas de seguridad:
      • Todos los montos financieros se almacenan encriptados con AES-256
      • Las contraseñas se almacenan con hash bcrypt 
      • La comunicación entre tu navegador y nuestros servidores usa HTTPS
      • Cada usuario solo puede acceder a sus propios datos 
      • Los tokens de sesión expiran automáticamente cada 7 días`,
    },
    {
      titulo: "5. Quién puede ver tus datos",
      contenido: `• Tú — eres el único que puede ver tus datos financieros
      • El administrador técnico — tiene acceso a la base de datos para 
        mantenimiento, pero los montos están encriptados y son ilegibles 
        sin la clave del servidor
      • Nadie más — no vendemos ni compartimos datos con terceros`,
    },
    {
      titulo: "6. Tus derechos",
      contenido: `Tienes derecho a:
      • Acceder a todos tus datos en cualquier momento
      • Corregir cualquier dato incorrecto
      • Eliminar tu cuenta y todos tus datos permanentemente
      • Exportar tus datos en cualquier momento
      
      Para ejercer cualquiera de estos derechos contáctanos en: 
      daniel.d.arcos05@gmail.com`,
    },
    {
      titulo: "7. Retención de datos",
      contenido: `Conservamos tus datos mientras tu cuenta esté activa. 
      Si eliminas tu cuenta, todos tus datos son eliminados permanentemente 
      de nuestros servidores en un plazo máximo de 30 días. 
      No conservamos copias de seguridad de cuentas eliminadas.`,
    },
    {
      titulo: "8. Cambios a esta política",
      contenido: `Si realizamos cambios importantes a esta política te 
      notificaremos por correo electrónico con al menos 15 días de anticipación. 
      El uso continuado de la aplicación después de ese plazo implica 
      la aceptación de los cambios.`,
    },
  ];

  return (
    <div className="min-h-screen bg-ak-black text-ak-white">
      {/* Header */}
      <div className="border-b border-ak-gray2 px-6 py-4 flex items-center justify-between">
        <span className="text-ak-red font-bold text-lg">FinanzasPro</span>
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-gray-400 hover:text-ak-white transition-colors"
        >
          ← Volver
        </button>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ak-white mb-2">
            Política de Privacidad
          </h1>
          <p className="text-sm text-gray-500">
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            En FinanzasPro nos tomamos muy en serio la privacidad de tus datos
            financieros. Esta política explica qué datos recopilamos, cómo los
            usamos y cómo los protegemos.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {secciones.map((seccion, i) => (
            <div
              key={i}
              className="bg-ak-gray rounded-xl border border-ak-gray2 p-6"
            >
              <h2 className="text-sm font-semibold text-ak-red uppercase tracking-wide mb-3">
                {seccion.titulo}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {seccion.contenido}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-600">
          FinanzasPro — Todos los derechos reservados {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
