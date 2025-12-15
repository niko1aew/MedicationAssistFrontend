// api/auth.api.ts

import client from './client';
import { 
  RegisterDto, 
  LoginDto, 
  AuthResponse, 
  RefreshTokenRequest,
  RevokeTokenRequest 
} from '../types/user.types';

export const authApi = {
  /**
   * Регистрация нового пользователя
   */
  register: (data: RegisterDto) => 
    client.post<AuthResponse>('/auth/register', data),
  
  /**
   * Вход в систему
   */
  login: (data: LoginDto) => 
    client.post<AuthResponse>('/auth/login', data),

  /**
   * Обновление access токена с помощью refresh токена
   * Старый refresh токен будет отозван, выдаётся новый (ротация)
   */
  refresh: (data: RefreshTokenRequest) =>
    client.post<AuthResponse>('/auth/refresh', data),

  /**
   * Отзыв refresh токена (выход с текущего устройства)
   */
  revoke: (data: RevokeTokenRequest) =>
    client.post<{ message: string }>('/auth/revoke', data),

  /**
   * Отзыв всех refresh токенов (выход со всех устройств)
   * Требует авторизации
   */
  revokeAll: () =>
    client.post<{ message: string }>('/auth/revoke-all'),
};
