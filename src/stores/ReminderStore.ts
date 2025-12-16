import { makeAutoObservable, runInAction } from 'mobx';
import { remindersApi } from '../api/reminders.api';
import { Reminder, CreateReminderDto } from '../types/reminder.types';
import { RootStore } from './RootStore';

export class ReminderStore {
  rootStore: RootStore;
  reminders: Reminder[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get userId(): string | null {
    return this.rootStore.authStore.userId;
  }

  /**
   * Загрузить все напоминания пользователя
   */
  async loadReminders(userId: string): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await remindersApi.getByUserId(userId);
      runInAction(() => {
        this.reminders = response.data;
        this.isLoading = false;
      });
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка загрузки напоминаний';
        this.isLoading = false;
      });
    }
  }

  /**
   * Создать напоминание
   */
  async createReminder(userId: string, data: CreateReminderDto): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await remindersApi.create(userId, data);
      runInAction(() => {
        this.reminders.push(response.data);
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка создания напоминания';
        this.isLoading = false;
      });
      return false;
    }
  }

  /**
   * Удалить напоминание
   */
  async deleteReminder(userId: string, reminderId: string): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      await remindersApi.delete(userId, reminderId);
      runInAction(() => {
        this.reminders = this.reminders.filter(r => r.id !== reminderId);
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка удаления напоминания';
        this.isLoading = false;
      });
      return false;
    }
  }

  /**
   * Получить активные напоминания
   */
  get activeReminders(): Reminder[] {
    return this.reminders.filter(r => r.isActive);
  }

  /**
   * Получить напоминания для конкретного лекарства
   */
  getRemindersForMedication(medicationId: string): Reminder[] {
    return this.reminders.filter(r => r.medicationId === medicationId && r.isActive);
  }

  /**
   * Получить первое активное напоминание для лекарства
   */
  getReminderForMedication(medicationId: string): Reminder | undefined {
    return this.reminders.find(r => r.medicationId === medicationId && r.isActive);
  }

  clear() {
    this.reminders = [];
    this.error = null;
  }
}

