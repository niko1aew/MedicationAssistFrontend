/**
 * Утилиты для работы с часовыми поясами
 */

/**
 * Получить текущий часовой пояс браузера пользователя
 */
export const getUserTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Проверить валидность IANA идентификатора часового пояса
 */
export const isValidTimeZone = (timeZoneId: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timeZoneId });
    return true;
  } catch {
    return false;
  }
};

/**
 * Форматировать UTC время в локальное время пользователя
 */
export const formatInTimeZone = (
  utcDateString: string,
  timeZoneId: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  // Fallback на Europe/Moscow если timeZoneId пустой или невалидный
  const safeTimeZone =
    timeZoneId && isValidTimeZone(timeZoneId) ? timeZoneId : "Europe/Moscow";

  const date = new Date(utcDateString);
  return date.toLocaleString("ru-RU", {
    timeZone: safeTimeZone,
    ...options,
  });
};

/**
 * Получить дату и время в часовом поясе пользователя
 */
export const formatDateTimeInTimeZone = (
  utcDateString: string,
  timeZoneId: string
): string => {
  return formatInTimeZone(utcDateString, timeZoneId, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Получить только дату в часовом поясе пользователя
 */
export const formatDateInTimeZone = (
  utcDateString: string,
  timeZoneId: string
): string => {
  return formatInTimeZone(utcDateString, timeZoneId, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Получить только время в часовом поясе пользователя
 */
export const formatTimeInTimeZone = (
  utcDateString: string,
  timeZoneId: string
): string => {
  return formatInTimeZone(utcDateString, timeZoneId, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Конвертировать локальное время в строку для отправки на API (БЕЗ 'Z')
 * @param date - Локальное время как Date объект
 * @returns Строка в формате ISO 8601 без 'Z' (например, "2025-12-17T14:30:00")
 */
export const formatLocalTimeForApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

/**
 * Получить текущее время в формате для отправки на API (локальное, без 'Z')
 */
export const getCurrentLocalTimeForApi = (): string => {
  return formatLocalTimeForApi(new Date());
};

/**
 * Получить текущее время в конкретном часовом поясе
 */
export const getCurrentTimeInTimeZone = (timeZoneId: string): string => {
  const now = new Date();
  return formatTimeInTimeZone(now.toISOString(), timeZoneId);
};

/**
 * Популярные часовые пояса для России и СНГ
 */
export const popularTimeZones = [
  { id: "Europe/Moscow", label: "🇷🇺 Москва (UTC+3)" },
  { id: "Europe/Samara", label: "🇷🇺 Самара (UTC+4)" },
  { id: "Asia/Yekaterinburg", label: "🇷🇺 Екатеринбург (UTC+5)" },
  { id: "Asia/Omsk", label: "🇷🇺 Омск (UTC+6)" },
  { id: "Asia/Krasnoyarsk", label: "🇷🇺 Красноярск (UTC+7)" },
  { id: "Asia/Irkutsk", label: "🇷🇺 Иркутск (UTC+8)" },
  { id: "Asia/Yakutsk", label: "🇷🇺 Якутск (UTC+9)" },
  { id: "Asia/Vladivostok", label: "🇷🇺 Владивосток (UTC+10)" },
  { id: "Asia/Magadan", label: "🇷🇺 Магадан (UTC+11)" },
  { id: "Asia/Kamchatka", label: "🇷🇺 Камчатка (UTC+12)" },
  { id: "Europe/Minsk", label: "🇧🇾 Минск (UTC+3)" },
  { id: "Europe/Kiev", label: "🇺🇦 Киев (UTC+2)" },
  { id: "Asia/Almaty", label: "🇰🇿 Алматы (UTC+6)" },
  { id: "Asia/Tashkent", label: "🇺🇿 Ташкент (UTC+5)" },
];

/**
 * Получить смещение UTC в часах для часового пояса
 */
export const getTimeZoneOffset = (timeZoneId: string): string => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZoneId,
    timeZoneName: "shortOffset",
  });

  const parts = formatter.formatToParts(now);
  const offsetPart = parts.find((part) => part.type === "timeZoneName");

  return offsetPart?.value || "";
};
