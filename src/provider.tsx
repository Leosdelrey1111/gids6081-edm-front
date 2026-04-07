import { HeroUIProvider } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

export const Provider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  return (
    <HeroUIProvider navigate={navigate}>
      {children}
    </HeroUIProvider>
  );
};
