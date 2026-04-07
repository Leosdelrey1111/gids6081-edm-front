import { useState, useEffect, useCallback } from 'react';
import { Chip, Spinner, useDisclosure } from '@heroui/react';
import { useAuth } from '@context/AuthContext';
import { taskService, type Task, type CreateTaskPayload } from '@services/task.service';
import { GenericCard } from '@components/ui/GenericCard';
import { GenericRenderTitle } from '@components/ui/GenericRenderTitle';
import { GenericTable } from '@components/ui/GenericTable';
import { GenericDrawer } from '@components/ui/GenericDrawer';
import { ConfirmActionModal } from '@components/ui/ConfirmActionModal';
import { ActionButton } from '@components/ui/ActionButton';
import { FloatingButton } from '@components/ui/FloatingButton';
import { Input } from '@components/ui/Input';
import { Alert } from '@components/ui/Alert';
import { Button, Checkbox } from '@heroui/react';
import { validateLength } from '@utils/sanitize';
import { logger } from '@utils/logger';
import type { ColumnDefinition } from '@components/ui/configs/GenericTableConfigs';

const COLUMNS: ColumnDefinition[] = [
  { name: '#',           uid: 'id',          sortable: true  },
  { name: 'Nombre',      uid: 'name',        sortable: true  },
  { name: 'Descripción', uid: 'description', sortable: false },
  { name: 'Prioridad',   uid: 'priority',    sortable: true  },
  { name: 'Acciones',    uid: 'actions',     sortable: false },
];

const TaskIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
);

export const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Task | null>(null);

  // Drawer crear/editar
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
  // Modal confirmar eliminar
  const { isOpen: isDeleteOpen, onOpen: openDelete, onOpenChange: changeDelete } = useDisclosure();

  // Form state
  const [form, setForm] = useState({ name: '', description: '', priority: false });
  const [formErrors, setFormErrors] = useState<{ name?: string; description?: string }>({});
  const [formApiError, setFormApiError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError('');
    try { setTasks(await taskService.getMyTasks(user.sub)); }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tareas.');
      logger.error('TasksPage load error', { userId: user.sub });
    } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const openCreate = () => {
    setSelected(null);
    setForm({ name: '', description: '', priority: false });
    setFormErrors({}); setFormApiError('');
    openDrawer();
  };

  const openEdit = (task: Task) => {
    setSelected(task);
    setForm({ name: task.name, description: task.description, priority: task.priority });
    setFormErrors({}); setFormApiError('');
    openDrawer();
  };

  const openConfirmDelete = (task: Task) => { setSelected(task); openDelete(); };

  const validate = () => {
    const errs: typeof formErrors = {};
    if (!validateLength(form.name, 150)) errs.name = 'Nombre requerido (máx 150 chars).';
    if (!validateLength(form.description, 200)) errs.description = 'Descripción requerida (máx 200 chars).';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!user || !validate()) return;
    setSaving(true); setFormApiError('');
    try {
      if (selected) await taskService.update(selected.id, form, user.sub);
      else          await taskService.create({ ...form, user_id: user.sub }, user.sub);
      closeDrawer();
      await loadTasks();
    } catch (err) {
      setFormApiError(err instanceof Error ? err.message : 'Error al guardar.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!user || !selected) return;
    try { await taskService.remove(selected.id, user.sub); await loadTasks(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Error al eliminar.'); }
  };

  const renderCell = (task: Task, key: string) => {
    switch (key) {
      case 'id':          return <span className="text-default-400 text-xs">{task.id}</span>;
      case 'name':        return <span className="font-medium text-foreground">{task.name}</span>;
      case 'description': return <span className="text-default-500 text-sm">{task.description}</span>;
      case 'priority':    return <Chip size="sm" variant="flat" color={task.priority ? 'danger' : 'success'}>{task.priority ? '🔴 Alta' : '🟢 Normal'}</Chip>;
      case 'actions':     return (
        <div className="flex gap-1 justify-center">
          <ActionButton typeButton="edit"   onPress={() => openEdit(task)} />
          <ActionButton typeButton="delete" onPress={() => openConfirmDelete(task)} />
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <GenericRenderTitle title="Mis Tareas" subtitle="Administra y organiza tus tareas pendientes" icon={<TaskIcon />} boxColor="green" />
      </div>

      {error && <Alert message={error} />}

      <GenericCard>
        {loading
          ? <div className="flex justify-center items-center py-16"><Spinner color="success" size="sm" /></div>
          : <GenericTable data={tasks} columns={COLUMNS} renderCell={renderCell} defaultSortColumn="id" />
        }
      </GenericCard>

      {/* Botón flotante agregar */}
      <FloatingButton onPress={openCreate} title="Nueva tarea" position="top-right" />

      {/* Drawer crear / editar */}
      <GenericDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={selected ? 'Editar tarea' : 'Nueva tarea'}
        subtitle="Completa la información de la tarea"
        body={
          <div className="flex flex-col gap-4 pt-2">
            {formApiError && <Alert message={formApiError} />}
            <Input id="task-name" label="Nombre" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              error={formErrors.name} maxLength={150} required />
            <Input id="task-desc" label="Descripción" value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              error={formErrors.description} maxLength={200} required />
            <Checkbox isSelected={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))} color="success">
              Alta prioridad
            </Checkbox>
          </div>
        }
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="flat" onPress={closeDrawer}>Cancelar</Button>
            <Button color="success" className="text-white" isLoading={saving} onPress={handleSave}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        }
      />

      {/* Modal confirmar eliminar */}
      <ConfirmActionModal
        isOpen={isDeleteOpen}
        onOpenChange={changeDelete}
        title={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Eliminar tarea</h3>
          </div>
        }
        description={<p>¿Estás seguro de eliminar la tarea <strong>{selected?.name}</strong>?</p>}
        onConfirm={handleDelete}
        onCancel={() => {}}
      />
    </div>
  );
};
