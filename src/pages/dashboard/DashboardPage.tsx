import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Chip, addToast } from '@heroui/react';
import { LayoutDashboard, CheckSquare, Users, AlertCircle, CheckCircle, User, Zap, Clock, Inbox } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { taskService, type Task } from '@services/task.service';
import { GenericCard } from '@components/ui/GenericCard';
import { GenericRenderTitle } from '@components/ui/GenericRenderTitle';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    taskService.getMyTasks(user.sub)
      .then(setTasks)
      .catch(err => addToast({ title: 'Error', description: err instanceof Error ? err.message : 'Error al cargar tareas.', color: 'danger' }))
      .finally(() => setLoading(false));
  }, [user]);

  const total  = tasks.length;
  const high   = tasks.filter(t => t.priority).length;
  const normal = total - high;

  const stats = [
    { icon: <CheckSquare size={22} className="text-success" />,  value: loading ? '—' : total,       label: 'Total de tareas',  bg: 'bg-success/10' },
    { icon: <AlertCircle size={22} className="text-danger" />,   value: loading ? '—' : high,        label: 'Alta prioridad',   bg: 'bg-danger/10'  },
    { icon: <CheckCircle size={22} className="text-success" />,  value: loading ? '—' : normal,      label: 'Prioridad normal', bg: 'bg-success/10' },
    { icon: <User        size={22} className="text-primary" />,  value: user?.name ?? '—',            label: 'Usuario activo',   bg: 'bg-primary/10' },
  ];

  const quickLinks = [
    { icon: <CheckSquare size={22} />, label: 'Mis Tareas', to: '/tasks' },
    { icon: <Users       size={22} />, label: 'Usuarios',   to: '/users' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <GenericRenderTitle
          title={`Bienvenido, ${user?.name ?? ''}`}
          subtitle="Aquí tienes un resumen de tu actividad"
          icon={<LayoutDashboard size={18} color="white" />}
          boxColor="green"
        />
        <Button color="success" className="text-white font-semibold w-full sm:w-auto" onPress={() => navigate('/tasks')}>
          + Nueva tarea
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <GenericCard key={s.label}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-black text-foreground tracking-tight leading-none">{s.value}</p>
                <p className="text-xs text-default-500 font-medium mt-1">{s.label}</p>
              </div>
            </div>
          </GenericCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        <GenericCard>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Zap size={18} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">Accesos Rápidos</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map(q => (
              <button key={q.label} onClick={() => navigate(q.to)}
                className="flex flex-col items-center gap-3 p-5 bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100/10 rounded-xl cursor-pointer transition-all duration-200 text-default-500 text-xs font-medium text-center hover:bg-success/10 hover:border-success/30 hover:text-success hover:-translate-y-1 hover:shadow-lg">
                <div className="w-10 h-10 rounded-lg bg-default-200 dark:bg-default-100/10 flex items-center justify-center">{q.icon}</div>
                {q.label}
              </button>
            ))}
          </div>
        </GenericCard>

        <GenericCard>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Clock size={18} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">Tareas Recientes</span>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-5 h-5 border-2 border-success border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-default-400">
              <Inbox size={36} className="opacity-50" />
              <p className="text-sm">No tienes tareas aún</p>
            </div>
          ) : (
            <div className="divide-y divide-default-100 dark:divide-default-50/10">
              {tasks.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between px-2 py-3 hover:bg-default-50 dark:hover:bg-default-100/5 transition-colors rounded-lg">
                  <span className="text-foreground text-sm font-medium truncate flex-1 mr-3">{t.name}</span>
                  <Chip size="sm" variant="flat" color={t.priority ? 'danger' : 'success'} className="font-semibold flex-shrink-0">
                    {t.priority ? 'Alta' : 'Normal'}
                  </Chip>
                </div>
              ))}
            </div>
          )}
        </GenericCard>
      </div>
    </div>
  );
};
