import { useState, useEffect } from 'react';
import { logsService, type Log } from '@api/endpoints/logs.service';

export const useEntityLogs = (isOpen: boolean, pathFilter: string) => {
  const [logs, setLogs]         = useState<Log[]>([]);
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState<Log | null>(null);

  useEffect(() => {
    if (!isOpen) { setSelected(null); return; }
    setLoading(true);
    logsService.getByPath(pathFilter)
      .then(setLogs)
      .finally(() => setLoading(false));
  }, [isOpen, pathFilter]);

  return { logs, loading, selected, setSelected };
};
