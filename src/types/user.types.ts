export enum UserRole {
  User = 'User',
  Admin = 'Admin'
}

export interface User {
  id: string;           // GUID
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;    // ISO 8601 datetime
  updatedAt: string | null;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;                    // Access token (JWT)
  refreshToken?: string;            // Refresh token (опционально для обратной совместимости)
  tokenExpires?: string;            // ISO 8601 datetime - когда истекает access token
  user: User;
}

// DTO для обновления токена
export interface RefreshTokenRequest {
  refreshToken: string;
}

// DTO для отзыва токена
export interface RevokeTokenRequest {
  refreshToken: string;
}

export interface UpdateUserDto {
  name: string;
  email: string;
}

