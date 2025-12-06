import React from 'react';
import styles from './QuickIntakeButton.module.css';

interface QuickIntakeButtonProps {
  onClick: () => void;
}

export const QuickIntakeButton: React.FC<QuickIntakeButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.button} onClick={onClick} aria-label="Принял лекарство">
      <span className={styles.icon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </span>
      <span className={styles.text}>Принял лекарство</span>
    </button>
  );
};

