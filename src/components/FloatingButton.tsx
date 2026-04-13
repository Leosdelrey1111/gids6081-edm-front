import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface FloatingButtonProps {
  onPress: () => void;
  title?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function FloatingButton({ onPress, title, position = 'top-right' }: FloatingButtonProps) {
  const positionClass = {
    'top-right':    'fixed top-5 right-6 z-40',
    'top-left':     'fixed top-5 left-6 z-40',
    'bottom-right': 'fixed bottom-5 right-6 z-40',
    'bottom-left':  'fixed bottom-5 left-6 z-40',
  }[position];

  return (
    <Button onPress={onPress} size="md"
      className={`${positionClass} bg-primary-default text-white hover:bg-primary-dark shadow-lg rounded-full transition duration-150 flex items-center gap-2`}>
      <Icon icon="mdi:plus" width={20} />
      {title && <span className="text-sm font-medium pr-1">{title}</span>}
    </Button>
  );
}
