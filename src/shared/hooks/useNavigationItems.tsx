import type { ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '@context/AuthContext';

export interface NavSection {
  section: string;
  items: { url: string; label: string; icon: ReactNode }[];
}

const Ico = {
  grid:  <Icon icon="mdi:view-dashboard-outline" width={18} />,
  check: <Icon icon="mdi:clipboard-check-outline" width={18} />,
  users: <Icon icon="mdi:account-group-outline" width={18} />,
};

/** Items de navegación filtrados por rol — separación de funciones */
export function useNavigationItems(): NavSection[] {
  const { isAdmin } = useAuth();
  const sections: NavSection[] = [
    {
      section: 'General',
      items: [
        { url: '/dashboard', label: 'Dashboard',  icon: Ico.grid  },
        { url: '/tasks',     label: 'Mis Tareas', icon: Ico.check },
      ],
    },
  ];
  if (isAdmin) {
    sections.push({ section: 'Administración', items: [{ url: '/users', label: 'Usuarios', icon: Ico.users }] });
  }
  return sections;
}
