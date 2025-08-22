import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import BackendGame from "./BackendGame.jsx";
import FrontendShowcase from "./FrontendShowcase.jsx";
import FrontendStart from "./pages/FrontendStart.jsx";
import Videos from "./pages/Videos.jsx";
import RouterSetup from "./pages/RouterSetup.jsx";
import logo from "./programacion-logo-transparent.png";
import ThemeToggleButton from "./components/ThemeToggleButton.jsx";


/* Drawer genérico */
function Drawer({ open, onClose, title = "Menú", children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => (document.body.style.overflow = prev || "");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelector("button, a, input, [tabindex]");
      focusable?.focus?.();
    }
  }, [open]);

  return (
    <>
      <div
        className={
          "fixed inset-0 z-40 bg-black/50 transition-opacity " +
          (open ? "opacity-100" : "opacity-0 pointer-events-none")
        }
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={
          "fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-slate-900 " +
          "border-r border-slate-200 dark:border-slate-800 shadow-2xl " +
          "transform transition-transform duration-300 " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <img src={logo} alt="Logo" className="h-9 w-9 rounded-lg object-contain" />
            <span className="hidden md:inline font-semibold truncate text-slate-900 dark:text-slate-100">
              Builder • Express + MongoDB + React
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md border bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        <div className="p-3">{children}</div>
      </aside>
    </>
  );
}

/* Shell (navbar + drawer + contenido) */
function Shell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  const [tab, setTab] = useState("backend"); // backend | frontend | videos
  const [frontSub, setFrontSub] = useState("inicio"); // inicio | componentes
  const [openSub, setOpenSub] = useState(false); // submenú desktop
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
    setMobileSubOpen(false);
    setOpenSub(false);
  }, [location.pathname]);

  const goFrontend = (sub) => {
    setTab("frontend");
    setFrontSub(sub);
    setOpenSub(false);
    setMobileSubOpen(false);
    setDrawerOpen(false);
  };
  const goTab = (name) => {
    setTab(name);
    setOpenSub(false);
    setDrawerOpen(false);
    setMobileSubOpen(false);
  };

  const Brand = (
    <Link
      to="/"
      className="flex items-center gap-2 sm:gap-3 min-w-0"
      aria-label="Inicio"
      onClick={() => {
        setTab("backend");
        setFrontSub("inicio");
      }}
    >
      <img
        src={logo}
        alt="Logo"
        className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg object-contain shrink-0"
        loading="eager"
        decoding="async"
      />
      <h1 className="hidden md:block truncate md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Builder • Express + MongoDB + React
      </h1>
    </Link>
  );

  const btnBase =
    "px-3 py-2 text-sm rounded-lg border transition hover:bg-slate-50 dark:hover:bg-slate-800/80";
  const btnSolid = "bg-indigo-600 text-white border-indigo-600";
  const btnGhost = "bg-white/80 dark:bg-slate-800/70 dark:text-slate-100";

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800">
        <nav className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          {Brand}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => goTab("backend")} className={`${btnBase} ${tab === "backend" ? btnSolid : btnGhost}`}>
              Backend
            </button>
            <div className="relative">
              <button
                onClick={() => {
                  if (tab !== "frontend") {
                    setTab("frontend"); setFrontSub("inicio");
                  }
                  setOpenSub((o) => !o);
                }}
                onBlur={() => setTimeout(() => setOpenSub(false), 150)}
                className={`${btnBase} inline-flex items-center gap-1 ${tab === "frontend" ? btnSolid : btnGhost}`}
                aria-haspopup="menu"
                aria-expanded={openSub}
                aria-controls="frontend-submenu-desktop"
              >
                Frontend <span className="text-xs">{openSub ? "▲" : "▼"}</span>
              </button>
              {openSub && (
                <div id="frontend-submenu-desktop" role="menu"
                     className="absolute right-0 mt-2 w-56 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-700 shadow-xl p-1">
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => goFrontend("inicio")}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            frontSub === "inicio" ? "bg-indigo-600 text-white"
                              : "text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70"}`}>
                    Inicio (crear proyecto)
                  </button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => goFrontend("componentes")}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            frontSub === "componentes" ? "bg-indigo-600 text-white"
                              : "text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70"}`}>
                    Componentes (showcase)
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => goTab("videos")} className={`${btnBase} ${tab === "videos" ? btnSolid : btnGhost}`}>
              Videos
            </button>
            <Link to="/router-setup" className={`${btnBase} ${btnGhost}`}>Guía Router</Link>
            <ThemeToggleButton className="ml-1" />
          </div>
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg border bg-white/80 dark:bg-slate-800/70 p-2"
            aria-label="Abrir menú" aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            {drawerOpen ? "✕" : "☰"}
          </button>
        </nav>
      </header>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Menú principal">
        <div className="flex flex-col gap-2">
          <button onClick={() => goTab("backend")}
                  className={`px-3 py-2 rounded-lg border text-sm ${tab === "backend" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white/80 dark:bg-slate-800/70 dark:text-slate-100"}`}>
            Backend
          </button>

          <div className="border rounded-lg overflow-hidden dark:border-slate-700">
            <button
              onClick={() => { if (tab !== "frontend") { setTab("frontend"); setFrontSub("inicio"); } setMobileSubOpen((o) => !o); }}
              className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between ${
                tab === "frontend" ? "bg-indigo-600 text-white" : "bg-white/80 dark:bg-slate-800/70 dark:text-slate-100"}`}
              aria-haspopup="menu" aria-expanded={mobileSubOpen} aria-controls="frontend-submenu-mobile">
              <span>Frontend</span><span className="text-xs">{mobileSubOpen ? "▲" : "▼"}</span>
            </button>
            {mobileSubOpen && (
              <div id="frontend-submenu-mobile" className="p-2 bg-white/70 dark:bg-slate-900/60">
                <button onClick={() => goFrontend("inicio")}
                        className={`w-full text-left px-3 py-2 rounded-md border text-sm mb-2 ${
                          frontSub === "inicio" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 dark:text-slate-100"}`}>
                  Inicio (crear proyecto)
                </button>
                <button onClick={() => goFrontend("componentes")}
                        className={`w-full text-left px-3 py-2 rounded-md border text-sm ${
                          frontSub === "componentes" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 dark:text-slate-100"}`}>
                  Componentes (showcase)
                </button>
              </div>
            )}
          </div>

          <button onClick={() => goTab("videos")}
                  className={`px-3 py-2 rounded-lg border text-sm ${tab === "videos" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white/80 dark:bg-slate-800/70 dark:text-slate-100"}`}>
            Videos
          </button>

          <Link to="/router-setup"
                className="px-3 py-2 rounded-lg border text-sm bg-white/80 dark:bg-slate-800/70 dark:text-slate-100"
                onClick={() => setDrawerOpen(false)}>
            Guía Router
          </Link>

          <ThemeToggleButton />
        </div>
      </Drawer>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
        <div className="grid grid-cols-1 gap-4">
          {tab === "backend" && <BackendGame />}
          {tab === "frontend" && (<>{frontSub === "inicio" ? <FrontendStart /> : <FrontendShowcase />}</>)}
          {tab === "videos" && <Videos />}
        </div>
      </main>
    </div>
  );
}

/* Rutas reales */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell />} />
      <Route path="/router-setup" element={<RouterSetup />} />
      <Route path="*" element={<Shell />} />
    </Routes>
  );
}
