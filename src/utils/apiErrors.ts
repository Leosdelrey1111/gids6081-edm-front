/**
 * Mapea un mensaje de error del API al campo del formulario que le corresponde.
 * El API (NestJS) devuelve mensajes como:
 *   "name must be longer than or equal to 3 characters"
 *   "password must be longer than or equal to 8 characters"
 *   "username should not be empty"
 */

const FIELD_KEYWORDS: Record<string, string[]> = {
  name:        ['name'],
  lastName:    ['lastname', 'last_name', 'apellido'],
  username:    ['username'],
  password:    ['password'],
  description: ['description'],
  priority:    ['priority'],
};

/** Dado un mensaje de error del API, devuelve el campo al que pertenece o null */
const detectField = (msg: string): string | null => {
  const lower = msg.toLowerCase();
  for (const [field, keywords] of Object.entries(FIELD_KEYWORDS)) {
    if (keywords.some(k => lower.startsWith(k) || lower.includes(` ${k} `) || lower.includes(` ${k}`))) {
      return field;
    }
  }
  return null;
};

/**
 * Convierte el mensaje de error del API (string con " • " como separador)
 * en un objeto de errores por campo.
 * Los mensajes que no se puedan mapear a un campo van a la clave "_general".
 */
export const parseApiErrors = (apiMessage: string): Record<string, string> => {
  const parts   = apiMessage.split(' • ');
  const result: Record<string, string> = {};

  for (const part of parts) {
    const field = detectField(part);
    if (field) {
      result[field] = part;
    } else {
      result['_general'] = result['_general'] ? `${result['_general']} • ${part}` : part;
    }
  }

  return result;
};
