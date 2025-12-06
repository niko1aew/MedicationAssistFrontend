import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/useStores';
import { Button, Input } from '../../common';
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from '../../../utils/validators';
import styles from './RegisterForm.module.css';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegisterForm: React.FC = observer(() => {
  const { authStore, uiStore } = useStores();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    const nameResult = validateName(name);
    if (!nameResult.isValid) newErrors.name = nameResult.error;
    
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) newErrors.email = emailResult.error;
    
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) newErrors.password = passwordResult.error;
    
    const confirmResult = validateConfirmPassword(password, confirmPassword);
    if (!confirmResult.isValid) newErrors.confirmPassword = confirmResult.error;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const success = await authStore.register({ name, email, password });
    
    if (success) {
      uiStore.showToast('success', 'Регистрация прошла успешно!');
      navigate('/');
    }
  };

  const clearFieldError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    authStore.clearError();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Регистрация</h2>
      
      {authStore.error && (
        <div className={styles.error} role="alert">
          {authStore.error}
        </div>
      )}
      
      <div className={styles.fields}>
        <Input
          label="Имя"
          type="text"
          value={name}
          onChange={(value) => {
            setName(value);
            clearFieldError('name');
          }}
          error={errors.name}
          placeholder="Ваше имя"
          required
          maxLength={200}
          autoComplete="name"
        />
        
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            clearFieldError('email');
          }}
          error={errors.email}
          placeholder="your@email.com"
          required
          maxLength={200}
          autoComplete="email"
        />
        
        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            clearFieldError('password');
          }}
          error={errors.password}
          placeholder="Минимум 6 символов"
          required
          autoComplete="new-password"
        />
        
        <Input
          label="Подтверждение пароля"
          type="password"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            clearFieldError('confirmPassword');
          }}
          error={errors.confirmPassword}
          placeholder="Повторите пароль"
          required
          autoComplete="new-password"
        />
      </div>
      
      <Button
        type="submit"
        variant="primary"
        size="large"
        fullWidth
        loading={authStore.isLoading}
      >
        Зарегистрироваться
      </Button>
      
      <p className={styles.footer}>
        Уже есть аккаунт?{' '}
        <Link to="/login" className={styles.link}>
          Войдите
        </Link>
      </p>
    </form>
  );
});

