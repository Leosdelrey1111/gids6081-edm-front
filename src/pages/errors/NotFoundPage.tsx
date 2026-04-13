import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50 dark:bg-zinc-950">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-gray-400 dark:text-zinc-500">
        <FileQuestion size={32} />
      </div>
      <h1 className="text-6xl font-black text-gray-900 dark:text-zinc-100 mb-2">404</h1>
      <p className="text-gray-500 dark:text-zinc-400 mb-8">La página que buscas no existe.</p>
      <Link to="/" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
        Volver al inicio
      </Link>
    </div>
  );
}
