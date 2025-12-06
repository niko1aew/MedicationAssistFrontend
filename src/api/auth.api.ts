import client from './client';
import { RegisterDto, LoginDto, AuthResponse } from '../types/user.types';

export const authApi = {
  register: (data: RegisterDto) => 
    client.post<AuthResponse>('/auth/register', data),
  
  login: (data: LoginDto) => 
    client.post<AuthResponse>('/auth/login', data),
};

