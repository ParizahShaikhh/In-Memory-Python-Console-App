import React from 'react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">
        {title}
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};
