// stores/AuthStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { authApi } from "../api/auth.api";
import { User, RegisterDto, LoginDto, AuthResponse } from "../types/user.types";
import { tokenStorage } from "../utils/tokenStorage";
import type { RootStore } from "./RootStore";

export class AuthStore {
  rootStore: RootStore;
  user: User | null = null;
  token: string | null = null; // Observable поле для отслеживания авторизации
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

  get hasRefreshToken(): boolean {
    return tokenStorage.hasRefreshToken();
  }

  private initFromStorage() {
    const token = tokenStorage.getAccessToken();
    const user = tokenStorage.getUser();

    if (token && user) {
      this.token = token;
      // Ensure timeZoneId has a default value for old users
      this.user = {
        ...user,
        timeZoneId: user.timeZoneId || "Europe/Moscow",
      };
    } else {
      this.clearAuth();
    }
    this.isInitialized = true;
  }

  private saveAuthData(response: AuthResponse) {
    // Ensure timeZoneId has a default value
    const userWithTimezone = {
      ...response.user,
      timeZoneId: response.user.timeZoneId || "Europe/Moscow",
    };

    tokenStorage.setAccessToken(response.token);
    tokenStorage.setUser(userWithTimezone);

    if (response.refreshToken) {
      tokenStorage.setRefreshToken(response.refreshToken);
    }
    if (response.tokenExpires) {
      tokenStorage.setTokenExpires(response.tokenExpires);
    }

    // Обновляем observable поля
    this.token = response.token;
    this.user = userWithTimezone;
  }

  private clearAuth() {
    tokenStorage.clearAll();
    this.token = null;
    this.user = null;
  }

  /**
   * Регистрация нового пользователя
   */
  async register(data: RegisterDto): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      // Автоматически определяем часовой пояс браузера, если не указан
      const registerData = {
        ...data,
        timeZoneId:
          data.timeZoneId || Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const response = await authApi.register(registerData);
      runInAction(() => {
        this.saveAuthData(response.data);
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || "Ошибка регистрации";
        this.isLoading = false;
      });
      return false;
    }
  }

  /**
   * Вход в систему
   */
  async login(data: LoginDto): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await authApi.login(data);
      runInAction(() => {
        this.saveAuthData(response.data);
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error =
          axiosError.response?.data?.error || "Неверный email или пароль";
        this.isLoading = false;
      });
      return false;
    }
  }

  /**
   * Выход из системы (текущее устройство)
   */
  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();

    // Пытаемся отозвать токен на сервере
    if (refreshToken) {
      try {
        await authApi.revoke({ refreshToken });
      } catch (error) {
        // Игнорируем ошибку — всё равно очищаем локальные данные
        console.warn("Не удалось отозвать токен на сервере");
      }
    }

    this.clearAuth();

    // Очистка других сторов
    this.rootStore.medicationStore.clear();
    this.rootStore.intakeStore.clear();
    this.rootStore.reminderStore.clear();
  }

  /**
   * Выход со всех устройств
   */
  async logoutAll(): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      await authApi.revokeAll();
      runInAction(() => {
        this.clearAuth();
        this.rootStore.medicationStore.clear();
        this.rootStore.intakeStore.clear();
        this.rootStore.reminderStore.clear();
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error =
          axiosError.response?.data?.error || "Ошибка выхода со всех устройств";
        this.isLoading = false;
      });
      return false;
    }
  }

  /**
   * Ручное обновление токена (обычно не требуется — происходит автоматически)
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      this.clearAuth();
      return false;
    }

    try {
      const response = await authApi.refresh({ refreshToken });
      runInAction(() => {
        this.saveAuthData(response.data);
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        this.clearAuth();
      });
      return false;
    }
  }

  updateUser(user: User) {
    this.user = user;
    tokenStorage.setUser(user);
  }

  clearError() {
    this.error = null;
  }
}
