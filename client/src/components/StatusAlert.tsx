'use client';

import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

type StatusAlertProps = {
  message?: string;
  type?: 'info' | 'success' | 'error';
};

export function StatusAlert({ message, type = 'info' }: StatusAlertProps) {
  if (!message) return null;

  const styles = {
    info: 'alert-info',
    success: 'alert-success',
    error: 'alert-error'
  };

  const Icon = type === 'success' ? CheckCircleIcon : type === 'error' ? ExclamationTriangleIcon : InformationCircleIcon;

  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert ${styles[type]} w-[min(calc(100vw-2rem),24rem)] items-start rounded-box shadow-lg`}>
        <Icon className="h-5 w-5 shrink-0" />
        <span className="min-w-0 whitespace-normal break-words leading-6">{message}</span>
      </div>
    </div>
  );
}
