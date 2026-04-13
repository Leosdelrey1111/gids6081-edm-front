import { validateUsername, validatePassword, validateLength } from '@utils/sanitize';

export interface LoginErrors {
  username?: string;
  password?: string;
}

export interface RegisterFormValues {
  name: string;
  lastName: string;
  username: string;
  password: string;
  confirm: string;
}

export interface RegisterErrors extends Partial<RegisterFormValues> {}

export interface ResetPasswordValues {
  username: string;
  password: string;
  confirm: string;
}

export interface ResetPasswordErrors extends Partial<ResetPasswordValues> {}

export const validateLoginForm = (username: string, password: string): LoginErrors => {
  const errors: LoginErrors = {};
  if (!validateUsername(username.trim())) errors.username = 'Usuario inválido: 3-100 caracteres alfanuméricos.';
  if (password.length < 3)               errors.password = 'La contraseña es demasiado corta.';
  return errors;
};

export const trimRegisterForm = (form: RegisterFormValues): RegisterFormValues => ({
  name:     form.name.trim(),
  lastName: form.lastName.trim(),
  username: form.username.trim(),
  password: form.password,
  confirm:  form.confirm,
});

export const validateRegisterForm = (form: RegisterFormValues): RegisterErrors => {
  const t = trimRegisterForm(form);
  const errors: RegisterErrors = {};
  if (!validateLength(t.name, 200))     errors.name     = 'El nombre es requerido (máx. 200 caracteres).';
  if (!validateLength(t.lastName, 300)) errors.lastName = 'El apellido es requerido (máx. 300 caracteres).';
  if (!validateUsername(t.username))    errors.username = 'Usuario: 3-100 caracteres alfanuméricos, sin espacios.';
  if (!validatePassword(t.password))   errors.password = 'Mín. 8 caracteres, 1 mayúscula, 1 número y 1 especial (!@#$%^&*).';
  if (t.password !== t.confirm)         errors.confirm  = 'Las contraseñas no coinciden.';
  return errors;
};

export const trimResetPassword = (v: ResetPasswordValues): ResetPasswordValues => ({
  username: v.username.trim(),
  password: v.password,
  confirm:  v.confirm,
});

export const validateResetPassword = (values: ResetPasswordValues): ResetPasswordErrors => {
  const t = trimResetPassword(values);
  const errors: ResetPasswordErrors = {};
  if (!t.username)                  errors.username = 'El nombre de usuario es requerido.';
  if (t.password.length < 6)        errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  if (t.password !== t.confirm)     errors.confirm  = 'Las contraseñas no coinciden.';
  return errors;
};
