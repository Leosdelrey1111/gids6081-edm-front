import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';
import { useRegister } from '@hooks/useRegister';
import { Input } from '@components/Input';

const features = [
  'Registro rápido y seguro',
  'Acceso inmediato al sistema',
  'Datos protegidos en todo momento',
];

export const RegisterPage = () => {
  const { form, errors, loading, set, handleSubmit } = useRegister();

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-center gap-6 px-8 lg:px-12 bg-gray-100/80 dark:bg-zinc-900/50 border-r border-gray-200 dark:border-zinc-800/60 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.1), transparent)' }} />
        <div className="sidebar-logo w-16 h-16 rounded-2xl text-2xl font-black z-10">E</div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tight text-center z-10">
          Únete a<br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">EDM App</span>
        </h2>
        <p className="text-gray-500 dark:text-zinc-400 text-sm text-center max-w-xs leading-relaxed z-10">
          Crea tu cuenta y empieza a gestionar tus tareas de forma segura.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs z-10">
          {features.map(f => (
            <div key={f} className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_6px_rgba(52,211,153,.6)]" />
              <span className="text-gray-600 dark:text-zinc-400 text-xs font-medium">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
        <div className="w-full max-w-sm flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">Crear cuenta</h2>
            <p className="text-gray-500 dark:text-zinc-500 text-sm mt-1">Completa el formulario para registrarte</p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Input id="name"     label="Nombre"   value={form.name}     onChange={set('name')}     error={errors.name}     maxLength={200} required />
              <Input id="lastName" label="Apellido" value={form.lastName} onChange={set('lastName')} error={errors.lastName} maxLength={300} required />
            </div>
            <Input id="username" label="Usuario"              value={form.username} onChange={set('username')} error={errors.username} maxLength={100} required />
            <Input id="password" label="Contraseña"           type="password" value={form.password} onChange={set('password')} error={errors.password} maxLength={100} required />
            <Input id="confirm"  label="Confirmar contraseña" type="password" value={form.confirm}  onChange={set('confirm')}  error={errors.confirm}  maxLength={100} required />
            <Button type="submit" isLoading={loading} fullWidth size="lg" className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/40 mt-1">
              {loading ? 'Registrando...' : 'Crear cuenta →'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-zinc-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-emerald-500 dark:text-emerald-400 font-semibold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
