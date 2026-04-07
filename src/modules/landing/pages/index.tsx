import { Link, Outlet } from 'react-router-dom';

export function LandingLayout() {
  return (
    <div className="min-h-screen bg-[#0b0d0c] flex flex-col">
      <header className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="sidebar-logo w-8 h-8 text-sm">E</div>
            <span className="font-bold text-zinc-100 tracking-tight">EDM App</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1.5">
              Iniciar sesión
            </Link>
            <Link to="/register" className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:opacity-90 transition-opacity">
              Registrarse
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} EDM App — Gestión segura de tareas
      </footer>
    </div>
  );
}

export function HomePage() {
  const features = [
    { icon: '✅', title: 'Gestión de tareas', desc: 'Crea, edita y organiza tus tareas con prioridades.' },
    { icon: '🔐', title: 'Acceso seguro', desc: 'JWT en memoria, control de roles y logs de auditoría.' },
    { icon: '🛡️', title: 'Defensa en profundidad', desc: 'Validación de entradas, sanitización y CIA.' },
  ];
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Sistema de gestión de tareas
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-zinc-100 tracking-tight leading-tight mb-6">
          Organiza tu trabajo<br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">de forma segura</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed mb-10">
          EDM App gestiona tus tareas con control de acceso por roles, validación de entradas y logs de auditoría.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/register" className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 hover:opacity-90 transition-opacity">
            Comenzar gratis →
          </Link>
          <Link to="/login" className="px-6 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold text-sm hover:bg-zinc-700 transition-colors">
            Iniciar sesión
          </Link>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-5 relative z-10">
        {features.map(f => (
          <div key={f.title} className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="text-sm font-bold text-zinc-100 mb-1">{f.title}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
