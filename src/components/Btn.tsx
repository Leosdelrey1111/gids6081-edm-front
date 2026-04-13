import type { ButtonHTMLAttributes, ReactNode } from 'react';

type BtnVariant = 'primary' | 'danger' | 'ghost' | 'flat';
type BtnSize    = 'sm' | 'md' | 'lg';

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClass: Record<BtnVariant, string> = {
  primary: 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:opacity-90',
  danger:  'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25',
  ghost:   'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-100',
  flat:    'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700',
};

const sizeClass: Record<BtnSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

export function Btn({
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: BtnProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-lg
        transition-all duration-150 cursor-pointer select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        active:scale-[.97]
        ${variantClass[variant]}
        ${sizeClass[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {isLoading && (
        <svg className="animate-spin w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
      )}
      {children}
    </button>
  );
}
