import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  fullScreen = false,
  text,
}) => {
  const content = (
    <div className={styles.loaderContent}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.pill}></div>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        {content}
      </div>
    );
  }

  return content;
};

