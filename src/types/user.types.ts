export enum UserRole {
  User = "User",
  Admin = "Admin",
}

export interface User {
  id: string; // GUID
  name: string;
  email: string;
  role: UserRole;
  telegramUserId?: number | null; // ID пользователя в Telegram (null если не привязан)
  telegramUsername?: string | null; // Username в Telegram
  timeZoneId?: string; // IANA timezone ID (например, "Europe/Moscow") - опционально для совместимости
  createdAt: string; // ISO 8601 datetime
  updatedAt: string | null;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  timeZoneId?: string; // IANA timezone ID (опционально)
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string; // Access token (JWT)
  refreshToken?: string; // Refresh token (опционально для обратной совместимости)
  tokenExpires?: string; // ISO 8601 datetime - когда истекает access token
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

// Telegram Link Token Types
export interface TelegramLinkTokenResponse {
  token: string;
  deepLink: string;
  expiresInMinutes: number;
}

export interface TelegramLinkData {
  token: string;
  deepLink: string;
  expiresInMinutes: number;
  expiresAt: Date;
}

// Telegram Web Login Types
export interface TelegramWebLoginRequest {
  token: string; // 32-character Base64 URL-safe token
}
