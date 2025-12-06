import React from 'react';
import { Button } from '../Button';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const defaultIcon = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"/>
    <path d="M32 20v12M32 40h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = defaultIcon,
  title,
  description,
  action,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

