import type { ReactNode } from 'react';

type ColorVariant = 'green' | 'blue' | 'pink' | 'purple' | 'yellow' | 'orange' | 'red' | 'info';

interface GenericRenderTitleProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  boxColor: ColorVariant;
  topRight?: ReactNode;
  className?: string;
}

const colorClasses: Record<ColorVariant, { box: string; glow: string }> = {
  green:  { box: 'from-green-500 to-green-600',   glow: 'bg-green-500/20'  },
  blue:   { box: 'from-blue-500 to-blue-600',     glow: 'bg-blue-500/20'   },
  pink:   { box: 'from-pink-500 to-pink-600',     glow: 'bg-pink-500/20'   },
  purple: { box: 'from-purple-500 to-purple-600', glow: 'bg-purple-500/20' },
  yellow: { box: 'from-yellow-500 to-yellow-600', glow: 'bg-yellow-500/20' },
  orange: { box: 'from-orange-500 to-orange-600', glow: 'bg-orange-500/20' },
  red:    { box: 'from-red-500 to-red-600',       glow: 'bg-red-500/20'    },
  info:   { box: 'from-sky-500 to-sky-600',       glow: 'bg-sky-500/20'    },
};

export function GenericRenderTitle({ title, subtitle, icon, boxColor, topRight, className = '' }: GenericRenderTitleProps) {
  const { box, glow } = colorClasses[boxColor];
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="relative">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${box} rounded-xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <div className={`absolute -inset-1 ${glow} rounded-xl blur-sm`} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{title}</h2>
          {subtitle && <p className="text-foreground-500 text-xs sm:text-sm mt-1 hidden sm:block">{subtitle}</p>}
        </div>
      </div>
      {topRight && <div>{topRight}</div>}
    </div>
  );
}
