import React from 'react';
import { Button } from '../Button';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className={styles.wrapper} role="alert">
      <div className={styles.icon}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" fill="var(--color-danger-light)"/>
          <path d="M30 18L18 30M18 18l12 12" stroke="var(--color-danger)" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Попробовать снова
        </Button>
      )}
    </div>
  );
};

