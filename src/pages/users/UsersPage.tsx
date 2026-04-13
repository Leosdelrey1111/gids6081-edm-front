import { Spinner, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useUsers } from '@hooks/useUsers';
import { AppIcon } from '@components/AppIcon';
import { GenericCard } from '@components/GenericCard';
import { GenericRenderTitle } from '@components/GenericRenderTitle';
import { GenericTable } from '@components/GenericTable';
import { GenericDrawer } from '@components/GenericDrawer';
import { ConfirmActionModal } from '@components/ConfirmActionModal';
import { ActionButton } from '@components/ActionButton';
import { Input } from '@components/Input';
import type { User } from '@api/endpoints/user.service';
import type { ColumnDefinition } from '@components/configs/GenericTableConfigs';

const COLUMNS: ColumnDefinition[] = [
  { name: 'Nombre',   uid: 'name',      sortable: true  },
  { name: 'Apellido', uid: 'lastName',  sortable: true  },
  { name: 'Usuario',  uid: 'username',  sortable: true  },
  { name: 'Creado',   uid: 'createdAt', sortable: true  },
  { name: 'Acciones', uid: 'actions',   sortable: false },
];

export const UsersPage = () => {
  const {
    users, loading, saving, selected, isCreating,
    createForm, setCreateForm, editForm, setEditForm, formErrors,
    authUser, drawer, deleteModal,
    openCreate, openEdit, openConfirmDelete, handleSave, handleDelete,
  } = useUsers();

  const renderCell = (u: User, key: string) => {
    switch (key) {
      case 'name':      return <span className="font-medium text-foreground">{u.name}</span>;
      case 'lastName':  return <span className="text-foreground">{u.lastName}</span>;
      case 'username':  return <span className="text-default-500 text-sm">{u.username}</span>;
      case 'createdAt': return <span className="text-default-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</span>;
      case 'actions':   return (
        <div className="flex gap-1 justify-center">
          <ActionButton typeButton="edit" onPress={() => openEdit(u)} />
          <ActionButton typeButton="delete" onPress={() => openConfirmDelete(u)} />
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <GenericRenderTitle title="Gestión de Usuarios" subtitle="Administra los usuarios registrados en el sistema" icon={<AppIcon name="users" color="white" />} boxColor="blue" />

      <GenericCard>
        {loading
          ? <div className="flex justify-center items-center py-16"><Spinner color="primary" size="sm" /></div>
          : <GenericTable data={users} columns={COLUMNS} renderCell={renderCell} defaultSortColumn="name"
              topContentExtras={
                <Button size="sm" color="primary" className="font-semibold" onPress={openCreate} startContent={<Icon icon="mdi:plus" width={16} />}>
                  Nuevo usuario
                </Button>
              }
            />
        }
      </GenericCard>

      <GenericDrawer
        isOpen={drawer.isOpen} onClose={drawer.onClose}
        title={isCreating ? 'Nuevo usuario' : 'Editar usuario'}
        subtitle={isCreating ? 'Completa los datos del nuevo usuario' : 'Modifica los datos del usuario'}
        body={
          <div className="flex flex-col gap-4 pt-2">
            {isCreating ? (
              <>
                <Input id="c-name"     label="Nombre"     value={createForm.name}     onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))}     error={formErrors.name}     required />
                <Input id="c-lastName" label="Apellido"   value={createForm.lastName} onChange={e => setCreateForm(p => ({ ...p, lastName: e.target.value }))} error={formErrors.lastName} required />
                <Input id="c-username" label="Usuario"    value={createForm.username} onChange={e => setCreateForm(p => ({ ...p, username: e.target.value }))} error={formErrors.username} required />
                <Input id="c-password" label="Contraseña" value={createForm.password} onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))} error={formErrors.password} type="password" required />
              </>
            ) : (
              <>
                <Input id="e-name"     label="Nombre"   value={editForm.name ?? ''}     onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}     error={formErrors.name}     required />
                <Input id="e-lastName" label="Apellido" value={editForm.lastName ?? ''} onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))} error={formErrors.lastName} required />
                <Input id="e-username" label="Usuario"  value={editForm.username ?? ''} onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))} error={formErrors.username} required />
              </>
            )}
          </div>
        }
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="flat" onPress={drawer.onClose}>Cancelar</Button>
            <Button color="primary" isLoading={saving} onPress={handleSave}>
              {saving ? 'Guardando...' : isCreating ? 'Crear usuario' : 'Guardar cambios'}
            </Button>
          </div>
        }
      />

      <ConfirmActionModal
        isOpen={deleteModal.isOpen} onOpenChange={deleteModal.onOpenChange}
        title={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg"><AppIcon name="delete" size={20} color="white" /></div>
            <h3 className="text-xl font-bold">Eliminar usuario</h3>
          </div>
        }
        description={<p>¿Estás seguro de eliminar al usuario <strong>{selected?.name} {selected?.lastName}</strong>?</p>}
        onConfirm={handleDelete} onCancel={() => {}}
      />
    </div>
  );
};
