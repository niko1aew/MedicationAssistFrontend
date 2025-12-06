import { useStores } from './useStores';

export const useAuth = () => {
  const { authStore } = useStores();
  
  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    login: authStore.login.bind(authStore),
    register: authStore.register.bind(authStore),
    logout: authStore.logout.bind(authStore),
    clearError: authStore.clearError.bind(authStore),
  };
};

