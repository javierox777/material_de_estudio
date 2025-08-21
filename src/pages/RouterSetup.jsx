// src/pages/RouterSetup.jsx
import React from "react";
import "./frontendStart.css";

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
    <div className="fs-pre">
      {label ? <div className="fs-pre__label">{label}</div> : null}
      <pre><code>{code}</code></pre>
      <button className={`fs-btn fs-btn--ghost ${copied ? "fs-btn--ok" : ""}`} onClick={onCopy}>
        {copied ? "Copiado ✓" : "Copiar"}
      </button>
    </div>
  );
}

function Step({ title, emoji = "✅", children, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section className={`fs-card ${open ? "fs-card--open" : ""}`}>
      <button className="fs-step__head" onClick={() => setOpen((o) => !o)}>
        <span className="fs-step__emoji">{emoji}</span>
        <h3 className="fs-step__title">{title}</h3>
        <span className="fs-step__chev">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="fs-step__body">{children}</div>}
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
    <div className="fs-page fs-pulse">
      <header className="fs-hero">
        <div className="fs-hero__badge">React Router</div>
        <h2 className="fs-hero__title">Paso a paso: react-router-dom</h2>
        <p className="fs-hero__desc">
         
        </p>
        <div className="fs-hero__actions">
          <a className="fs-btn fs-btn--ghost" href="/" rel="noreferrer">Volver al Inicio</a>
        </div>
      </header>

      <main className="fs-container">
        <Step title="1) Instalar librería" emoji="📦">
          <PreBlock label="Comando" code={codeInstall} />
        </Step>

        <Step title="2) Envolver la App" emoji="🧩">
          <p className="fs-p">Tu <code>src/index.js</code> debe envolver <code>&lt;App /&gt;</code> con <code>BrowserRouter</code>:</p>
          <PreBlock label="src/index.js" code={codeIndexWrap} />
        </Step>

        <Step title="3) Definir rutas" emoji="🗺️">
          <p className="fs-p">Ejemplo mínimo de rutas en <code>src/App.js</code>:</p>
          <PreBlock label="src/App.js" code={codeAppRoutes} />
        </Step>

        <Step title="4) Navegar" emoji="🧭" defaultOpen={false}>
          <div className="fs-grid">
            <PreBlock label="<Link />" code={codeLink} />
            <PreBlock label="useNavigate()" code={codeNav} />
          </div>
        </Step>

        <Step title="5) 404 y fallback en Express (opcional)" emoji="🚧" defaultOpen={false}>
          <p className="fs-p">Para recargas directas en rutas (producción) con Express:</p>
          <PreBlock label="app.js (extracto)" code={codeExpressSpa} />
        </Step>
      </main>

      <footer className="fs-footer">
        <span>Router v6 </span>
      </footer>
    </div>
  );
}
