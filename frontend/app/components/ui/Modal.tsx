'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: 'default' | 'destructive';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus trap
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <h2
            id="modal-title"
            className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4"
          >
            {title}
          </h2>
          <div className="text-zinc-600 dark:text-zinc-400 mb-6">{children}</div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={onClose}>
              {cancelLabel}
            </Button>
            {onConfirm && (
              <Button
                variant={variant === 'destructive' ? 'destructive' : 'primary'}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
