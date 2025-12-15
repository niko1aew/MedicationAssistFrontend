// utils/tokenStorage.ts

import { User } from '../types/user.types';

const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRES_KEY = 'tokenExpires';
const USER_KEY = 'user';

export const tokenStorage = {
  // Access Token
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  setAccessToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  
  removeAccessToken: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  // Refresh Token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  
  removeRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Token Expiration
  getTokenExpires: (): Date | null => {
    const expires = localStorage.getItem(TOKEN_EXPIRES_KEY);
    return expires ? new Date(expires) : null;
  },
  
  setTokenExpires: (expires: string): void => {
    localStorage.setItem(TOKEN_EXPIRES_KEY, expires);
  },
  
  removeTokenExpires: (): void => {
    localStorage.removeItem(TOKEN_EXPIRES_KEY);
  },

  // User
  getUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  
  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  // Очистить всё
  clearAll: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Проверка истечения токена (с запасом в 60 секунд)
  isTokenExpiringSoon: (): boolean => {
    const expires = tokenStorage.getTokenExpires();
    if (!expires) return true;
    
    const now = new Date();
    const bufferMs = 60 * 1000; // 60 секунд запаса
    return expires.getTime() - now.getTime() < bufferMs;
  },

  // Проверка наличия refresh токена
  hasRefreshToken: (): boolean => {
    return !!tokenStorage.getRefreshToken();
  }
};
