import { useState, useEffect } from 'react';
import { addToast } from '@heroui/react';
import { useAuth } from '@context/AuthContext';
import { taskService, type Task } from '@api/endpoints/task.service';

export const useDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    taskService
      .getMyTasks(user.sub)
      .then(setTasks)
      .catch(err => addToast({ title: 'Error', description: err instanceof Error ? err.message : 'Error al cargar tareas.', color: 'danger' }))
      .finally(() => setLoading(false));
  }, [user]);

  const total  = tasks.length;
  const high   = tasks.filter(t => t.priority).length;
  const normal = total - high;

  return { user, tasks, loading, total, high, normal };
};
