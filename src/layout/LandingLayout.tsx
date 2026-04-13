import { Link, Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PageTransition } from "@/components/PageTransition";

export function LandingLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d0c] flex flex-col transition-colors">
      <header className="border-b border-gray-200 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="sidebar-logo w-8 h-8 text-sm">E</div>
            <span className="font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
              EDM App
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors px-2 sm:px-3 py-1.5"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:opacity-90 transition-opacity"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <footer className="border-t border-gray-200 dark:border-zinc-800/60 py-6 text-center text-xs text-gray-400 dark:text-zinc-600">
        © {new Date().getFullYear()} EDM App — Gestión segura de tareas
      </footer>
    </div>
  );
}
