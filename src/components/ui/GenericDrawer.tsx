import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from '@heroui/react';
import type { ReactNode } from 'react';

interface GenericDrawerProps {
  title: string;
  subtitle?: string;
  body: ReactNode;
  footer?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  isDismissable?: boolean;
}

export function GenericDrawer({ title, subtitle, body, footer, isOpen, onClose, isDismissable = false }: GenericDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="2xl" isDismissable={isDismissable}>
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </DrawerHeader>
        <DrawerBody>{body}</DrawerBody>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}
