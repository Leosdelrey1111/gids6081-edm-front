import { Card, CardBody } from '@heroui/react';
import type { ReactNode } from 'react';

export function GenericCard({ children, sClassExtra }: { children: ReactNode; sClassExtra?: string }) {
  const base = 'bg-white dark:bg-[#18191a] rounded-sm border border-gray-200 dark:border-gray-700 p-2 m-2 shadow-none';
  return (
    <Card className={sClassExtra ? `${base} ${sClassExtra}` : base}>
      <CardBody className="overflow-y-auto overflow-x-auto">
        {children}
      </CardBody>
    </Card>
  );
}
