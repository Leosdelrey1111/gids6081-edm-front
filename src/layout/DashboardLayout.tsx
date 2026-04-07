import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useNavigationItems } from '@shared/hooks/useNavigationItems';
import { Avatar, Button, Card, CardBody, CardFooter, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const getInitials = (name = '', last = '') =>
  `${name[0] ?? ''}${last[0] ?? ''}`.toUpperCase() || 'U';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tasks':     'Mis Tareas',
  '/users':     'Usuarios',
};

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navSections = useNavigationItems();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setCollapsed(w < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const pageTitle = titles[location.pathname] ?? 'EDM App';

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="relative flex group">
          <Button isIconOnly onPress={() => setCollapsed(c => !c)} radius="full" variant="flat" size="sm"
            className={`absolute z-50 transition-all duration-300
              bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
              border border-gray-200/50 dark:border-gray-700/50
              hover:bg-white/90 dark:hover:bg-gray-700/90 hover:scale-105 active:scale-95 shadow-lg
              ${isMobile
                ? 'top-4 left-4 opacity-100 visible'
                : 'top-12 left-[calc(100%-20px)] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:left-[calc(100%-16px)]'
              }`}>
            {collapsed ? <Icon icon="mdi:chevron-right" width={16} /> : <Icon icon="mdi:chevron-left" width={16} />}
          </Button>

          <motion.div
            className={`flex-grow flex flex-col dark:border-r dark:border-gray-700 ${isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'}`}
            animate={{ width: collapsed ? (isMobile ? 0 : 88) : (isMobile ? 280 : 280), x: isMobile && collapsed ? -280 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <Card className={`flex flex-col flex-grow bg-white dark:bg-[#18191a] rounded-sm p-2 h-full ${collapsed && !isMobile ? 'w-22' : 'w-70'}`}>
              {/* User info */}
              <div className="flex-shrink-0 p-3">
                {collapsed && !isMobile ? (
                  <div className="flex flex-col items-center py-2 gap-2">
                    <Avatar name={getInitials(user?.name, user?.lastName)} size="md"
                      className="bg-success text-white font-bold ring-2 ring-success/30" />
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                    <Avatar name={getInitials(user?.name, user?.lastName)} size="md"
                      className="bg-success text-white font-bold ring-2 ring-success/30 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user?.name} {user?.lastName}</p>
                      <p className="text-xs text-success font-medium capitalize">{user?.role}</p>
                    </div>
                  </motion.div>
                )}
                <div className="px-1 pt-3 pb-1">
                  <div className="h-px bg-gradient-to-r from-transparent via-success/50 to-transparent" />
                </div>
              </div>

              {/* Nav */}
              <CardBody className="flex-grow overflow-y-auto text-gray-300 px-1 pt-0">
                {navSections.map(({ section, items }) => (
                  <div key={section}>
                    {!collapsed && (
                      <h2 className="text-xs uppercase text-gray-400 tracking-wide pl-3 mt-2 mb-1">{section}</h2>
                    )}
                    <nav className="space-y-1 px-1 mb-3">
                      {items.map(item => {
                        const isActive = location.pathname === item.url;
                        return (
                          <NavLink key={item.url} to={item.url} className="block">
                            <Button fullWidth radius="md" variant="light" color="default" as="span"
                              startContent={<span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-success'}`}>{item.icon}</span>}
                              className={`h-11 transition-all
                                ${collapsed && !isMobile ? 'justify-center px-0' : 'justify-start pl-2'}
                                ${isActive
                                  ? 'bg-success text-white shadow-lg hover:!bg-success/90'
                                  : 'dark:text-gray-400 hover:bg-default-100'
                                }`}>
                              {(!collapsed || isMobile) && <span className="text-sm">{item.label}</span>}
                            </Button>
                          </NavLink>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </CardBody>

              {/* Footer logout */}
              <CardFooter className="mt-auto justify-center">
                <Button isIconOnly={collapsed && !isMobile} variant="light" className="text-danger hover:bg-danger/10 w-full"
                  onPress={() => { logout(); navigate('/login', { replace: true }); }}>
                  <Icon icon="mdi:logout" width={20} />
                  {(!collapsed || isMobile) && <span className="ml-2 text-sm font-medium">Cerrar sesión</span>}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="h-screen flex flex-col flex-grow overflow-x-hidden">
        <div className="min-w-full min-h-full overflow-auto">
          <Card className="min-w-full min-h-full flex flex-col bg-[#f9fafb] dark:bg-[#18191a] rounded-sm">
            {/* Topbar */}
            <div className="flex items-center px-6 h-14 bg-white dark:bg-[#18191a] border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <span className="text-base font-semibold text-foreground tracking-tight">{pageTitle}</span>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <span className="text-sm text-default-500">{user?.name} {user?.lastName}</span>
                <Chip size="sm" variant="flat" color={user?.role === 'admin' ? 'warning' : 'success'} className="font-semibold capitalize">
                  {user?.role}
                </Chip>
              </div>
            </div>
            <CardBody className="flex-grow p-1 overflow-x-hidden">
              <div className="w-full overflow-x-auto p-6 pb-0">
                <Outlet />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
