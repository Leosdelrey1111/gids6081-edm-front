import { useState, useEffect, useCallback } from 'react';
import { Spinner, useDisclosure, Button, addToast } from '@heroui/react';
import { useAuth } from '@context/AuthContext';
import { userService, type User, type UpdateUserPayload, type CreateUserPayload } from '@services/user.service';
import { GenericCard } from '@components/ui/GenericCard';
import { GenericRenderTitle } from '@components/ui/GenericRenderTitle';
import { GenericTable } from '@components/ui/GenericTable';
import { GenericDrawer } from '@components/ui/GenericDrawer';
import { ConfirmActionModal } from '@components/ui/ConfirmActionModal';
import { ActionButton } from '@components/ui/ActionButton';
import { Input } from '@components/ui/Input';
import { logger } from '@utils/logger';
import { Icon } from '@iconify/react';
import type { ColumnDefinition } from '@components/ui/configs/GenericTableConfigs';

const COLUMNS: ColumnDefinition[] = [
  { name: 'Nombre',   uid: 'name',      sortable: true  },
  { name: 'Apellido', uid: 'lastName',  sortable: true  },
  { name: 'Usuario',  uid: 'username',  sortable: true  },
  { name: 'Creado',   uid: 'createdAt', sortable: true  },
  { name: 'Acciones', uid: 'actions',   sortable: false },
];

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const emptyCreate = (): CreateUserPayload => ({ name: '', lastName: '', username: '', password: '' });

export const UsersPage = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserPayload>({});
  const [createForm, setCreateForm] = useState<CreateUserPayload>(emptyCreate());
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: openDelete, onOpenChange: changeDelete } = useDisclosure();

  const loadUsers = useCallback(async () => {
    if (!authUser) return;
    setLoading(true);
    try { setUsers(await userService.getAll(authUser.sub)); }
    catch (err) {
      addToast({ title: 'Error', description: err instanceof Error ? err.message : 'Error al cargar usuarios.', color: 'danger' });
      logger.error('UsersPage load error', { userId: authUser.sub });
    } finally { setLoading(false); }
  }, [authUser]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const openCreate = () => {
    setIsCreating(true);
    setCreateForm(emptyCreate());
    setFormError('');
    openDrawer();
  };

  const openEdit = (u: User) => {
    setIsCreating(false);
    setSelected(u);
    setEditForm({ name: u.name, lastName: u.lastName, username: u.username });
    setFormError('');
    openDrawer();
  };

  const openConfirmDelete = (u: User) => { setSelected(u); openDelete(); };

  const handleSave = async () => {
    if (!authUser) return;
    setSaving(true); setFormError('');
    try {
      if (isCreating) {
        await userService.create(createForm, authUser.sub);
        addToast({ title: 'Usuario creado', description: `El usuario "${createForm.username}" fue creado correctamente.`, color: 'success' });
      } else {
        await userService.update(selected!.id, editForm, authUser.sub);
        addToast({ title: 'Usuario actualizado', description: 'Los datos del usuario fueron actualizados.', color: 'success' });
      }
      closeDrawer();
      await loadUsers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar.';
      addToast({ title: 'Error', description: msg, color: 'danger' });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!authUser || !selected) return;
    try {
      await userService.remove(selected.id, authUser.sub);
      addToast({ title: 'Usuario eliminado', description: `El usuario "${selected.username}" fue eliminado.`, color: 'success' });
      await loadUsers();
    } catch (err) {
      addToast({ title: 'Error', description: err instanceof Error ? err.message : 'Error al eliminar.', color: 'danger' });
    }
  };

  const renderCell = (u: User, key: string) => {
    switch (key) {
      case 'id':        return <span className="text-default-400 text-xs">{u.id}</span>;
      case 'name':      return <span className="font-medium text-foreground">{u.name}</span>;
      case 'lastName':  return <span className="text-foreground">{u.lastName}</span>;
      case 'username':  return <span className="text-default-500 text-sm">{u.username}</span>;
      case 'createdAt': return <span className="text-default-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</span>;
      case 'actions':   return (
        <div className="flex gap-1 justify-center">
          <ActionButton typeButton="edit" onPress={() => openEdit(u)} />
          {u.id !== authUser?.sub && (
            <ActionButton typeButton="delete" onPress={() => openConfirmDelete(u)} />
          )}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <GenericRenderTitle
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios registrados en el sistema"
        icon={<UsersIcon />}
        boxColor="blue"
      />

      <GenericCard>
        {loading
          ? <div className="flex justify-center items-center py-16"><Spinner color="primary" size="sm" /></div>
          : <GenericTable data={users} columns={COLUMNS} renderCell={renderCell} defaultSortColumn="name"
              topContentExtras={
                <Button size="sm" color="primary" className="font-semibold" onPress={openCreate}
                  startContent={<Icon icon="mdi:plus" width={16} />}>
                  Nuevo usuario
                </Button>
              }
            />
        }
      </GenericCard>


      {/* Drawer crear / editar */}
      <GenericDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={isCreating ? 'Nuevo usuario' : 'Editar usuario'}
        subtitle={isCreating ? 'Completa los datos del nuevo usuario' : 'Modifica los datos del usuario'}
        body={
          <div className="flex flex-col gap-4 pt-2">
            {isCreating ? (
              <>
                <Input id="c-name"     label="Nombre"      value={createForm.name}     onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} required />
                <Input id="c-lastName" label="Apellido"    value={createForm.lastName} onChange={e => setCreateForm(p => ({ ...p, lastName: e.target.value }))} required />
                <Input id="c-username" label="Usuario"     value={createForm.username} onChange={e => setCreateForm(p => ({ ...p, username: e.target.value }))} required />
                <Input id="c-password" label="Contraseña"  type="password" value={createForm.password} onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))} required />
              </>
            ) : (
              <>
                <Input id="e-name"     label="Nombre"   value={editForm.name ?? ''}     onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} required />
                <Input id="e-lastName" label="Apellido" value={editForm.lastName ?? ''} onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))} required />
                <Input id="e-username" label="Usuario"  value={editForm.username ?? ''} onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))} required />
              </>
            )}
          </div>
        }
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="flat" onPress={closeDrawer}>Cancelar</Button>
            <Button color="primary" isLoading={saving} onPress={handleSave}>
              {saving ? 'Guardando...' : isCreating ? 'Crear usuario' : 'Guardar cambios'}
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
            <h3 className="text-xl font-bold">Eliminar usuario</h3>
          </div>
        }
        description={<p>¿Estás seguro de eliminar al usuario <strong>{selected?.name} {selected?.lastName}</strong>?</p>}
        onConfirm={handleDelete}
        onCancel={() => {}}
      />
    </div>
  );
};
