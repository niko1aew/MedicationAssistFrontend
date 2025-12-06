import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/useStores';
import { Loader } from '../../common/Loader';
import styles from './AuthLayout.module.css';

export const AuthLayout: React.FC = observer(() => {
  const { authStore } = useStores();

  // Ждем инициализации
  if (!authStore.isInitialized) {
    return <Loader fullScreen />;
  }

  // Если уже авторизован — на главную
  if (authStore.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <svg className={styles.logo} width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" stroke="currentColor" strokeWidth="2"/>
            <path d="m8.5 8.5 7 7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h1 className={styles.title}>MedicationAssist</h1>
          <p className={styles.subtitle}>Контроль приема лекарств</p>
        </div>
        <div className={styles.formContainer}>
          <Outlet />
        </div>
      </div>
      <div className={styles.decoration}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>
    </div>
  );
});

