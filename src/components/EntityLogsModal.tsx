import { Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useEntityLogs } from '@hooks/useEntityLogs';
import { StatusBadge } from '@components/StatusBadge';
import { LogDetailModal } from '@components/LogDetailModal';

interface EntityLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pathFilter: string;
  title: string;
}

export const EntityLogsModal = ({ isOpen, onClose, pathFilter, title }: EntityLogsModalProps) => {
  const { logs, loading, selected, setSelected } = useEntityLogs(isOpen, pathFilter);

  return (
    <>
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
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-default-400">
                <Icon icon="mdi:file-search-outline" width={36} />
                <p className="text-sm">Sin logs registrados para este elemento</p>
              </div>
            ) : (
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

      <LogDetailModal isOpen={!!selected} onClose={() => setSelected(null)} log={selected} />
    </>
  );
};
