import { useState } from 'react';
import { Icon } from '@iconify/react';

export const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button onClick={toggle}
      className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-100 ${className}`}>
      <Icon icon={isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'} width={20} />
    </button>
  );
};
