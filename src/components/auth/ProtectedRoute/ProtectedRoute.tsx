import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStores } from '../../../hooks/useStores';
import { Loader } from '../../common/Loader';

export const ProtectedRoute: React.FC = observer(() => {
  const { authStore } = useStores();
  const location = useLocation();

  // Ждем инициализации стора
  if (!authStore.isInitialized) {
    return <Loader fullScreen text="Загрузка..." />;
  }

  // Если не авторизован — редирект на логин
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
});

