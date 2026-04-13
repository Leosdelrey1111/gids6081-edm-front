import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToast } from '@heroui/react';
import { useAuth } from '@context/AuthContext';
import { validateRegisterForm, trimRegisterForm, type RegisterFormValues, type RegisterErrors } from '@utils/validators/auth.validators';
import { parseApiErrors } from '@utils/apiErrors';

const EMPTY_FORM: RegisterFormValues = { name: '', lastName: '', username: '', password: '', confirm: '' };

export const useRegister = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]       = useState<RegisterFormValues>(EMPTY_FORM);
  const [errors, setErrors]   = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof RegisterFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRegisterForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const trimmed = trimRegisterForm(form);
    setLoading(true);
    try {
      await register(trimmed.name, trimmed.lastName, trimmed.username, trimmed.password);
      addToast({ title: '¡Cuenta creada!', description: 'Bienvenido a EDM App.', color: 'success' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg    = err instanceof Error ? err.message : 'Error al registrarse.';
      const mapped = parseApiErrors(msg);
      const fieldErrors = Object.fromEntries(Object.entries(mapped).filter(([k]) => k !== '_general')) as RegisterErrors;
      if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors);
      else addToast({ title: 'Error al registrarse', description: mapped['_general'] ?? msg, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, loading, set, handleSubmit };
};
