import client from './client';
import { Reminder, CreateReminderDto } from '../types/reminder.types';

export const remindersApi = {
  /**
   * Получить все напоминания пользователя
   */
  getByUserId: (userId: string) =>
    client.get<Reminder[]>(`/users/${userId}/reminders`),

  /**
   * Получить конкретное напоминание
   */
  getById: (userId: string, reminderId: string) =>
    client.get<Reminder>(`/users/${userId}/reminders/${reminderId}`),

  /**
   * Создать напоминание
   */
  create: (userId: string, data: CreateReminderDto) =>
    client.post<Reminder>(`/users/${userId}/reminders`, data),

  /**
   * Удалить напоминание
   */
  delete: (userId: string, reminderId: string) =>
    client.delete(`/users/${userId}/reminders/${reminderId}`),
};

