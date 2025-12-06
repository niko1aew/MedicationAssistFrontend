import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/useStores';
import styles from './Toast.module.css';

const icons = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M12 8l-4 4M8 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M10 14v-4M10 6h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export const ToastContainer: React.FC = observer(() => {
  const { uiStore } = useStores();

  if (uiStore.toasts.length === 0) return null;

  return (
    <div className={styles.container} role="region" aria-label="Уведомления">
      {uiStore.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          role="alert"
          aria-live="polite"
        >
          <span className={styles.icon}>{icons[toast.type]}</span>
          <span className={styles.message}>{toast.message}</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => uiStore.removeToast(toast.id)}
            aria-label="Закрыть уведомление"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
});

