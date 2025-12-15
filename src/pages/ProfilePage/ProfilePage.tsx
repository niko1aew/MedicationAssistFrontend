import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks/useStores';
import { Button, Input, Card, ConfirmDialog } from '../../components/common';
import { validateName, validateEmail } from '../../utils/validators';
import { formatDate } from '../../utils/formatDate';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = observer(() => {
  const navigate = useNavigate();
  const { authStore, userStore, uiStore } = useStores();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutAllConfirm, setShowLogoutAllConfirm] = useState(false);
  const [name, setName] = useState(authStore.user?.name || '');
  const [email, setEmail] = useState(authStore.user?.email || '');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const user = authStore.user;

  const handleStartEdit = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setErrors({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};
    
    const nameResult = validateName(name);
    if (!nameResult.isValid) newErrors.name = nameResult.error;
    
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) newErrors.email = emailResult.error;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !user) return;
    
    const success = await userStore.updateUser(user.id, {
      name: name.trim(),
      email: email.trim(),
    });
    
    if (success) {
      uiStore.showToast('success', 'Профиль обновлен');
      setIsEditing(false);
    } else if (userStore.error) {
      uiStore.showToast('error', userStore.error);
    }
  };

  const handleLogout = async () => {
    await authStore.logout();
    navigate('/login');
  };

  const handleLogoutAll = async () => {
    const success = await authStore.logoutAll();
    if (success) {
      uiStore.showToast('success', 'Вы вышли со всех устройств');
      navigate('/login');
    } else {
      uiStore.showToast('error', authStore.error || 'Ошибка');
    }
    setShowLogoutAllConfirm(false);
  };

  if (!user) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Профиль</h1>
      </header>

      <Card className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userRole}>{user.role === 'Admin' ? 'Администратор' : 'Пользователь'}</p>
          </div>
        </div>

        {isEditing ? (
          <div className={styles.editForm}>
            <Input
              label="Имя"
              type="text"
              value={name}
              onChange={(value) => {
                setName(value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              maxLength={200}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(value) => {
                setEmail(value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              maxLength={200}
            />
            <div className={styles.editActions}>
              <Button variant="secondary" onClick={handleCancelEdit}>
                Отмена
              </Button>
              <Button variant="primary" onClick={handleSave} loading={userStore.isLoading}>
                Сохранить
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Дата регистрации</span>
              <span className={styles.infoValue}>{formatDate(user.createdAt)}</span>
            </div>
            <Button variant="secondary" onClick={handleStartEdit} fullWidth>
              Редактировать профиль
            </Button>
          </div>
        )}
      </Card>

      <Card className={styles.dangerCard}>
        <h3 className={styles.dangerTitle}>Выход из аккаунта</h3>
        <p className={styles.dangerDescription}>
          Вы будете перенаправлены на страницу входа
        </p>
        <div className={styles.logoutActions}>
          <Button 
            variant="secondary" 
            onClick={() => setShowLogoutConfirm(true)}
            loading={authStore.isLoading}
          >
            Выйти
          </Button>
          <Button 
            variant="danger" 
            onClick={() => setShowLogoutAllConfirm(true)}
            loading={authStore.isLoading}
          >
            Выйти со всех устройств
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Выйти из аккаунта?"
        message="Вы уверены, что хотите выйти?"
        confirmText="Выйти"
        cancelText="Отмена"
        variant="warning"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showLogoutAllConfirm}
        title="Выйти со всех устройств?"
        message="Вы будете отключены от всех устройств, включая это. Потребуется повторный вход."
        confirmText="Выйти везде"
        cancelText="Отмена"
        variant="danger"
        onConfirm={handleLogoutAll}
        onCancel={() => setShowLogoutAllConfirm(false)}
      />
    </div>
  );
});
