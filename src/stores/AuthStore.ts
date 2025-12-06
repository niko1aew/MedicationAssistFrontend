import { makeAutoObservable, runInAction } from 'mobx';
import { authApi } from '../api/auth.api';
import { User, RegisterDto, LoginDto } from '../types/user.types';
import type { RootStore } from './RootStore';

export class AuthStore {
  rootStore: RootStore;
  user: User | null = null;
  token: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  isInitialized: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.initFromStorage();
  }

  get isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  get userId(): string | null {
    return this.user?.id || null;
  }

  private initFromStorage() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      try {
        this.token = token;
        this.user = JSON.parse(userJson);
      } catch {
        this.clearAuth();
      }
    }
    this.isInitialized = true;
  }

  private saveToStorage(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = null;
    this.user = null;
  }

  async register(data: RegisterDto): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await authApi.register(data);
      runInAction(() => {
        this.token = response.data.token;
        this.user = response.data.user;
        this.saveToStorage(response.data.token, response.data.user);
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка регистрации';
        this.isLoading = false;
      });
      return false;
    }
  }

  async login(data: LoginDto): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await authApi.login(data);
      runInAction(() => {
        this.token = response.data.token;
        this.user = response.data.user;
        this.saveToStorage(response.data.token, response.data.user);
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Неверный email или пароль';
        this.isLoading = false;
      });
      return false;
    }
  }

  logout() {
    this.clearAuth();
    // Очистка других сторов
    this.rootStore.medicationStore.clear();
    this.rootStore.intakeStore.clear();
  }

  updateUser(user: User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearError() {
    this.error = null;
  }
}

