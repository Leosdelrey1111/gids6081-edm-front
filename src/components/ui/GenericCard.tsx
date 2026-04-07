import { Card, CardBody, CardHeader } from '@heroui/react';
import type { ReactNode } from 'react';

interface GenericCardProps {
  children: ReactNode;
  title?: ReactNode;
  icon?: ReactNode;
  topRight?: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function GenericCard({ children, title, icon, topRight, className = '', noPadding = false }: GenericCardProps) {
  return (
    <Card className={`bg-white dark:bg-[#18191a] rounded-sm border border-gray-200 dark:border-gray-700 shadow-none ${className}`}>
      {(title || icon || topRight) && (
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 gap-3">
          {icon && (
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-base">
              {icon}
            </div>
          )}
          {title && <h3 className="text-sm font-semibold text-foreground flex-1">{title}</h3>}
          {topRight && <div className="ml-auto">{topRight}</div>}
        </CardHeader>
      )}
      <CardBody className={noPadding ? 'p-0 overflow-x-auto' : 'p-5 overflow-x-auto'}>
        {children}
      </CardBody>
    </Card>
  );
}
