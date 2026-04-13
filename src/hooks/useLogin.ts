import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure, addToast } from '@heroui/react';
import { useAuth } from '@context/AuthContext';
import { authService } from '@api/endpoints/auth.service';
import {
  validateLoginForm, validateResetPassword,
  trimResetPassword,
  type LoginErrors, type ResetPasswordValues, type ResetPasswordErrors,
} from '@utils/validators/auth.validators';
import { parseApiErrors } from '@utils/apiErrors';
import { logger } from '@utils/logger';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [loading, setLoading]     = useState(false);

  const resetModal = useDisclosure();
  const [reset, setReset]               = useState<ResetPasswordValues>({ username: '', password: '', confirm: '' });
  const [resetErrors, setResetErrors]   = useState<ResetPasswordErrors>({});
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateLoginForm(username, password);
    if (Object.keys(errors).length > 0) { setLoginErrors(errors); return; }
    setLoginErrors({});

    setLoading(true);
    try {
      await login(username.trim(), password);
      addToast({ title: '¡Bienvenido!', description: 'Sesión iniciada correctamente.', color: 'success' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      logger.warn('Login failed', { username });
      const msg    = err instanceof Error ? err.message : 'Credenciales incorrectas.';
      const mapped = parseApiErrors(msg);
      const fieldErrors = Object.fromEntries(Object.entries(mapped).filter(([k]) => k !== '_general')) as LoginErrors;
      if (Object.keys(fieldErrors).length > 0) setLoginErrors(fieldErrors);
      else addToast({ title: 'Error al iniciar sesión', description: mapped['_general'] ?? msg, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const errors = validateResetPassword(reset);
    if (Object.keys(errors).length > 0) { setResetErrors(errors); return; }
    setResetErrors({});

    const trimmed = trimResetPassword(reset);
    setResetLoading(true);
    try {
      await authService.resetPassword(trimmed.username, trimmed.password);
      addToast({ title: 'Contraseña actualizada', description: 'Ya puedes iniciar sesión con tu nueva contraseña.', color: 'success' });
      closeReset();
    } catch (err) {
      const msg    = err instanceof Error ? err.message : 'Error al restablecer la contraseña.';
      const mapped = parseApiErrors(msg);
      const fieldErrors = Object.fromEntries(Object.entries(mapped).filter(([k]) => k !== '_general')) as ResetPasswordErrors;
      if (Object.keys(fieldErrors).length > 0) setResetErrors(fieldErrors);
      else addToast({ title: 'Error', description: mapped['_general'] ?? msg, color: 'danger' });
    } finally {
      setResetLoading(false);
    }
  };

  const closeReset = () => {
    resetModal.onClose();
    setReset({ username: '', password: '', confirm: '' });
    setResetErrors({});
  };

  return {
    username, setUsername, password, setPassword,
    loginErrors, loading, handleSubmit,
    resetModal, reset, setReset, resetErrors, resetLoading, handleReset, closeReset,
  };
};
