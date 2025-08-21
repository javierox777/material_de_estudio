// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom"; // 👈 NUEVO
import BackendGame from "./BackendGame.jsx";
import FrontendShowcase from "./FrontendShowcase.jsx";
import FrontendStart from "./pages/FrontendStart.jsx";
import Videos from "./pages/Videos.jsx";
import RouterSetup from "./pages/RouterSetup.jsx"; // 👈 NUEVO
// al inicio de src/App.jsx (junto a otros imports)
import logo from "./programacion-logo-transparent.png"; // o .png /.webp


// --- Shell principal con tus pestañas (lo que ya tenías) ---
function Shell() {
  const [dark, setDark] = useState(false);

  // Pestaña principal: backend | frontend | videos
  const [tab, setTab] = useState("backend");

  // Subpestaña de frontend: inicio | componentes
  const [frontSub, setFrontSub] = useState("inicio");

  // para abrir/cerrar el submenú de Frontend
  const [openSub, setOpenSub] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // helpers
  const goFrontend = (sub) => {
    setTab("frontend");
    setFrontSub(sub);
    setOpenSub(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* NAV BAR */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800">
        <nav className="max-w-7xl mx-auto px-3 py-3 flex items-center justify-between">
          {/* Brand */}
        
{/* Brand con logo (desde src/assets) */}
<Link to="/" className="flex items-center gap-3" aria-label="Inicio">
  <img
    src={logo}
    alt="Logo"
    className="h-20 w-20 rounded-lg object-contain"
    loading="eager"
    decoding="async"
  />
  <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
    Builder • Express + MongoDB + React
  </h1>
</Link>


          {/* Menú principal */}
          <div className="flex items-center gap-2">
            {/* Backend */}
            <button
              onClick={() => setTab("backend")}
              className={
                "px-3 py-1 text-sm rounded-lg border " +
                (tab === "backend"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80")
              }
            >
              Backend
            </button>

            {/* Frontend (con submenú) */}
            <div className="relative">
              <button
                onClick={() => {
                  if (tab !== "frontend") {
                    setTab("frontend");
                    setFrontSub("inicio");
                  }
                  setOpenSub((o) => !o);
                }}
                onBlur={() => setTimeout(() => setOpenSub(false), 150)}
                className={
                  "px-3 py-1 text-sm rounded-lg border inline-flex items-center gap-1 " +
                  (tab === "frontend"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80")
                }
                aria-haspopup="menu"
                aria-expanded={openSub}
              >
                Frontend
                <span className="text-xs">{openSub ? "▲" : "▼"}</span>
              </button>

              {/* Submenú */}
              {openSub && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-700 shadow-xl p-1"
                >
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goFrontend("inicio")}
                    className={
                      "w-full text-left px-3 py-2 rounded-md text-sm " +
                      (frontSub === "inicio"
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-100")
                    }
                  >
                    Inicio (crear proyecto)
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goFrontend("componentes")}
                    className={
                      "w-full text-left px-3 py-2 rounded-md text-sm " +
                      (frontSub === "componentes"
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-100")
                    }
                  >
                    Componentes (showcase)
                  </button>
                </div>
              )}
            </div>

            {/* Videos */}
            <button
              onClick={() => setTab("videos")}
              className={
                "px-3 py-1 text-sm rounded-lg border " +
                (tab === "videos"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80")
              }
            >
              Videos
            </button>

            {/* 👇 NUEVO: botón que te lleva a la guía interna de React Router */}
            <Link
              to="/router-setup"
              className="px-3 py-1 text-sm rounded-lg border bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80"
              title="Ver guía de React Router dentro de la app"
            >
              Guía Router
            </Link>

            {/* Tema */}
            <button
              onClick={() => setDark((d) => !d)}
              className="ml-1 px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Cambiar tema"
            >
              {dark ? "☀️ Claro" : "🌙 Oscuro"}
            </button>
          </div>
        </nav>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {tab === "backend" && <BackendGame />}

        {tab === "frontend" && (
          <>
            {frontSub === "inicio" && <FrontendStart />}
            {frontSub === "componentes" && <FrontendShowcase />}
          </>
        )}

        {tab === "videos" && <Videos />}
      </main>
    </div>
  );
}

// --- Enrutador principal (rutas reales) ---
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell />} />
      <Route path="/router-setup" element={<RouterSetup />} />
      {/* puedes sumar más rutas aquí si lo necesitas */}
      <Route path="*" element={<Shell />} />
    </Routes>
  );
}
