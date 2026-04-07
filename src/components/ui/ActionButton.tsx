import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

type ButtonVariant = 'add' | 'delete' | 'edit' | 'info' | 'custom' | 'default';

interface ActionButtonProps {
  onPress: () => void;
  typeButton?: ButtonVariant;
  tooltipText?: string;
  isDisabled?: boolean;
}

const iconMap: Record<string, string> = {
  add:     'mdi:plus',
  delete:  'mdi:trash-can-outline',
  edit:    'mdi:pencil-outline',
  info:    'mdi:information-outline',
  custom:  'mdi:cog-outline',
  default: 'mdi:cursor-default-outline',
};

const hoverStyles: Record<ButtonVariant, string> = {
  add:     'hover:border-green-600 hover:bg-green-100 hover:dark:bg-green-900/30 hover:text-green-700 hover:dark:text-green-400',
  delete:  'hover:border-red-600 hover:bg-red-100 hover:dark:bg-red-900/30 hover:text-red-600 hover:dark:text-red-400',
  edit:    'hover:border-blue-600 hover:bg-blue-100 hover:dark:bg-blue-900/30 hover:text-blue-600 hover:dark:text-blue-400',
  info:    'hover:border-blue-600 hover:bg-blue-100 hover:dark:bg-blue-900/30 hover:text-blue-600 hover:dark:text-blue-400',
  custom:  'hover:border-purple-600 hover:bg-purple-100 hover:dark:bg-purple-900/30 hover:text-purple-600 hover:dark:text-purple-400',
  default: 'hover:border-gray-500 hover:bg-gray-100 hover:dark:bg-gray-900/30',
};

const tooltips: Record<ButtonVariant, string> = {
  add: 'Agregar', delete: 'Eliminar', edit: 'Editar',
  info: 'Información', custom: 'Acción', default: 'Default',
};

export function ActionButton({ onPress, typeButton = 'default', tooltipText, isDisabled = false }: ActionButtonProps) {
  const type = typeButton;
  const tip = tooltipText ?? tooltips[type];

  return (
    <Tooltip showArrow closeDelay={0} delay={0} offset={5} content={<div className="px-1 py-2 text-small">{tip}</div>}>
      <Button isIconOnly disabled={isDisabled} onPress={onPress}
        className={`rounded-xl mr-1 border-2 border-transparent shadow-none
          bg-gray-200 dark:bg-[#27272A] text-gray-500 dark:text-[#A1A1AA]
          disabled:opacity-50 transition-all duration-200
          ${!isDisabled ? hoverStyles[type] : ''}`}
        aria-label={tip}>
        <Icon icon={iconMap[type]} width={20} />
      </Button>
    </Tooltip>
  );
}
