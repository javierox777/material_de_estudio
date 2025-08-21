// src/pages/FrontendStart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
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

export default function FrontendStart() {
  const [pulse, setPulse] = React.useState(true);
  const navigate = useNavigate(); // ← para redirigir al otro componente

  const codeIndexJs = `// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

  const codeAppJs = `// src/App.js
import React from "react";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Hola React</h1>
      <p></p>
    </div>
  );
}`;

  const codeEnv = `# .env
REACT_APP_API_URL=https://jsonplaceholder.typicode.com`;

  const codeUseEnv = `// uso en el código
const API = process.env.REACT_APP_API_URL;`;

  const codeBuild = `npm run build`;

  const codeGit = `git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git push -u origin main`;

  const codeStartCmd = `npx serve -s build -l $PORT`;

  const codePkgScripts = `"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "start:prod": "serve -s build -l $PORT"
}`;

  return (
    <div className={`fs-page ${pulse ? "fs-pulse" : ""}`}>
      <header className="fs-hero">
        <div className="fs-hero__badge">React + Railway</div>
        <h2 className="fs-hero__title">Crear un proyecto React y desplegar en Railway</h2>
        <p className="fs-hero__desc">
          ✨
        </p>
        <div className="fs-hero__actions">
          <button className="fs-btn" onClick={() => setPulse((p) => !p)}>
            {pulse ? "Pausar fondo" : "Reanudar fondo"}
          </button>
          <a className="fs-btn fs-btn--ghost" href="https://railway.app/dashboard" target="_blank" rel="noreferrer">
            Abrir Railway
          </a>
          {/* Botón que te lleva a la guía de React Router dentro de la app */}
          <button className="fs-btn fs-btn--ghost" onClick={() => navigate("/router-setup")}>
            Guía: React Router
          </button>
        </div>
      </header>

      <main className="fs-container">
        <Step title="Requisitos" emoji="🧰">
          <ul className="fs-ul">
            <li>Node.js 18 o 20</li>
            <li>Git + GitHub</li>
          </ul>
          <PreBlock label="Verificar versiones" code={`node -v\nnpm -v`} />
        </Step>

        <Step title="Crear proyecto (Create React App)" emoji="⚡">
          <PreBlock label="Comandos" code={`npx create-react-app my-app\ncd my-app\nnpm start`} />
          <p className="fs-note">Abre <code>http://localhost:3000</code>.</p>
        </Step>

        <Step title="Punto de entrada" emoji="🧩">
          <p className="fs-p">Estructura inicial típica en CRA:</p>
          <PreBlock label="src/index.js" code={codeIndexJs} />
        </Step>

        <Step title="Componente base" emoji="🧱">
          <p className="fs-p">Un <code>App.js</code> mínimo para partir sin errores:</p>
          <PreBlock label="src/App.js" code={codeAppJs} />
        </Step>

        <Step title="Variables de entorno (opcional)" emoji="🔑">
          <p className="fs-p">En CRA deben comenzar con <code>REACT_APP_</code>.</p>
          <div className="fs-grid">
            <PreBlock label=".env" code={codeEnv} />
            <PreBlock label="Uso" code={codeUseEnv} />
          </div>
        </Step>

        <Step title="Build de producción" emoji="🏗️">
          <PreBlock label="Compilar" code={codeBuild} />
          <p className="fs-note">Se genera <code>build/</code>.</p>
        </Step>

        <Step title="Subir a GitHub" emoji="🚀">
          <PreBlock label="Git" code={codeGit} />
        </Step>

        <Step title="Despliegue en Railway" emoji="🛤️">
          <ol className="fs-ol">
            <li>Importa tu repo desde GitHub en Railway.</li>
            <li>En el servicio → <b>Settings</b>:
              <ul className="fs-ul">
                <li><b>Install Command</b>: <code>npm ci</code> (o <code>npm install</code>)</li>
                <li><b>Build Command</b>: <code>npm run build</code></li>
                <li><b>Start Command</b>: <code>{codeStartCmd}</code></li>
              </ul>
            </li>
            <li>Activa <b>Public Networking</b> y usa <b>Open App</b> para tu URL.</li>
          </ol>
          <div className="fs-grid">
            <PreBlock label="Start Command (rápido)" code={codeStartCmd} />
            <PreBlock label='Scripts en package.json (con "serve")' code={codePkgScripts} />
          </div>
        </Step>
      </main>

      <footer className="fs-footer">
        <span>Hecho con ❤️ — React </span>
      </footer>
    </div>
  );
}
