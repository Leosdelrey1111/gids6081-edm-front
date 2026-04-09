import { useState, useEffect, useRef, cloneElement, isValidElement } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useNavigationItems } from '@shared/hooks/useNavigationItems';
import { Avatar, Button, Card, CardBody, CardFooter, Popover, PopoverContent, PopoverTrigger, Tooltip } from '@heroui/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, X, LogOut } from 'lucide-react';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { PageTransition } from '@components/ui/PageTransition';

const getInitials = (name = '', last = '') =>
  `${name[0] ?? ''}${last[0] ?? ''}`.toUpperCase() || 'U';

const SIDEBAR_OPEN  = 280;
const SIDEBAR_CLOSED = 88;

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navSections = useNavigationItems();

  const [toggleSidebar, setToggleSidebar] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('sidebar-collapsed');
    if (saved !== null) return saved === 'false';
    return window.innerWidth >= 1024;
  });
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const prevWidth = useRef(window.innerWidth);

  const setAndSave = (val: boolean) => {
    setToggleSidebar(val);
    sessionStorage.setItem('sidebar-collapsed', String(!val));
  };

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      const wasMobile = prevWidth.current < 768;
      const nowMobile = w < 768;
      if (!wasMobile && nowMobile) setAndSave(false);
      if (wasMobile && !nowMobile && w >= 1024) setAndSave(true);
      setIsMobile(nowMobile);
      prevWidth.current = w;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Cerrar en mobile al navegar
  useEffect(() => { if (isMobile) setAndSave(false); }, [location.pathname]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-screen">

        {/* Overlay mobile */}
        {isMobile && toggleSidebar && (
          <button
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setAndSave(false)}
            aria-label="Cerrar menú"
          />
        )}

        {/* Sidebar */}
        <div className="relative flex group">
          {/* Toggle button */}
          <Button
            isIconOnly onPress={() => setAndSave(!toggleSidebar)}
            radius="full" variant="flat" size="sm"
            className={`absolute z-50 transition-all duration-300 ease-in-out
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              shadow-sm hover:shadow-md active:scale-95
              ${isMobile
                ? 'top-4 left-4 opacity-100 visible'
                : 'top-12 left-[calc(100%-20px)] opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}>
            {isMobile
              ? toggleSidebar ? <X size={14} /> : <Menu size={14} />
              : toggleSidebar ? <ChevronLeft size={14} /> : <ChevronRight size={14} />
            }
          </Button>

          <motion.div
            className={`flex-grow flex flex-col dark:border-r dark:border-gray-700 ${isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'}`}
            animate={{
              width: toggleSidebar ? (isMobile ? SIDEBAR_OPEN : SIDEBAR_OPEN) : isMobile ? 0 : SIDEBAR_CLOSED,
              x: isMobile && !toggleSidebar ? -SIDEBAR_OPEN : 0,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <Card className={`flex flex-col flex-grow bg-white dark:bg-[#18191a] rounded-sm p-2 h-full overflow-hidden`}>

              {/* User info */}
              <div className="flex-shrink-0">
                {!toggleSidebar && !isMobile ? (
                  <Tooltip placement="right" delay={300} closeDelay={0}
                    content={<div className="p-2"><p className="font-semibold text-sm">{user?.name} {user?.lastName}</p></div>}>
                    <div className="flex flex-col items-center py-4 gap-2">
                      <Avatar name={getInitials(user?.name, user?.lastName)} size="md"
                        className="bg-primary text-white font-bold ring-2 ring-primary/30 hover:ring-primary/50 transition-all" />
                    </div>
                  </Tooltip>
                ) : (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={getInitials(user?.name, user?.lastName)} size="md"
                        className="bg-primary text-white font-bold ring-2 ring-primary/30 hover:ring-primary/50 hover:scale-105 transition-all flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{user?.name} {user?.lastName}</p>
                        <p className="text-xs text-primary font-medium truncate">Usuario</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div className="px-2 pb-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/50 dark:via-primary/40 to-transparent" />
                </div>
              </div>

              <CardBody className="flex-grow overflow-y-auto overflow-x-hidden text-gray-300 px-1 pt-0">
                {navSections.map(({ section, items }) => (
                  <div key={section}>
                    {toggleSidebar && (
                      <h2 className="text-xs uppercase text-gray-400 tracking-wide pl-3 mt-2 mb-1">{section}</h2>
                    )}
                    <nav className="space-y-1 px-1 mb-3">
                      {items.map(({ url, label, icon }) => {
                        const isActive = location.pathname === url;
                        const styledIcon = isValidElement(icon)
                          ? cloneElement(icon as React.ReactElement<any>, {
                              className: `w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-primary'}`,
                            })
                          : icon;

                        const btn = (
                          <NavLink key={url} to={url} className="block">
                            {toggleSidebar ? (
                              <Button fullWidth radius="md" variant="light" color="default" as="span"
                                startContent={styledIcon}
                                className={`h-11 justify-start pl-2 rounded-sm transition-all
                                  ${isActive
                                    ? 'bg-primary text-white shadow-lg hover:!bg-primary/90'
                                    : 'dark:text-gray-400 hover:bg-default-100'
                                  }`}>
                                <span className="text-sm truncate">{label}</span>
                              </Button>
                            ) : (
                              <Button isIconOnly radius="md" variant="light" color="default" as="span"
                                className={`h-11 w-full transition-all
                                  ${isActive
                                    ? 'bg-primary text-white shadow-lg hover:!bg-primary/90'
                                    : 'dark:text-gray-400 hover:bg-default-100'
                                  }`}>
                                {styledIcon}
                              </Button>
                            )}
                          </NavLink>
                        );

                        return toggleSidebar ? btn : (
                          <Tooltip key={url} placement="right" delay={0} closeDelay={0}
                            content={<div className="px-2 py-1 text-sm">{label}</div>}>
                            {btn}
                          </Tooltip>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </CardBody>

              {/* Footer */}
              <CardFooter className="mt-auto flex-shrink-0">
                {toggleSidebar ? (
                  <div className="flex w-full justify-center items-center gap-4">
                    <ThemeToggle />
                    <Popover backdrop="opaque">
                      <PopoverTrigger asChild>
                        <Button isIconOnly variant="light" className="text-danger hover:bg-danger/10">
                          <LogOut size={16} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-4">
                        <p className="text-sm font-semibold text-center mb-3">¿Cerrar sesión?</p>
                        <div className="flex gap-2">
                          <Button fullWidth size="sm" variant="flat"
                            onPress={() => (document.activeElement as HTMLElement)?.blur()}>
                            Cancelar
                          </Button>
                          <Button fullWidth size="sm" color="danger" className="text-white"
                            onPress={() => { logout(); navigate('/login', { replace: true }); }}>
                            Salir
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-center gap-2">
                    <ThemeToggle />
                    <Tooltip placement="right" delay={0} closeDelay={0} content={<div className="px-2 py-1 text-sm">Cerrar sesión</div>}>
                      <Button isIconOnly variant="light" className="text-danger hover:bg-danger/10"
                        onPress={() => { logout(); navigate('/login', { replace: true }); }}>
                        <LogOut size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="h-screen flex flex-col flex-grow overflow-x-hidden min-w-0">
        <div className="min-w-full min-h-full overflow-auto">
          <Card className="min-w-full min-h-full flex flex-col bg-[#f9fafb] dark:bg-[#18191a] rounded-sm">
            <CardBody className="flex-grow p-1 overflow-x-hidden">
              <div className="w-full p-6 pb-0">
                <PageTransition>
                  <Outlet />
                </PageTransition>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
