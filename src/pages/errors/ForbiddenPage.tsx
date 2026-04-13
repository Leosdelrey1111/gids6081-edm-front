import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50 dark:bg-zinc-950">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6 text-red-400">
        <ShieldOff size={32} />
      </div>
      <h1 className="text-6xl font-black text-gray-900 dark:text-zinc-100 mb-2">403</h1>
      <p className="text-gray-500 dark:text-zinc-400 mb-8">No tienes permisos para acceder a esta página.</p>
      <Link to="/dashboard" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
        Ir al dashboard
      </Link>
    </div>
  );
}
