import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/useStores';
import { Button, Input } from '../../common';
import { validateEmail } from '../../../utils/validators';
import styles from './LoginForm.module.css';

export const LoginForm: React.FC = observer(() => {
  const { authStore, uiStore } = useStores();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error;
    }
    
    if (!password) {
      newErrors.password = 'Введите пароль';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const success = await authStore.login({ email, password });
    
    if (success) {
      uiStore.showToast('success', 'Вход выполнен успешно');
      navigate('/');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Вход в систему</h2>
      
      {authStore.error && (
        <div className={styles.error} role="alert">
          {authStore.error}
        </div>
      )}
      
      <div className={styles.fields}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setErrors((prev) => ({ ...prev, email: undefined }));
            authStore.clearError();
          }}
          error={errors.email}
          placeholder="your@email.com"
          required
          autoComplete="email"
        />
        
        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setErrors((prev) => ({ ...prev, password: undefined }));
            authStore.clearError();
          }}
          error={errors.password}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>
      
      <Button
        type="submit"
        variant="primary"
        size="large"
        fullWidth
        loading={authStore.isLoading}
      >
        Войти
      </Button>
      
      <p className={styles.footer}>
        Нет аккаунта?{' '}
        <Link to="/register" className={styles.link}>
          Зарегистрируйтесь
        </Link>
      </p>
    </form>
  );
});

