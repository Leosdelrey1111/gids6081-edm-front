import { validateLength } from '@utils/sanitize';

export interface TaskFormErrors {
  name?: string;
  description?: string;
}

export interface TaskFormValues {
  name: string;
  description: string;
  priority: boolean;
}

export const trimTaskForm = (form: TaskFormValues): TaskFormValues => ({
  ...form,
  name:        form.name.trim(),
  description: form.description.trim(),
});

export const validateTaskForm = (form: TaskFormValues): TaskFormErrors => {
  const t = trimTaskForm(form);
  const errors: TaskFormErrors = {};
  if (!validateLength(t.name, 150))        errors.name        = 'El nombre es requerido (máx. 150 caracteres).';
  if (!validateLength(t.description, 200)) errors.description = 'La descripción es requerida (máx. 200 caracteres).';
  return errors;
};
