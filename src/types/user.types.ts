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
  isOnboardingCompleted?: boolean; // Пройден ли онбординг
  onboardingStep?: number | null; // Текущий шаг онбординга (null если не начат или завершен)
  createdAt: string; // ISO 8601 datetime
  updatedAt: string | null;
}

// Онбординг шаги
export enum OnboardingStep {
  Welcome = 0,
  NavigateToMedications = 1,
  AddMedication = 2,
  AddReminder = 3,
  Completed = 4,
}

// DTO для обновления онбординга
export interface UpdateOnboardingDto {
  isCompleted?: boolean;
  step?: number;
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

// Telegram Login Init Response
export interface TelegramLoginInitResponse {
  token: string;
  deepLink: string;
  expiresInMinutes: number;
  pollUrl: string;
}

// Telegram Login Poll Response
export interface TelegramLoginPollResponse {
  status: "pending" | "authorized" | "expired";
  token?: string; // Access token (JWT) - только при status = 'authorized'
  refreshToken?: string; // Refresh token - только при status = 'authorized'
  tokenExpires?: string; // ISO 8601 datetime
  user?: User; // Данные пользователя - только при status = 'authorized'
}

// Telegram Web App (Mini App) Request
export interface TelegramWebAppRequest {
  initData: string; // Закодированная строка initData от Telegram WebApp
}
