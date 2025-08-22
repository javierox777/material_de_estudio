import React from "react";
import { useNavigate } from "react-router-dom";

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

export default function FrontendStart() {
  const [pulse, setPulse] = React.useState(true);
  const navigate = useNavigate();

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
    <div className={"relative min-h-[60vh] " + (pulse ? "animate-[pulse_8s_ease-in-out_infinite]" : "")}>
      {/* hero */}
      <header className="rounded-2xl border dark:border-slate-800 bg-gradient-to-br from-indigo-50/80 via-white/50 to-sky-50/80 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/80 p-6 text-center mb-6">
        <div className="inline-flex px-3 py-1 rounded-full text-xs bg-indigo-600 text-white shadow">React + Railway</div>
        <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Crear un proyecto React y desplegar en Railway
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">✨ Guía rápida paso a paso</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            className="px-3 py-2 rounded-md border bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80"
            onClick={() => setPulse((p) => !p)}
          >
            {pulse ? "Pausar fondo" : "Reanudar fondo"}
          </button>
          <a
            className="px-3 py-2 rounded-md border bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80"
            href="https://railway.app/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            Abrir Railway
          </a>
          <button
            className="px-3 py-2 rounded-md border bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80"
            onClick={() => navigate("/router-setup")}
          >
            Guía: React Router
          </button>
        </div>
      </header>

      {/* contenido */}
      <main className="grid gap-4">
        <Step title="Requisitos" emoji="🧰">
          <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-200 space-y-1">
            <li>Node.js 18 o 20</li>
            <li>Git + GitHub</li>
          </ul>
          <PreBlock label="Verificar versiones" code={`node -v\nnpm -v`} />
        </Step>

        <Step title="Crear proyecto (Create React App)" emoji="⚡">
          <PreBlock label="Comandos" code={`npx create-react-app my-app\ncd my-app\nnpm start`} />
          <p className="text-xs text-slate-500 dark:text-slate-400">Abre <code>http://localhost:3000</code>.</p>
        </Step>

        <Step title="Punto de entrada" emoji="🧩">
          <p className="text-sm text-slate-700 dark:text-slate-200">Estructura inicial típica en CRA:</p>
          <PreBlock label="src/index.js" code={codeIndexJs} />
        </Step>

        <Step title="Componente base" emoji="🧱">
          <p className="text-sm text-slate-700 dark:text-slate-200">Un <code>App.js</code> mínimo para partir sin errores:</p>
          <PreBlock label="src/App.js" code={codeAppJs} />
        </Step>

        <Step title="Variables de entorno (opcional)" emoji="🔑">
          <p className="text-sm text-slate-700 dark:text-slate-200">En CRA deben comenzar con <code>REACT_APP_</code>.</p>
          <div className="grid md:grid-cols-2 gap-3">
            <PreBlock label=".env" code={codeEnv} />
            <PreBlock label="Uso" code={codeUseEnv} />
          </div>
        </Step>

        <Step title="Build de producción" emoji="🏗️">
          <PreBlock label="Compilar" code={codeBuild} />
          <p className="text-xs text-slate-500 dark:text-slate-400">Se genera <code>build/</code>.</p>
        </Step>

        <Step title="Subir a GitHub" emoji="🚀">
          <PreBlock label="Git" code={codeGit} />
        </Step>

        <Step title="Despliegue en Railway" emoji="🛤️">
          <ol className="list-decimal pl-5 text-sm text-slate-700 dark:text-slate-200 space-y-1">
            <li>Importa tu repo desde GitHub en Railway.</li>
            <li>
              En el servicio → <b>Settings</b>:
              <ul className="list-disc pl-5">
                <li>
                  <b>Install Command</b>: <code>npm ci</code> (o <code>npm install</code>)
                </li>
                <li>
                  <b>Build Command</b>: <code>npm run build</code>
                </li>
                <li>
                  <b>Start Command</b>: <code>{codeStartCmd}</code>
                </li>
              </ul>
            </li>
            <li>Activa <b>Public Networking</b> y usa <b>Open App</b> para tu URL.</li>
          </ol>
          <div className="grid md:grid-cols-2 gap-3">
            <PreBlock label="Start Command (rápido)" code={codeStartCmd} />
            <PreBlock label='Scripts en package.json (con "serve")' code={codePkgScripts} />
          </div>
        </Step>
      </main>

      <footer className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Hecho con ❤️ — React
      </footer>
    </div>
  );
}
