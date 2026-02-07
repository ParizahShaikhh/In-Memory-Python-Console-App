import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
  secondary: 'border border-zinc-300 hover:bg-zinc-50 text-zinc-700 focus:ring-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-300',
  destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  ghost: 'text-indigo-600 hover:text-indigo-700 hover:underline focus:ring-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
