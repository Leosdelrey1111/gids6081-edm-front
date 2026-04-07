import { Input as HInput } from '@heroui/react';
import type { InputHTMLAttributes } from 'react';
import { sanitizeText } from '@utils/sanitize';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = ({ label, error, onChange, type, ...props }: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type !== 'password') e.target.value = sanitizeText(e.target.value);
    onChange?.(e);
  };

  return (
    <HInput
      label={label}
      type={type ?? 'text'}
      variant="bordered"
      labelPlacement="outside"
      isInvalid={!!error}
      errorMessage={error}
      onChange={handleChange}
      {...(props as any)}
    />
  );
};
