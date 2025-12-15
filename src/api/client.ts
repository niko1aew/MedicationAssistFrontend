// api/client.ts

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../utils/tokenStorage';
import { AuthResponse } from '../types/user.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5018/api';

// Флаг для предотвращения множественных refresh запросов
let isRefreshing = false;
// Очередь запросов, ожидающих обновления токена
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request интерцептор — добавление токена
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Пропускаем добавление токена для auth endpoints
    const isAuthEndpoint = config.url?.includes('/auth/');
    
    if (!isAuthEndpoint) {
      // Проверяем, не истекает ли токен скоро
      if (tokenStorage.isTokenExpiringSoon() && tokenStorage.hasRefreshToken()) {
        // Попробуем обновить токен превентивно
        try {
          await refreshAccessToken();
        } catch (error) {
          // Если не удалось — продолжаем с текущим токеном
          console.warn('Превентивное обновление токена не удалось');
        }
      }
    }
    
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response интерцептор — обработка ошибок и автоматический refresh
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Если ошибка 401 и это не retry запрос и не auth endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      // Если уже идёт refresh — добавляем в очередь
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        // Нет refresh токена — выходим
        tokenStorage.clearAll();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearAll();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Функция обновления токена
async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // Используем axios напрямую, чтобы избежать интерцепторов
  const response = await axios.post<AuthResponse>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  const { token, refreshToken: newRefreshToken, tokenExpires } = response.data;

  // Сохраняем новые токены
  tokenStorage.setAccessToken(token);
  if (newRefreshToken) {
    tokenStorage.setRefreshToken(newRefreshToken);
  }
  if (tokenExpires) {
    tokenStorage.setTokenExpires(tokenExpires);
  }

  return token;
}

export default client;
export { refreshAccessToken };
