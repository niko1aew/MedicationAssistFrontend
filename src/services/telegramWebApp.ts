// services/telegramWebApp.ts
// Сервис для работы с Telegram Mini App

import type { AuthResponse } from "../types/user.types";
import type { TelegramWebApp, TelegramThemeParams } from "../types/telegram.d";

/**
 * Тип ответа от бэкенда при авторизации через Telegram Mini App
 */
export type TelegramWebAppAuthResponse = AuthResponse;

/**
 * Проверяет, запущено ли приложение внутри Telegram Mini App
 */
export function isTelegramWebApp(): boolean {
  return !!window.Telegram?.WebApp?.initData;
}

/**
 * Возвращает экземпляр Telegram WebApp или null
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp || null;
}

/**
 * Инициализирует Telegram Web App и выполняет авторизацию
 * @param apiBaseUrl - базовый URL API (например, '/api')
 * @returns Данные авторизации или null если не в Telegram Mini App
 */
export async function initTelegramWebApp(
  apiBaseUrl: string = "/api"
): Promise<TelegramWebAppAuthResponse | null> {
  // Проверяем, запущено ли приложение внутри Telegram
  if (!window.Telegram?.WebApp) {
    console.log("Not running inside Telegram Mini App");
    return null;
  }

  const tg = window.Telegram.WebApp;

  // Сообщаем Telegram, что приложение готово
  tg.ready();

  // Расширяем на весь экран
  tg.expand();

  // Получаем initData
  const initData = tg.initData;

  if (!initData) {
    console.warn("No initData available");
    return null;
  }

  try {
    // Отправляем на бэкенд для авторизации
    const response = await fetch(`${apiBaseUrl}/auth/telegram-webapp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Authentication failed");
    }

    const authData: TelegramWebAppAuthResponse = await response.json();
    return authData;
  } catch (error) {
    console.error("Telegram WebApp auth error:", error);
    throw error;
  }
}

/**
 * Применяет цветовую тему Telegram к CSS переменным приложения
 */
export function applyTelegramTheme(): void {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  const theme = tg.themeParams;
  const root = document.documentElement;

  // Применяем цвета темы Telegram к CSS переменным
  if (theme.bg_color) {
    root.style.setProperty("--tg-bg-color", theme.bg_color);
  }
  if (theme.text_color) {
    root.style.setProperty("--tg-text-color", theme.text_color);
  }
  if (theme.hint_color) {
    root.style.setProperty("--tg-hint-color", theme.hint_color);
  }
  if (theme.link_color) {
    root.style.setProperty("--tg-link-color", theme.link_color);
  }
  if (theme.button_color) {
    root.style.setProperty("--tg-button-color", theme.button_color);
  }
  if (theme.button_text_color) {
    root.style.setProperty("--tg-button-text-color", theme.button_text_color);
  }
  if (theme.secondary_bg_color) {
    root.style.setProperty("--tg-secondary-bg-color", theme.secondary_bg_color);
  }
  if (theme.header_bg_color) {
    root.style.setProperty("--tg-header-bg-color", theme.header_bg_color);
  }
  if (theme.accent_text_color) {
    root.style.setProperty("--tg-accent-text-color", theme.accent_text_color);
  }
  if (theme.section_bg_color) {
    root.style.setProperty("--tg-section-bg-color", theme.section_bg_color);
  }
  if (theme.destructive_text_color) {
    root.style.setProperty(
      "--tg-destructive-text-color",
      theme.destructive_text_color
    );
  }

  // Устанавливаем атрибут темы для поддержки dark/light mode
  root.setAttribute(
    "data-telegram-theme",
    tg.colorScheme === "dark" ? "dark" : "light"
  );
}

/**
 * Получает параметры темы Telegram
 */
export function getTelegramTheme(): TelegramThemeParams | null {
  return window.Telegram?.WebApp?.themeParams || null;
}

/**
 * Получает цветовую схему Telegram (light/dark)
 */
export function getTelegramColorScheme(): "light" | "dark" | null {
  return window.Telegram?.WebApp?.colorScheme || null;
}

/**
 * Закрывает Mini App
 */
export function closeTelegramWebApp(): void {
  window.Telegram?.WebApp?.close();
}

/**
 * Показывает нативный алерт Telegram
 */
export function showTelegramAlert(
  message: string,
  callback?: () => void
): void {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.showAlert(message, callback);
  } else {
    alert(message);
    callback?.();
  }
}

/**
 * Показывает нативное подтверждение Telegram
 */
export function showTelegramConfirm(
  message: string,
  callback?: (confirmed: boolean) => void
): void {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.showConfirm(message, callback);
  } else {
    const result = confirm(message);
    callback?.(result);
  }
}

/**
 * Вызывает тактильную обратную связь
 */
export function triggerHapticFeedback(
  type: "success" | "warning" | "error" | "impact"
): void {
  const tg = window.Telegram?.WebApp;
  if (!tg?.HapticFeedback) return;

  switch (type) {
    case "success":
      tg.HapticFeedback.notificationOccurred("success");
      break;
    case "warning":
      tg.HapticFeedback.notificationOccurred("warning");
      break;
    case "error":
      tg.HapticFeedback.notificationOccurred("error");
      break;
    case "impact":
      tg.HapticFeedback.impactOccurred("medium");
      break;
  }
}

/**
 * Обработчик ошибок авторизации Telegram
 */
export function handleTelegramAuthError(error: unknown): string {
  if (error instanceof Error) {
    switch (error.message) {
      case "Invalid signature":
        return "Ошибка безопасности. Попробуйте перезапустить приложение.";
      case "Data expired":
        return "Сессия истекла. Пожалуйста, закройте и откройте приложение заново.";
      case "Пользователь не привязан к Telegram. Сначала зарегистрируйтесь через бота.":
      case "User not linked to Telegram":
        return "Аккаунт не найден. Нажмите /start в боте для регистрации.";
      case "Invalid initData":
        return "Неверные данные авторизации. Попробуйте перезапустить приложение.";
      default:
        return (
          error.message || "Произошла ошибка авторизации. Попробуйте позже."
        );
    }
  }
  return "Неизвестная ошибка";
}
