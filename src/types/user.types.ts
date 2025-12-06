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
  token: string;
  user: User;
}

export interface UpdateUserDto {
  name: string;
  email: string;
}

