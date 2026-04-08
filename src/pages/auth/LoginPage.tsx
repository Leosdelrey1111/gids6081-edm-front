import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { useAuth } from '@context/AuthContext';
import { authService } from '@services/auth.service';
import { Input } from '@components/ui/Input';
import { Alert } from '@components/ui/Alert';
import { validateUsername } from '@utils/sanitize';
import { logger } from '@utils/logger';

const features = ['Gestión de tareas en tiempo real', 'Control de acceso seguro', 'Logs de auditoría y seguridad'];

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resetUsername, setResetUsername] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateUsername(username)) { setError('Usuario inválido (3-100 caracteres alfanuméricos).'); return; }
    if (password.length < 3) { setError('Contraseña demasiado corta.'); return; }
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      logger.warn('Login failed', { username });
      setError(err instanceof Error ? err.message : 'Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setResetError(''); setResetSuccess('');
    if (!resetUsername.trim()) { setResetError('Ingresa tu nombre de usuario.'); return; }
    if (resetPassword.length < 6) { setResetError('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (resetPassword !== resetConfirm) { setResetError('Las contraseñas no coinciden.'); return; }
    setResetLoading(true);
    try {
      await authService.resetPassword(resetUsername, resetPassword);
      setResetSuccess('Contraseña actualizada correctamente. Ya puedes iniciar sesión.');
      setResetUsername(''); setResetPassword(''); setResetConfirm('');
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Error al restablecer la contraseña.');
    } finally {
      setResetLoading(false);
    }
  };

  const closeReset = () => {
    onClose();
    setResetUsername(''); setResetPassword(''); setResetConfirm('');
    setResetError(''); setResetSuccess('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-center gap-6 px-12 bg-zinc-900/50 border-r border-zinc-800/60 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.1), transparent)' }} />
        <div className="sidebar-logo w-16 h-16 rounded-2xl text-2xl font-black z-10">E</div>
        <h2 className="text-3xl font-black text-zinc-100 tracking-tight text-center z-10">
          Bienvenido de<br />
          <span className="gradient-text">vuelta</span>
        </h2>
        <p className="text-zinc-400 text-sm text-center max-w-xs leading-relaxed z-10">
          Gestiona tus tareas de forma segura, eficiente y organizada.
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

      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-black text-zinc-100 tracking-tight">Iniciar sesión</h2>
            <p className="text-zinc-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>
          {error && <Alert message={error} />}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <Input id="username" label="Usuario" type="text"
              value={username} onChange={e => setUsername(e.target.value)}
              autoComplete="username" maxLength={100} required />
            <Input id="password" label="Contraseña" type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" maxLength={100} required />
            <div className="flex justify-end">
              <button type="button" onClick={onOpen}
                className="text-xs text-emerald-400 hover:underline bg-transparent border-none cursor-pointer">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <Button type="submit" isLoading={loading} fullWidth size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/40 mt-1">
              {loading ? 'Ingresando...' : 'Iniciar sesión →'}
            </Button>
          </form>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">¿Nuevo aquí?</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <p className="text-center text-sm text-zinc-500">
            <Link to="/register" className="text-emerald-400 font-semibold hover:underline">Crear una cuenta</Link>
          </p>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeReset}>
        <ModalContent>
          <ModalHeader>Restablecer contraseña</ModalHeader>
          <ModalBody>
            <p className="text-zinc-400 text-sm mb-2">Ingresa tu usuario y la nueva contraseña.</p>
            {resetError && <Alert message={resetError} />}
            {resetSuccess && <p className="text-sm text-emerald-400">{resetSuccess}</p>}
            {!resetSuccess && (
              <div className="flex flex-col gap-3">
                <Input id="r-username" label="Usuario" value={resetUsername}
                  onChange={e => setResetUsername(e.target.value)} maxLength={100} />
                <Input id="r-password" label="Nueva contraseña" type="password" value={resetPassword}
                  onChange={e => setResetPassword(e.target.value)} maxLength={100} />
                <Input id="r-confirm" label="Confirmar contraseña" type="password" value={resetConfirm}
                  onChange={e => setResetConfirm(e.target.value)} maxLength={100} />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={closeReset}>Cancelar</Button>
            {!resetSuccess && (
              <Button isLoading={resetLoading}
                className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold"
                onPress={handleReset}>
                Restablecer
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
