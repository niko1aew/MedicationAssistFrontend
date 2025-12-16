export interface Reminder {
  id: string;                    // GUID
  userId: string;                 // GUID пользователя
  telegramUserId: number;         // Telegram User ID (для бота)
  medicationId: string;           // GUID лекарства
  medicationName: string;         // Название лекарства
  dosage: string | null;          // Дозировка (опционально)
  time: string;                   // Время напоминания в формате "HH:mm" (например, "08:00")
  isActive: boolean;              // Активно ли напоминание
  lastSentAt: string | null;      // ISO 8601 datetime - когда было отправлено последнее уведомление
  createdAt: string;              // ISO 8601 datetime
  updatedAt: string | null;       // ISO 8601 datetime
}

export interface CreateReminderDto {
  telegramUserId: number;         // Telegram User ID (можно использовать 0 для web-приложений)
  medicationId: string;           // GUID лекарства
  time: string;                   // Время в формате "HH:mm" (например, "08:00")
}

