import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common';
import styles from './NotFoundPage.module.css';

export const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" opacity="0.3"/>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" opacity="0.5"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Страница не найдена</p>
        <p className={styles.description}>
          Возможно, страница была удалена или вы ввели неверный адрес
        </p>
        <Link to="/">
          <Button variant="primary" size="large">
            На главную
          </Button>
        </Link>
      </div>
    </div>
  );
};

