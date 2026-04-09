import { useState } from 'react';
import { Button } from '@heroui/react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <Button isIconOnly variant="light" size="sm" onPress={toggle} className={className}
      aria-label="Cambiar tema">
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
};
