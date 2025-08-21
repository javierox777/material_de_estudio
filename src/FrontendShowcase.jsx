import React from "react";

/* =============================
   FRONTEND SHOWCASE (solo frontend)
   - Navbar, charts SVG, cards, form, fetch y snippet MUI
   - Sin nada de backend ni r3f/three
   ============================= */

function FrontendShowcase() {
  const [demo, setDemo] = React.useState("charts");
  const [copied, setCopied] = React.useState(false);
  // Puedes configurar una API pública con VITE_API_URL en .env; por defecto usa JSONPlaceholder
  const API = (import.meta.env.VITE_API_URL || "https://jsonplaceholder.typicode.com").replace(/\/$/, "");

  const copy = (text) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  /* ---------- CODE PANE ---------- */
  function CodePane({ title, code, onCopy, copied }) {
    return (
      <div className="rounded-xl border bg-white/80 dark:bg-slate-900/60 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
          <button
            onClick={() => onCopy(code)}
            className="px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50 text-xs"
          >
            {copied ? "Copiado ✓" : "Copiar"}
          </button>
        </div>
        <pre className="bg-slate-900 text-slate-100 text-[11px] leading-5 p-3 rounded-lg overflow-x-auto"><code>{code}</code></pre>
      </div>
    );
  }

  /* ---------- DEMOS ---------- */
  function ChartsDemo() {
    const [data, setData] = React.useState(() =>
      Array.from({ length: 7 }, (_, i) => ({ label: `D${i + 1}`, value: Math.round(4 + Math.random() * 16) }))
    );
    const [running, setRunning] = React.useState(true);

    React.useEffect(() => {
      if (!running) return;
      const id = setInterval(() => {
        setData((d) =>
          d.map((p) => ({
            ...p,
            value: Math.max(2, Math.min(20, Math.round(p.value + (Math.random() * 6 - 3)))),
          }))
        );
      }, 1200);
      return () => clearInterval(id);
    }, [running]);

    const max = 20;
    return (
      <div className="w-full grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white/80 dark:bg-slate-900/60 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 dark:text-white">Bar chart (SVG puro)</h4>
            <button
              onClick={() => setRunning((r) => !r)}
              className="px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50"
            >
              {running ? "Pausar" : "Reanudar"}
            </button>
          </div>
          <svg viewBox="0 0 500 260" className="w-full h-56">
            <line x1="30" y1="210" x2="480" y2="210" stroke="#cbd5e1" />
            {data.map((p, i) => {
              const bw = 48,
                gap = 18,
                x = 40 + i * (bw + gap);
              const h = (p.value / max) * 180;
              const y = 210 - h;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={bw} height={h} rx="8" className="fill-indigo-500/80" />
                  <text x={x + bw / 2} y={226} textAnchor="middle" className="fill-slate-500 text-[10px]">
                    {p.label}
                  </text>
                  <text x={x + bw / 2} y={y - 6} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[10px]">
                    {p.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <CodePane title="Código del chart (SVG + useEffect)" code={codeSnippets.charts} onCopy={copy} copied={copied} />
      </div>
    );
  }

  function CardsDemo() {
    const [likes, setLikes] = React.useState({});
    const items = [
      { id: 1, title: "API Docs", desc: "Guías y endpoints." },
      { id: 2, title: "Design Kit", desc: "Componentes y tokens." },
      { id: 3, title: "Playground", desc: "Probar requests." },
    ];
    return (
      <div className="w-full grid lg:grid-cols-2 gap-4">
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border bg-white/80 dark:bg-slate-900/60 dark:border-slate-800 p-4">
              <div className="h-9 w-9 rounded-lg bg-sky-500/20 border border-sky-200/50 dark:border-slate-700 flex items-center justify-center">
                📦
              </div>
              <h4 className="mt-2 font-semibold text-slate-900 dark:text-white">{it.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{it.desc}</p>
              <button
                onClick={() => setLikes((s) => ({ ...s, [it.id]: !s[it.id] }))}
                className={
                  "mt-3 px-3 py-1 rounded-md border " +
                  (likes[it.id]
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/80")
                }
              >
                {likes[it.id] ? "❤️ Me gusta" : "🤍 Me gusta"}
              </button>
            </div>
          ))}
        </div>
        <CodePane title="Código de Cards (useState)" code={codeSnippets.cards} onCopy={copy} copied={copied} />
      </div>
    );
  }

  function FormDemo() {
    const [form, setForm] = React.useState({ name: "", email: "", msg: "" });
    const submit = (e) => {
      e.preventDefault();
      alert("Enviado!" + JSON.stringify(form, null, 2));
    };
    return (
      <div className="w-full grid lg:grid-cols-2 gap-4">
        <form onSubmit={submit} className="rounded-xl border bg-white/80 dark:bg-slate-900/60 dark:border-slate-800 p-4 space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">Formulario controlado</h4>
          <div>
            <label className="text-xs text-slate-500">Nombre</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 bg-white dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 bg-white dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Mensaje</label>
            <textarea
              rows={3}
              value={form.msg}
              onChange={(e) => setForm({ ...form, msg: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 bg-white dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Enviar</button>
        </form>
        <CodePane title="Código de Form (controlado)" code={codeSnippets.form} onCopy={copy} copied={copied} />
      </div>
    );
  }

  function FetchDemo() {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [err, setErr] = React.useState("");

    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        // Si API apunta a jsonplaceholder, devuelve 10 usuarios con campos distintos
        const res = await fetch(`${API}/users`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const json = await res.json();
        const normalized = Array.isArray(json)
          ? json.map((u) => ({ _id: u.id, name: u.name || u.username, email: u.email || "" }))
          : [];
        setUsers(normalized);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      load();
    }, []);

    return (
      <div className="w-full grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white/80 dark:bg-slate-900/60 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white">Fetch a {API}/users</h4>
            <button onClick={load} className="px-3 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50">
              Recargar
            </button>
          </div>
          {loading && <p className="text-slate-500">Cargando…</p>}
          {err && <p className="text-rose-500">Error: {err}</p>}
          {!loading && !err && (
            <ul className="space-y-2">
              {users.map((u, i) => (
                <li
                  key={u._id || i}
                  className="rounded-lg border bg-white/80 dark:bg-slate-900/60 dark:border-slate-800 p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{u.name || "Sin nombre"}</p>
                    <p className="text-xs text-slate-500">{u.email || "sin-email@example.com"}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    id: {(u._id || "").toString().slice(-6)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <CodePane title="Código de Fetch (fetch + useEffect)" code={codeSnippets.fetch} onCopy={copy} copied={copied} />
      </div>
    );
  }

  function MUIDemo() {
    return (
      <div className="w-full grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white/80 dark:bg-slate-900/60 dark:border-slate-800 p-4 space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">Material UI (MUI) – guía rápida</h4>
          <ol className="list-decimal pl-6 text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>
              Instala: <code>npm i @mui/material @emotion/react @emotion/styled</code>
            </li>
            <li>
              Envuelve tu app opcionalmente con <code>ThemeProvider</code>.
            </li>
            <li>
              Importa componentes: <code>{`import { Button } from '@mui/material'`}</code>.
            </li>
          </ol>
          <p className="text-xs text-slate-500">
            Nota: este panel sólo muestra el código. Si ya instalaste MUI, puedes pegarlo en cualquier componente y
            funcionará.
          </p>
        </div>
        <CodePane title="Código MUI básico" code={codeSnippets.mui} onCopy={copy} copied={copied} />
      </div>
    );
  }

  const Demo = () => {
    if (demo === "charts") return <ChartsDemo />;
    if (demo === "cards") return <CardsDemo />;
    if (demo === "form") return <FormDemo />;
    if (demo === "fetch") return <FetchDemo />;
    if (demo === "mui") return <MUIDemo />;
    return null;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 dark:border-slate-800">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frontend Showcase</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Navbar + charts + cards + form + fetch + snippets MUI.</p>
            <div className="mt-3 inline-flex rounded-lg border bg-white/80 dark:bg-slate-800/70 dark:border-slate-700 overflow-hidden">
              {["charts", "cards", "form", "fetch", "mui"].map((k) => (
                <button
                  key={k}
                  onClick={() => setDemo(k)}
                  className={
                    "px-3 py-1 text-sm " +
                    (demo === k
                      ? "bg-indigo-600 text-white"
                      : "text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80")
                  }
                >
                  {k.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6">
            <Demo />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Snippets mostrados en el panel derecho ---------- */
const codeSnippets = {
  charts: `function Chart() {
  const [data, setData] = useState([...]);
  useEffect(() => {
    const id = setInterval(() => { /* actualizar */ }, 1200);
    return () => clearInterval(id);
  }, []);
  return (<svg>{/* barras */}</svg>);
}`,
  cards: `function Cards() {
  const [likes, setLikes] = useState({});
  return items.map(it => (
    <button onClick={() => setLikes(s => ({ ...s, [it.id]: !s[it.id] }))}>Like</button>
  ));
}`,
  form: `function Form() {
  const [f, setF] = useState({ name: '', email: '' });
  const submit = e => { e.preventDefault(); /* enviar */ };
  return (<form onSubmit={submit}>...</form>);
}`,
  fetch: `const API = import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com';
useEffect(() => {
  (async () => {
    const r = await fetch(API + '/users');
    const data = await r.json();
    setUsers(data);
  })();
}, []);`,
  mui: `// 1) npm i @mui/material @emotion/react @emotion/styled
import * as React from 'react';
import { Button, TextField, Card, CardContent } from '@mui/material';

export default function DemoMUI() {
  const [name, setName] = React.useState('');
  return (
    <Card>
      <CardContent>
        <TextField label='Nombre' value={name} onChange={e=>setName(e.target.value)} />
        <Button variant='contained' sx={{ ml: 2 }}>Guardar</Button>
      </CardContent>
    </Card>
  );
}`,
};

export default function App() {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-indigo-600" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Frontend Showcase</h1>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {dark ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
        </div>
      </header>
      <FrontendShowcase />
    </div>
  );
}
