import { useState, useEffect, useCallback } from 'react';
import { useDisclosure, addToast } from '@heroui/react';
import { useAuth } from '@context/AuthContext';
import { userService, type User, type CreateUserPayload, type UpdateUserPayload } from '@api/endpoints/user.service';
import { validateCreateUser, validateUpdateUser, trimCreateUser, trimUpdateUser } from '@utils/validators/user.validators';
import { parseApiErrors } from '@utils/apiErrors';
import { logger } from '@utils/logger';

const EMPTY_CREATE: CreateUserPayload = { name: '', lastName: '', username: '', password: '' };

export const useUsers = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers]           = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [selected, setSelected]     = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserPayload>(EMPTY_CREATE);
  const [editForm, setEditForm]     = useState<UpdateUserPayload>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const drawer      = useDisclosure();
  const deleteModal = useDisclosure();

  const loadUsers = useCallback(async () => {
    if (!authUser) return;
    setLoading(true);
    try {
      setUsers(await userService.getAll(authUser.sub));
    } catch (err) {
      addToast({ title: 'Error', description: err instanceof Error ? err.message : 'Error al cargar usuarios.', color: 'danger' });
      logger.error('useUsers load error', { userId: authUser.sub });
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const openCreate = () => {
    setIsCreating(true);
    setCreateForm(EMPTY_CREATE);
    setFormErrors({});
    drawer.onOpen();
  };

  const openEdit = (u: User) => {
    setIsCreating(false);
    setSelected(u);
    setEditForm({ name: u.name, lastName: u.lastName, username: u.username });
    setFormErrors({});
    drawer.onOpen();
  };

  const openConfirmDelete = (u: User) => {
    setSelected(u);
    deleteModal.onOpen();
  };

  const handleSave = async () => {
    if (!authUser) return;

    const errors = isCreating ? validateCreateUser(createForm) : validateUpdateUser(editForm);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setSaving(true);
    try {
      if (isCreating) {
        const trimmed = trimCreateUser(createForm);
        await userService.create(trimmed, authUser.sub);
        addToast({ title: 'Usuario creado', description: `El usuario "${trimmed.username}" fue creado correctamente.`, color: 'success' });
      } else {
        const trimmed = trimUpdateUser(editForm);
        await userService.update(selected!.id, trimmed, authUser.sub);
        addToast({ title: 'Usuario actualizado', description: 'Los datos del usuario fueron actualizados.', color: 'success' });
      }
      drawer.onClose();
      await loadUsers();
    } catch (err) {
      const msg     = err instanceof Error ? err.message : 'Error al guardar.';
      const mapped  = parseApiErrors(msg);
      const general = mapped['_general'];
      const fieldErrors = Object.fromEntries(Object.entries(mapped).filter(([k]) => k !== '_general'));
      if (Object.keys(fieldErrors).length > 0) setFormErrors(fieldErrors);
      if (general || Object.keys(fieldErrors).length === 0) addToast({ title: 'Error', description: general ?? msg, color: 'danger' });
    } finally {
      setSaving(false);
    }
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

  return {
    users, loading, saving, selected, isCreating,
    createForm, setCreateForm, editForm, setEditForm, formErrors,
    authUser, drawer, deleteModal,
    openCreate, openEdit, openConfirmDelete, handleSave, handleDelete,
  };
};
