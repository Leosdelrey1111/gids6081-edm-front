import DOMPurify from 'dompurify';

// elimina HTML peligroso
export const sanitizeHtml = (dirty: string): string =>
  DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

// elimina caracteres peligrosos de texto plano
export const sanitizeText = (value: string): string =>
  value.replace(/[<>"'`]/g, '');

// valida longitud con trim interno
export const validateLength = (value: string, max: number, min = 1): boolean => {
  const trimmed = value.trim();
  return trimmed.length >= min && trimmed.length <= max;
};

// alfanumérico + guiones/underscore, 3-100 chars
export const validateUsername = (username: string): boolean =>
  /^[a-zA-Z0-9_-]{3,100}$/.test(username);

// mín 8 chars, 1 mayúscula, 1 número, 1 especial
export const validatePassword = (password: string): boolean =>
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
