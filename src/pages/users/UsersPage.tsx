import { useState, useEffect, useCallback } from 'react';
import { Spinner, useDisclosure, Button } from '@heroui/react';
import { useAuth } from '@context/AuthContext';
import { userService, type User, type UpdateUserPayload } from '@services/user.service';
import { GenericCard } from '@components/ui/GenericCard';
import { GenericRenderTitle } from '@components/ui/GenericRenderTitle';
import { GenericTable } from '@components/ui/GenericTable';
import { GenericDrawer } from '@components/ui/GenericDrawer';
import { ConfirmActionModal } from '@components/ui/ConfirmActionModal';
import { ActionButton } from '@components/ui/ActionButton';
import { Input } from '@components/ui/Input';
import { Alert } from '@components/ui/Alert';
import { logger } from '@utils/logger';
import type { ColumnDefinition } from '@components/ui/configs/GenericTableConfigs';

const COLUMNS: ColumnDefinition[] = [
  { name: 'ID',       uid: 'id',        sortable: true  },
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

export const UsersPage = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserPayload>({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: openDelete, onOpenChange: changeDelete } = useDisclosure();

  const loadUsers = useCallback(async () => {
    if (!authUser) return;
    setLoading(true);
    try { setUsers(await userService.getAll(authUser.sub)); }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios.');
      logger.error('UsersPage load error', { adminId: authUser.sub });
    } finally { setLoading(false); }
  }, [authUser]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const openEdit = (u: User) => {
    setSelected(u);
    setEditForm({ name: u.name, lastName: u.lastName, username: u.username });
    setFormError('');
    openDrawer();
  };

  const openConfirmDelete = (u: User) => { setSelected(u); openDelete(); };

  const handleUpdate = async () => {
    if (!authUser || !selected) return;
    setSaving(true); setFormError('');
    try {
      await userService.update(selected.id, editForm, authUser.sub);
      closeDrawer();
      await loadUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al actualizar.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!authUser || !selected) return;
    try { await userService.remove(selected.id, authUser.sub); await loadUsers(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Error al eliminar.'); }
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

      {error && <Alert message={error} />}

      <GenericCard>
        {loading
          ? <div className="flex justify-center items-center py-16"><Spinner color="primary" size="sm" /></div>
          : <GenericTable data={users} columns={COLUMNS} renderCell={renderCell} defaultSortColumn="id" />
        }
      </GenericCard>

      {/* Drawer editar usuario */}
      <GenericDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title="Editar usuario"
        subtitle="Modifica los datos del usuario"
        body={
          <div className="flex flex-col gap-4 pt-2">
            {formError && <Alert message={formError} />}
            <Input id="edit-name"     label="Nombre"   value={editForm.name ?? ''}     onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} required />
            <Input id="edit-lastName" label="Apellido" value={editForm.lastName ?? ''} onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))} required />
            <Input id="edit-username" label="Usuario"  value={editForm.username ?? ''} onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))} required />
            <Input id="edit-password" label="Nueva contraseña (opcional)" type="password"
              value={editForm.password ?? ''} onChange={e => setEditForm(p => ({ ...p, password: e.target.value }))} />
          </div>
        }
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="flat" onPress={closeDrawer}>Cancelar</Button>
            <Button color="primary" isLoading={saving} onPress={handleUpdate}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
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
