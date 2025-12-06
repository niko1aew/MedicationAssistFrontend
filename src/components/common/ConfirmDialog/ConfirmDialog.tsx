import React from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const icons = {
  danger: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="var(--color-danger-light)"/>
      <path d="M24 16v8M24 32h.01" stroke="var(--color-danger)" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="var(--color-warning-light)"/>
      <path d="M24 16v8M24 32h.01" stroke="var(--color-warning)" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="var(--color-info-light)"/>
      <path d="M24 32v-8M24 16h.01" stroke="var(--color-info)" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
  onCancel,
  variant = 'info',
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="small"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <div className={styles.icon}>{icons[variant]}</div>
        <p className={styles.message}>{message}</p>
      </div>
    </Modal>
  );
};

