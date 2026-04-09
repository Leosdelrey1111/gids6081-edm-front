import { Link, Outlet } from 'react-router-dom';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { PageTransition } from '@components/ui/PageTransition';
import { CheckSquare, ShieldCheck, Lock } from 'lucide-react';

export function LandingLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d0c] flex flex-col transition-colors">
      <header className="border-b border-gray-200 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="sidebar-logo w-8 h-8 text-sm">E</div>
            <span className="font-bold text-gray-900 dark:text-zinc-100 tracking-tight">EDM App</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link to="/login" className="text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors px-2 sm:px-3 py-1.5">
              Iniciar sesión
            </Link>
            <Link to="/register" className="text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:opacity-90 transition-opacity">
              Registrarse
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1"><PageTransition><Outlet /></PageTransition></main>
      <footer className="border-t border-gray-200 dark:border-zinc-800/60 py-6 text-center text-xs text-gray-400 dark:text-zinc-600">
        © {new Date().getFullYear()} EDM App — Gestión segura de tareas
      </footer>
    </div>
  );
}

const features = [
  { icon: <CheckSquare size={20} />, title: 'Gestión de tareas', desc: 'Crea, edita y organiza tus tareas con prioridades.' },
  { icon: <Lock size={20} />, title: 'Acceso seguro', desc: 'JWT en memoria, control de roles y logs de auditoría.' },
  { icon: <ShieldCheck size={20} />, title: 'Defensa en profundidad', desc: 'Validación de entradas, sanitización y CIA.' },
];

export function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Sistema de gestión de tareas
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-zinc-100 tracking-tight leading-tight mb-6">
          Organiza tu trabajo<br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">de forma segura</span>
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
          EDM App gestiona tus tareas con control de acceso por roles, validación de entradas y logs de auditoría.
        </p>
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <Link to="/register" className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 hover:opacity-90 transition-opacity">
            Comenzar gratis →
          </Link>
          <Link to="/login" className="px-5 sm:px-6 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
            Iniciar sesión
          </Link>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 relative z-10">
        {features.map(f => (
          <div key={f.title} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-xl p-5 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              {f.icon}
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-1">{f.title}</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
