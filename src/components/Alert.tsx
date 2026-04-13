import { Alert as HAlert } from '@heroui/react';

interface AlertProps {
  message: string;
  type?: 'error' | 'success' | 'warning';
}

const colorMap = { error: 'danger', success: 'success', warning: 'warning' } as const;

export const Alert = ({ message, type = 'error' }: AlertProps) => (
  <HAlert color={colorMap[type]} variant="flat" className="mb-2">
    {message}
  </HAlert>
);
