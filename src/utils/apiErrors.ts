const FIELD_KEYWORDS: Record<string, string[]> = {
  name:        ['name'],
  lastName:    ['lastname', 'last_name', 'apellido'],
  username:    ['username'],
  password:    ['password'],
  description: ['description'],
  priority:    ['priority'],
};

// detecta a qué campo pertenece un mensaje de error
const detectField = (msg: string): string | null => {
  const lower = msg.toLowerCase();
  for (const [field, keywords] of Object.entries(FIELD_KEYWORDS)) {
    if (keywords.some(k => lower.startsWith(k) || lower.includes(` ${k} `) || lower.includes(` ${k}`))) {
      return field;
    }
  }
  return null;
};

// separa errores del API por campo; los no mapeados van a "_general"
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
