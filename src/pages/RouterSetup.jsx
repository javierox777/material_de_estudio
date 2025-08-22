import React from "react";

function PreBlock({ code = "", label = "" }) {
  const [copied, setCopied] = React.useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <div className="relative rounded-xl border p-3 bg-white/80 dark:bg-slate-900/60 dark:border-slate-800">
      {!!label && (
        <div className="absolute -top-2 left-3 text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow">
          {label}
        </div>
      )}
      <pre className="mt-2 bg-slate-900 text-slate-100 text-xs p-3 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={onCopy}
        className={
          "mt-2 px-3 py-1 rounded-md border text-xs " +
          (copied
            ? "bg-emerald-600 text-white border-emerald-600"
            : "bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80")
        }
      >
        {copied ? "Copiado ✓" : "Copiar"}
      </button>
    </div>
  );
}

function Step({ title, emoji = "✅", children, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section className="rounded-2xl border dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left border-b dark:border-slate-800"
      >
        <span className="text-xl">{emoji}</span>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <span className="ml-auto text-xs text-slate-500">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </section>
  );
}

export default function RouterSetup() {
  const codeInstall = `npm i react-router-dom`;

  const codeIndexWrap = `// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);`;

  const codeAppRoutes = `// src/App.js (ejemplo básico con rutas)
import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import FrontendStart from "./pages/FrontendStart";
import RouterSetup from "./pages/RouterSetup";

function HomeNav() {
  const navigate = useNavigate();
  return (
    <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <Link to="/">Inicio</Link>
      <Link to="/router-setup">Guía Router</Link>
      <button onClick={() => navigate("/router-setup")}>Ir con useNavigate</button>
    </nav>
  );
}

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <HomeNav />
      <Routes>
        <Route path="/" element={<FrontendStart />} />
        <Route path="/router-setup" element={<RouterSetup />} />
        <Route path="*" element={<h3>404 • Ruta no encontrada</h3>} />
      </Routes>
    </div>
  );
}`;

  const codeLink = `<Link to="/router-setup">Ir a la guía</Link>`;
  const codeNav = `const navigate = useNavigate(); navigate("/router-setup");`;

  const codeExpressSpa = `// (opcional) Fallback en Express para SPA:
const path = require("path");
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});`;

  return (
    <div className="relative">
      <header className="rounded-2xl border dark:border-slate-800 bg-gradient-to-br from-indigo-50/80 via-white/50 to-sky-50/80 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/80 p-6 text-center mb-6">
        <div className="inline-flex px-3 py-1 rounded-full text-xs bg-indigo-600 text-white shadow">React Router</div>
        <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Paso a paso: react-router-dom
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Navegación con rutas en React v6</p>
        <div className="mt-4">
          <a
            className="px-3 py-2 rounded-md border bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80"
            href="/"
          >
            Volver al Inicio
          </a>
        </div>
      </header>

      <main className="grid gap-4">
        <Step title="1) Instalar librería" emoji="📦">
          <PreBlock label="Comando" code={codeInstall} />
        </Step>

        <Step title="2) Envolver la App" emoji="🧩">
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Tu <code>src/index.js</code> debe envolver <code>&lt;App /&gt;</code> con <code>BrowserRouter</code>:
          </p>
          <PreBlock label="src/index.js" code={codeIndexWrap} />
        </Step>

        <Step title="3) Definir rutas" emoji="🗺️">
          <p className="text-sm text-slate-700 dark:text-slate-200">Ejemplo mínimo en <code>src/App.js</code>:</p>
          <PreBlock label="src/App.js" code={codeAppRoutes} />
        </Step>

        <Step title="4) Navegar" emoji="🧭" defaultOpen={false}>
          <div className="grid md:grid-cols-2 gap-3">
            <PreBlock label="<Link />" code={codeLink} />
            <PreBlock label="useNavigate()" code={codeNav} />
          </div>
        </Step>

        <Step title="5) 404 y fallback en Express (opcional)" emoji="🚧" defaultOpen={false}>
          <p className="text-sm text-slate-700 dark:text-slate-200">Para recargas directas en producción con Express:</p>
          <PreBlock label="app.js (extracto)" code={codeExpressSpa} />
        </Step>
      </main>

      <footer className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Router v6
      </footer>
    </div>
  );
}
