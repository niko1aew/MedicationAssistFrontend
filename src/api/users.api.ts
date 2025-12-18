import client from "./client";
import { User, UpdateUserDto } from "../types/user.types";

export const usersApi = {
  getAll: () => client.get<User[]>("/users"),

  getById: (id: string) => client.get<User>(`/users/${id}`),

  getByEmail: (email: string) => client.get<User>(`/users/by-email/${email}`),

  update: (id: string, data: UpdateUserDto) =>
    client.put<User>(`/users/${id}`, data),

  delete: (id: string) => client.delete(`/users/${id}`),

  updateTimeZone: (id: string, timeZoneId: string) =>
    client.put<User>(`/users/${id}/timezone`, { timeZoneId }),

  // Telegram Integration
  generateTelegramLinkToken: (userId: string) =>
    client.post<import("../types/user.types").TelegramLinkTokenResponse>(
      `/users/${userId}/telegram-link-token`
    ),

  unlinkTelegram: (userId: string) =>
    client.delete(`/users/${userId}/telegram-link`),
};
