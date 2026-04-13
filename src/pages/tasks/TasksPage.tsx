import { Chip, Spinner, Button, Checkbox } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTasks } from '@hooks/useTasks';
import { AppIcon } from '@components/AppIcon';
import { GenericCard } from '@components/GenericCard';
import { GenericRenderTitle } from '@components/GenericRenderTitle';
import { GenericTable } from '@components/GenericTable';
import { GenericDrawer } from '@components/GenericDrawer';
import { ConfirmActionModal } from '@components/ConfirmActionModal';
import { ActionButton } from '@components/ActionButton';
import { Input } from '@components/Input';
import type { Task } from '@api/endpoints/task.service';
import type { ColumnDefinition } from '@components/configs/GenericTableConfigs';

const COLUMNS: ColumnDefinition[] = [
  { name: 'Nombre',      uid: 'name',        sortable: true  },
  { name: 'Descripción', uid: 'description', sortable: false },
  { name: 'Prioridad',   uid: 'priority',    sortable: true  },
  { name: 'Acciones',    uid: 'actions',     sortable: false },
];

export const TasksPage = () => {
  const {
    tasks, loading, saving, selected, form, setForm, formErrors,
    drawer, deleteModal,
    openCreate, openEdit, openConfirmDelete, handleSave, handleDelete,
  } = useTasks();

  const renderCell = (task: Task, key: string) => {
    switch (key) {
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
      <GenericRenderTitle title="Mis Tareas" subtitle="Administra y organiza tus tareas pendientes" icon={<AppIcon name="task" color="white" />} boxColor="green" />

      <GenericCard>
        {loading
          ? <div className="flex justify-center items-center py-16"><Spinner color="success" size="sm" /></div>
          : <GenericTable data={tasks} columns={COLUMNS} renderCell={renderCell} defaultSortColumn="name"
              topContentExtras={
                <Button size="sm" color="success" className="text-white font-semibold" onPress={openCreate} startContent={<Icon icon="mdi:plus" width={16} />}>
                  Nueva tarea
                </Button>
              }
            />
        }
      </GenericCard>

      <GenericDrawer
        isOpen={drawer.isOpen} onClose={drawer.onClose}
        title={selected ? 'Editar tarea' : 'Nueva tarea'}
        subtitle="Completa la información de la tarea"
        body={
          <div className="flex flex-col gap-4 pt-2">
            <Input id="task-name" label="Nombre" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} error={formErrors.name} maxLength={150} required />
            <Input id="task-desc" label="Descripción" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} error={formErrors.description} maxLength={200} required />
            <Checkbox isSelected={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))} color="success">Alta prioridad</Checkbox>
          </div>
        }
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="flat" onPress={drawer.onClose}>Cancelar</Button>
            <Button color="success" className="text-white" isLoading={saving} onPress={handleSave}>{saving ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        }
      />

      <ConfirmActionModal
        isOpen={deleteModal.isOpen} onOpenChange={deleteModal.onOpenChange}
        title={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg"><AppIcon name="delete" size={20} color="white" /></div>
            <h3 className="text-xl font-bold">Eliminar tarea</h3>
          </div>
        }
        description={<p>¿Estás seguro de eliminar la tarea <strong>{selected?.name}</strong>?</p>}
        onConfirm={handleDelete} onCancel={() => {}}
      />
    </div>
  );
};
