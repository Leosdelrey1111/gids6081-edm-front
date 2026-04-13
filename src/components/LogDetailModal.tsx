import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { Icon } from '@iconify/react';
import { StatusBadge } from '@components/StatusBadge';
import type { Log } from '@api/endpoints/logs.service';

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: Log | null;
}

export const LogDetailModal = ({ isOpen, onClose, log }: LogDetailModalProps) => {
  const isError = log && log.statusCode >= 400;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 pb-2">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-lg ${isError ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'}`}>
            <Icon icon={isError ? 'mdi:alert-circle' : 'mdi:check-circle'} width={20} color="white" />
          </div>
          <div>
            <p className="text-base font-bold">Detalle del evento</p>
            <p className="text-xs text-default-400 font-normal">{log?.path}</p>
          </div>
        </ModalHeader>

        <ModalBody className="pb-2">
          {log && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-default-100">
                <span className="text-sm text-default-500 font-medium">Estado HTTP</span>
                <StatusBadge code={log.statusCode} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-default-100">
                <span className="text-sm text-default-500 font-medium">Fecha y hora</span>
                <span className="text-sm font-mono">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-default-100">
                <span className="text-sm text-default-500 font-medium">Endpoint</span>
                <span className="text-sm font-mono break-all text-foreground">{log.path}</span>
              </div>
              {log.errorCode ? (
                <div className={`flex flex-col gap-2 p-3 rounded-lg border ${isError ? 'bg-red-500/10 border-red-500/30' : 'bg-default-100 border-default-200'}`}>
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:bug-outline" width={16} className={isError ? 'text-red-400' : 'text-default-400'} />
                    <span className={`text-sm font-semibold ${isError ? 'text-red-400' : 'text-default-500'}`}>Detalle del error</span>
                  </div>
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all text-foreground leading-relaxed max-h-40 overflow-y-auto">{log.errorCode}</pre>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Icon icon="mdi:check-circle-outline" width={16} className="text-emerald-400" />
                  <span className="text-sm text-emerald-400">Sin errores registrados en este evento</span>
                </div>
              )}
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
