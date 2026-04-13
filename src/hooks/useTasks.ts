import { useState, useEffect, useCallback } from 'react';
import { useDisclosure, addToast } from '@heroui/react';
import { useAuth } from '@context/AuthContext';
import { taskService, type Task } from '@api/endpoints/task.service';
import { validateTaskForm, trimTaskForm, type TaskFormValues, type TaskFormErrors } from '@utils/validators/task.validators';
import { parseApiErrors } from '@utils/apiErrors';
import { logger } from '@utils/logger';

const EMPTY_FORM: TaskFormValues = { name: '', description: '', priority: false };

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks]           = useState<Task[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [selected, setSelected]     = useState<Task | null>(null);
  const [form, setForm]             = useState<TaskFormValues>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<TaskFormErrors>({});

  const drawer      = useDisclosure();
  const deleteModal = useDisclosure();

  const loadTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setTasks(await taskService.getMyTasks(user.sub));
    } catch (err) {
      addToast({ title: 'Error', description: err instanceof Error ? err.message : 'Error al cargar tareas.', color: 'danger' });
      logger.error('useTasks load error', { userId: user.sub });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const openCreate = () => {
    setSelected(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    drawer.onOpen();
  };

  const openEdit = (task: Task) => {
    setSelected(task);
    setForm({ name: task.name, description: task.description, priority: task.priority });
    setFormErrors({});
    drawer.onOpen();
  };

  const openConfirmDelete = (task: Task) => {
    setSelected(task);
    deleteModal.onOpen();
  };

  const handleSave = async () => {
    if (!user) return;

    const errors = validateTaskForm(form);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    const trimmed = trimTaskForm(form);
    setSaving(true);
    try {
      if (selected) {
        await taskService.update(selected.id, trimmed, user.sub);
        addToast({ title: 'Tarea actualizada', description: `"${trimmed.name}" fue actualizada correctamente.`, color: 'success' });
      } else {
        await taskService.create({ ...trimmed, user_id: user.sub }, user.sub);
        addToast({ title: 'Tarea creada', description: `"${trimmed.name}" fue creada correctamente.`, color: 'success' });
      }
      drawer.onClose();
      await loadTasks();
    } catch (err) {
      const msg     = err instanceof Error ? err.message : 'Error al guardar.';
      const mapped  = parseApiErrors(msg);
      const general = mapped['_general'];
      const fieldErrors = Object.fromEntries(Object.entries(mapped).filter(([k]) => k !== '_general'));
      if (Object.keys(fieldErrors).length > 0) setFormErrors(fieldErrors as TaskFormErrors);
      if (general || Object.keys(fieldErrors).length === 0) addToast({ title: 'Error', description: general ?? msg, color: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !selected) return;
    try {
      await taskService.remove(selected.id, user.sub);
      addToast({ title: 'Tarea eliminada', description: `"${selected.name}" fue eliminada.`, color: 'success' });
      await loadTasks();
    } catch (err) {
      addToast({ title: 'Error', description: err instanceof Error ? err.message : 'Error al eliminar.', color: 'danger' });
    }
  };

  return {
    tasks, loading, saving, selected, form, setForm, formErrors,
    drawer, deleteModal,
    openCreate, openEdit, openConfirmDelete, handleSave, handleDelete,
  };
};
