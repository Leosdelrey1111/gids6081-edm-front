import DOMPurify from 'dompurify';

/** Elimina HTML peligroso — previene XSS en contenido renderizado */
export const sanitizeHtml = (dirty: string): string =>
  DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

/** Sanitiza texto plano eliminando caracteres peligrosos */
export const sanitizeText = (value: string): string =>
  value.replace(/[<>"'`]/g, '');

/** Valida longitud mínima y máxima (aplica trim internamente) */
export const validateLength = (value: string, max: number, min = 1): boolean => {
  const trimmed = value.trim();
  return trimmed.length >= min && trimmed.length <= max;
};

/** Valida formato de username: alfanumérico + guiones/underscore */
export const validateUsername = (username: string): boolean =>
  /^[a-zA-Z0-9_-]{3,100}$/.test(username);

/** Valida contraseña segura: mín 8 chars, 1 mayúscula, 1 número, 1 especial */
export const validatePassword = (password: string): boolean =>
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
