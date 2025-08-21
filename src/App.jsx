// src/App.jsx
import React, { useEffect, useState } from "react";
import BackendGame from "./BackendGame.jsx";
import FrontendShowcase from "./FrontendShowcase.jsx";

export default function App() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("backend"); 

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* NAV BAR */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-indigo-600" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Builder • Express + MongoDB + React
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border bg-white/80 dark:bg-slate-800/70 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setTab("backend")}
                className={"px-3 py-1 text-sm " + (tab === "backend" ? "bg-indigo-600 text-white" : "text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80")}
              >
                Backend
              </button>
              <button
                onClick={() => setTab("frontend")}
                className={"px-3 py-1 text-sm " + (tab === "frontend" ? "bg-indigo-600 text-white" : "text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80")}
              >
                Frontend
              </button>
            </div>

            <button
              onClick={() => setDark((d) => !d)}
              className="ml-3 px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Cambiar tema"
            >
              {dark ? "☀️ Claro" : "🌙 Oscuro"}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      {tab === "backend" ? <BackendGame /> : <FrontendShowcase />}
    </div>
  );
}