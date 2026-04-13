import { useState, useEffect, useCallback } from 'react';
import { useDisclosure, addToast } from '@heroui/react';
import { logsService, type Log } from '@api/endpoints/logs.service';

export const useLogs = () => {
  const [logs, setLogs]         = useState<Log[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Log | null>(null);
  const detail = useDisclosure();

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      setLogs(await logsService.getMyLogs());
    } catch (err) {
      addToast({ title: 'Error', description: err instanceof Error ? err.message : 'Error al cargar logs.', color: 'danger' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const openDetail = (log: Log) => {
    setSelected(log);
    detail.onOpen();
  };

  return { logs, loading, selected, detail, openDetail };
};
