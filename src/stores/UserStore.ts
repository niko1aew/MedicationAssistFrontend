import { makeAutoObservable, runInAction } from "mobx";
import { usersApi } from "../api/users.api";
import { User, UpdateUserDto } from "../types/user.types";
import type { RootStore } from "./RootStore";

export class UserStore {
  rootStore: RootStore;
  users: User[] = [];
  selectedUser: User | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  async fetchUsers(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await usersApi.getAll();
      runInAction(() => {
        this.users = response.data;
        this.isLoading = false;
      });
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error =
          axiosError.response?.data?.error || "Ошибка загрузки пользователей";
        this.isLoading = false;
      });
    }
  }

  async fetchUserById(id: string): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await usersApi.getById(id);
      runInAction(() => {
        this.selectedUser = response.data;
        this.isLoading = false;
      });
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error =
          axiosError.response?.data?.error || "Пользователь не найден";
        this.isLoading = false;
      });
    }
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await usersApi.update(id, data);
      runInAction(() => {
        // Обновляем текущего пользователя в authStore если это он
        if (this.rootStore.authStore.user?.id === id) {
          this.rootStore.authStore.updateUser(response.data);
        }
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error =
          axiosError.response?.data?.error || "Ошибка обновления профиля";
        this.isLoading = false;
      });
      return false;
    }
  }

  async updateTimeZone(id: string, timeZoneId: string): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await usersApi.updateTimeZone(id, timeZoneId);
      runInAction(() => {
        // Обновляем текущего пользователя в authStore если это он
        if (this.rootStore.authStore.user?.id === id) {
          this.rootStore.authStore.updateUser(response.data);
        }
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error =
          axiosError.response?.data?.error ||
          "Ошибка обновления часового пояса";
        this.isLoading = false;
      });
      return false;
    }
  }

  clearError() {
    this.error = null;
  }
}
