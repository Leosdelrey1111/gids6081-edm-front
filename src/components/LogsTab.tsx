import { useState, useEffect, useCallback } from "react";
import {
  Chip,
  Spinner,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { logsService, type Log } from "@services/logs.service";
import { GenericTable } from "@/components/GenericTable";
import { ActionButton } from "@/components/ActionButton";
import { Icon } from "@iconify/react";
import type { ColumnDefinition } from "@/components/configs/GenericTableConfigs";

const COLUMNS: ColumnDefinition[] = [
  { name: "Acción", uid: "path", sortable: true },
  { name: "Estado", uid: "statusCode", sortable: true },
  { name: "Fecha", uid: "timestamp", sortable: true },
  { name: "Detalle", uid: "actions", sortable: false },
];

const StatusBadge = ({ code }: { code: number }) => (
  <Chip
    size="sm"
    variant="flat"
    color={code >= 500 ? "danger" : code >= 400 ? "warning" : "success"}
  >
    {code >= 500 ? "🔴" : code >= 400 ? "🟡" : "🟢"} {code}
  </Chip>
);

interface LogsTabProps {
  pathFilter: string;
}

export const LogsTab = ({ pathFilter }: LogsTabProps) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Log | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLogs(await logsService.getByPath(pathFilter));
    } catch (err) {
      addToast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Error al cargar logs.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [pathFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const renderCell = (log: Log, key: string) => {
    switch (key) {
      case "path":
        return (
          <span className="font-mono text-xs text-foreground">{log.path}</span>
        );
      case "statusCode":
        return <StatusBadge code={log.statusCode} />;
      case "timestamp":
        return (
          <span className="text-default-400 text-xs">
            {new Date(log.timestamp).toLocaleString()}
          </span>
        );
      case "actions":
        return (
          <ActionButton
            typeButton="view"
            onPress={() => {
              setSelected(log);
              onOpen();
            }}
          />
        );
      default:
        return null;
    }
  };

  const isError = selected && selected.statusCode >= 400;

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner color="secondary" size="sm" />
        </div>
      ) : (
        <GenericTable
          data={logs}
          columns={COLUMNS}
          renderCell={renderCell}
          defaultSortColumn="timestamp"
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3 pb-2">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-lg ${isError ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-emerald-500 to-emerald-600"}`}
            >
              <Icon
                icon={isError ? "mdi:alert-circle" : "mdi:check-circle"}
                width={20}
                color="white"
              />
            </div>
            <div>
              <p className="text-base font-bold">Detalle del evento</p>
              <p className="text-xs text-default-400 font-normal">
                {selected?.path}
              </p>
            </div>
          </ModalHeader>
          <ModalBody className="pb-2">
            {selected && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-default-100">
                  <span className="text-sm text-default-500 font-medium">
                    Estado HTTP
                  </span>
                  <StatusBadge code={selected.statusCode} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-default-100">
                  <span className="text-sm text-default-500 font-medium">
                    Fecha y hora
                  </span>
                  <span className="text-sm font-mono">
                    {new Date(selected.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-default-100">
                  <span className="text-sm text-default-500 font-medium">
                    Endpoint
                  </span>
                  <span className="text-sm font-mono break-all text-foreground">
                    {selected.path}
                  </span>
                </div>
                {selected.errorCode ? (
                  <div
                    className={`flex flex-col gap-2 p-3 rounded-lg border ${isError ? "bg-red-500/10 border-red-500/30" : "bg-default-100 border-default-200"}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:bug-outline"
                        width={16}
                        className={
                          isError ? "text-red-400" : "text-default-400"
                        }
                      />
                      <span
                        className={`text-sm font-semibold ${isError ? "text-red-400" : "text-default-500"}`}
                      >
                        Detalle del error
                      </span>
                    </div>
                    <pre className="text-xs font-mono whitespace-pre-wrap break-all text-foreground leading-relaxed max-h-40 overflow-y-auto">
                      {selected.errorCode}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Icon
                      icon="mdi:check-circle-outline"
                      width={16}
                      className="text-emerald-400"
                    />
                    <span className="text-sm text-emerald-400">
                      Sin errores registrados en este evento
                    </span>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
