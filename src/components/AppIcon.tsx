import {
  LayoutDashboard, CheckSquare, Users, AlertCircle,
  CheckCircle, User, Zap, Clock, Inbox,
} from 'lucide-react';

type AppIconName =
  | 'task' | 'users' | 'log' | 'delete'
  | 'dashboard' | 'checkSquare' | 'usersGroup'
  | 'alertCircle' | 'checkCircle' | 'user'
  | 'zap' | 'clock' | 'inbox';

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  className?: string;
}

const SVG_ICONS: Record<string, (size: number, color: string) => JSX.Element> = {
  task: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  users: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  log: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  delete: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  ),
};

const LUCIDE_ICONS: Record<string, React.FC<{ size?: number; className?: string; color?: string }>> = {
  dashboard:    LayoutDashboard,
  checkSquare:  CheckSquare,
  usersGroup:   Users,
  alertCircle:  AlertCircle,
  checkCircle:  CheckCircle,
  user:         User,
  zap:          Zap,
  clock:        Clock,
  inbox:        Inbox,
};

export const AppIcon = ({ name, size = 18, color = 'currentColor', className }: AppIconProps) => {
  if (name in SVG_ICONS) return SVG_ICONS[name](size, color);
  const LucideIcon = LUCIDE_ICONS[name];
  if (LucideIcon) return <LucideIcon size={size} color={color} className={className} />;
  return null;
};
