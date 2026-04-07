import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';
import { useAuth } from '@context/AuthContext';
import { Input } from '@components/ui/Input';
import { Alert } from '@components/ui/Alert';
import { validateUsername, validatePassword, validateLength } from '@utils/sanitize';

const features = ['Registro rápido y seguro', 'Acceso inmediato al sistema', 'Datos protegidos en todo momento'];

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', lastName: '', username: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!validateLength(form.name, 200))     errs.name     = 'Nombre requerido (máx 200 chars).';
    if (!validateLength(form.lastName, 300)) errs.lastName = 'Apellido requerido (máx 300 chars).';
    if (!validateUsername(form.username))    errs.username = 'Usuario: 3-100 chars alfanuméricos.';
    if (!validatePassword(form.password))    errs.password = 'Mín 8 chars, 1 mayúscula, 1 número, 1 especial.';
    if (form.password !== form.confirm)      errs.confirm  = 'Las contraseñas no coinciden.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.lastName, form.username, form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2">
      {/* Panel izquierdo */}
      <div className="hidden md:flex flex-col justify-center items-center gap-6 px-12 bg-zinc-900/50 border-r border-zinc-800/60 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.1), transparent)' }} />
        <div className="sidebar-logo w-16 h-16 rounded-2xl text-2xl font-black z-10">E</div>
        <h2 className="text-3xl font-black text-zinc-100 tracking-tight text-center z-10">
          Únete a<br />
          <span className="gradient-text">EDM App</span>
        </h2>
        <p className="text-zinc-400 text-sm text-center max-w-xs leading-relaxed z-10">
          Crea tu cuenta y empieza a gestionar tus tareas de forma segura.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs z-10">
          {features.map(f => (
            <div key={f} className="flex items-center gap-3 px-4 py-2.5 bg-zinc-800/60 border border-zinc-700/60 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_6px_rgba(52,211,153,.6)]" />
              <span className="text-zinc-400 text-xs font-medium">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-black text-zinc-100 tracking-tight">Crear cuenta</h2>
            <p className="text-zinc-500 text-sm mt-1">Completa el formulario para registrarte</p>
          </div>
          {apiError && <Alert message={apiError} />}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Input id="name"     label="Nombre"   value={form.name}     onChange={set('name')}     error={errors.name}     maxLength={200} required />
              <Input id="lastName" label="Apellido" value={form.lastName} onChange={set('lastName')} error={errors.lastName} maxLength={300} required />
            </div>
            <Input id="username" label="Usuario"              value={form.username} onChange={set('username')} error={errors.username} maxLength={100} required />
            <Input id="password" label="Contraseña"           type="password" value={form.password} onChange={set('password')} error={errors.password} maxLength={100} required />
            <Input id="confirm"  label="Confirmar contraseña" type="password" value={form.confirm}  onChange={set('confirm')}  error={errors.confirm}  maxLength={100} required />
            <Button type="submit" isLoading={loading} fullWidth size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/40 mt-1">
              {loading ? 'Registrando...' : 'Crear cuenta →'}
            </Button>
          </form>
          <p className="text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-emerald-400 font-semibold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
