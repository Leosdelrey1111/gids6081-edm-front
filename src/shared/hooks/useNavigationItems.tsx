import type { ReactNode } from 'react';
import { LayoutDashboard, CheckSquare, Users } from 'lucide-react';

export interface NavSection {
  section: string;
  items: { url: string; label: string; icon: ReactNode }[];
}

export function useNavigationItems(): NavSection[] {
  return [
    {
      section: 'General',
      items: [
        { url: '/dashboard', label: 'Dashboard',  icon: <LayoutDashboard size={18} /> },
        { url: '/tasks',     label: 'Mis Tareas', icon: <CheckSquare size={18} /> },
      ],
    },
    {
      section: 'Usuarios',
      items: [
        { url: '/users', label: 'Usuarios', icon: <Users size={18} /> },
      ],
    },
  ];
}
