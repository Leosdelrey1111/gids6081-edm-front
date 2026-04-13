import { Chip } from '@heroui/react';

interface StatusBadgeProps {
  code: number;
}

export const StatusBadge = ({ code }: StatusBadgeProps) => (
  <Chip size="sm" variant="flat" color={code >= 500 ? 'danger' : code >= 400 ? 'warning' : 'success'}>
    {code >= 500 ? '🔴' : code >= 400 ? '🟡' : '🟢'} {code}
  </Chip>
);
