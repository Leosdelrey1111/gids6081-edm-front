import type { ReactNode } from 'react';
import { Icon } from '@iconify/react';

export interface NavSection {
  section: string;
  items: { url: string; label: string; icon: ReactNode }[];
}

export function useNavigationItems(): NavSection[] {
  return [
    {
      section: 'General',
      items: [
        { url: '/dashboard', label: 'Dashboard',  icon: <Icon icon="mdi:view-dashboard-outline" width={18} /> },
        { url: '/tasks',     label: 'Mis Tareas', icon: <Icon icon="mdi:clipboard-check-outline" width={18} /> },
        { url: '/logs',      label: 'Mis Logs',   icon: <Icon icon="mdi:file-document-outline" width={18} /> },
      ],
    },
    {
      section: 'Usuarios',
      items: [
        { url: '/users', label: 'Usuarios', icon: <Icon icon="mdi:account-group-outline" width={18} /> },
      ],
    },
  ];
}
