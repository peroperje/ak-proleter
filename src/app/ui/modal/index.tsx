import React, { ReactElement, ReactNode, useEffect, useId, useRef } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string; // wrapper additional classes
  modalClassName?: string; // panel additional classes
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  className = '',
  modalClassName = '',
}): ReactElement | null => {
  const labelId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Basic focus handling: focus dialog when opened
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      aria-labelledby={title ? labelId : undefined}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 dark:bg-black/70"
        onClick={() => closeOnBackdrop && onClose()}
      />

      {/* Modal panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative z-10 w-full ${sizeClasses[size]} rounded-lg bg-white shadow dark:bg-neutral-900 ${modalClassName}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between rounded-t border-b border-gray-200 p-4 dark:border-neutral-800">
            <h3 id={labelId} className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {showCloseButton && (
              <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="ms-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <svg className="h-3.5 w-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 rounded-b border-t border-gray-200 p-4 dark:border-neutral-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
