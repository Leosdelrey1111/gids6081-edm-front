import { useState, useEffect } from 'react';
import { Chip, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { logsService, type Log } from '@services/logs.service';
import { Icon } from '@iconify/react';

const StatusBadge = ({ code }: { code: number }) => (
  <Chip size="sm" variant="flat" color={code >= 500 ? 'danger' : code >= 400 ? 'warning' : 'success'}>
    {code >= 500 ? '🔴' : code >= 400 ? '🟡' : '🟢'} {code}
  </Chip>
);

interface EntityLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pathFilter: string;   // ej: "/api/task/5"
  title: string;        // ej: "Logs de tarea: Mi tarea"
}

export const EntityLogsModal = ({ isOpen, onClose, pathFilter, title }: EntityLogsModalProps) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Log | null>(null);

  useEffect(() => {
    if (!isOpen) { setSelected(null); return; }
    setLoading(true);
    logsService.getByPath(pathFilter)
      .then(setLogs)
      .finally(() => setLoading(false));
  }, [isOpen, pathFilter]);

  const isError = selected && selected.statusCode >= 400;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 pb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
            <Icon icon="mdi:file-document-outline" width={20} color="white" />
          </div>
          <div>
            <p className="text-base font-bold">Historial de logs</p>
            <p className="text-xs text-default-400 font-normal">{title}</p>
          </div>
        </ModalHeader>

        <ModalBody className="pb-2">
          {loading ? (
            <div className="flex justify-center py-10"><Spinner color="secondary" size="sm" /></div>
          ) : selected ? (
            /* Vista detalle de un log */
            <div className="flex flex-col gap-3">
              <button onClick={() => setSelected(null)}
                className="flex items-center gap-1 text-xs text-default-400 hover:text-default-600 transition-colors w-fit">
                <Icon icon="mdi:arrow-left" width={14} /> Volver a la lista
              </button>

              <div className="flex items-center justify-between p-3 rounded-lg bg-default-100">
                <span className="text-sm text-default-500 font-medium">Estado HTTP</span>
                <StatusBadge code={selected.statusCode} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-default-100">
                <span className="text-sm text-default-500 font-medium">Fecha y hora</span>
                <span className="text-sm font-mono">{new Date(selected.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-default-100">
                <span className="text-sm text-default-500 font-medium">Endpoint</span>
                <span className="text-sm font-mono break-all">{selected.path}</span>
              </div>
              {selected.errorCode ? (
                <div className={`flex flex-col gap-2 p-3 rounded-lg border ${isError ? 'bg-red-500/10 border-red-500/30' : 'bg-default-100 border-default-200'}`}>
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:bug-outline" width={16} className={isError ? 'text-red-400' : 'text-default-400'} />
                    <span className={`text-sm font-semibold ${isError ? 'text-red-400' : 'text-default-500'}`}>Detalle del error</span>
                  </div>
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all leading-relaxed max-h-40 overflow-y-auto">
                    {selected.errorCode}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Icon icon="mdi:check-circle-outline" width={16} className="text-emerald-400" />
                  <span className="text-sm text-emerald-400">Sin errores registrados</span>
                </div>
              )}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-default-400">
              <Icon icon="mdi:file-search-outline" width={36} />
              <p className="text-sm">Sin logs registrados para este elemento</p>
            </div>
          ) : (
            /* Lista de logs */
            <div className="flex flex-col gap-2">
              {logs.map(log => (
                <button key={log.id} onClick={() => setSelected(log)}
                  className="flex items-center justify-between p-3 rounded-lg bg-default-100 hover:bg-default-200 transition-colors text-left w-full">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-mono text-foreground">{log.path}</span>
                    <span className="text-xs text-default-400">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge code={log.statusCode} />
                    <Icon icon="mdi:chevron-right" width={16} className="text-default-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
