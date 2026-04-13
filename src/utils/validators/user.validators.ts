import { validateLength, validateUsername, validatePassword } from '@utils/sanitize';
import type { CreateUserPayload, UpdateUserPayload } from '@api/endpoints/user.service';

export interface CreateUserErrors extends Partial<Record<keyof CreateUserPayload, string>> {}
export interface UpdateUserErrors extends Partial<Record<keyof UpdateUserPayload, string>> {}

export const trimCreateUser = (form: CreateUserPayload): CreateUserPayload => ({
  name:     form.name.trim(),
  lastName: form.lastName.trim(),
  username: form.username.trim(),
  password: form.password,
});

export const trimUpdateUser = (form: UpdateUserPayload): UpdateUserPayload => ({
  name:     form.name?.trim(),
  lastName: form.lastName?.trim(),
  username: form.username?.trim(),
});

export const validateCreateUser = (form: CreateUserPayload): CreateUserErrors => {
  const t = trimCreateUser(form);
  const errors: CreateUserErrors = {};
  if (!validateLength(t.name, 200))     errors.name     = 'El nombre es requerido (máx. 200 caracteres).';
  if (!validateLength(t.lastName, 300)) errors.lastName = 'El apellido es requerido (máx. 300 caracteres).';
  if (!validateUsername(t.username))    errors.username = 'Usuario: 3-100 caracteres alfanuméricos, sin espacios.';
  if (!validatePassword(t.password))   errors.password = 'Mín. 8 caracteres, 1 mayúscula, 1 número y 1 especial (!@#$%^&*).';
  return errors;
};

export const validateUpdateUser = (form: UpdateUserPayload): UpdateUserErrors => {
  const t = trimUpdateUser(form);
  const errors: UpdateUserErrors = {};
  if (t.name     !== undefined && !validateLength(t.name, 200))     errors.name     = 'El nombre es requerido (máx. 200 caracteres).';
  if (t.lastName !== undefined && !validateLength(t.lastName, 300)) errors.lastName = 'El apellido es requerido (máx. 300 caracteres).';
  if (t.username !== undefined && !validateUsername(t.username))    errors.username = 'Usuario: 3-100 caracteres alfanuméricos, sin espacios.';
  return errors;
};
