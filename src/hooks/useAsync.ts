import { useState, useCallback } from 'react';
import { logger } from '@utils/logger';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// hook genérico para async con manejo de errores
export const useAsync = <T,>() => {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: false, error: null });

  const execute = useCallback(async (asyncFn: () => Promise<T>): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      logger.error('useAsync error', { message });
      setState({ data: null, loading: false, error: message });
      return null;
    }
  }, []);

  return { ...state, execute };
};
