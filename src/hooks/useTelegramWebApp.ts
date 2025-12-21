// hooks/useTelegramWebApp.ts
// Основной хук для работы с Telegram Mini App

import { useState, useEffect, useCallback } from "react";
import {
  isTelegramWebApp,
  getTelegramWebApp,
  triggerHapticFeedback,
} from "../services/telegramWebApp";
import type { TelegramWebApp } from "../types/telegram.d";

interface UseTelegramWebAppResult {
  /** Запущено ли приложение внутри Telegram Mini App */
  isTelegram: boolean;
  /** Экземпляр Telegram WebApp или null */
  webApp: TelegramWebApp | null;
  /** Цветовая схема (light/dark) */
  colorScheme: "light" | "dark";
  /** Закрыть Mini App */
  close: () => void;
  /** Расширить Mini App на весь экран */
  expand: () => void;
  /** Показать нативный алерт */
  showAlert: (message: string, callback?: () => void) => void;
  /** Показать нативное подтверждение */
  showConfirm: (
    message: string,
    callback?: (confirmed: boolean) => void
  ) => void;
  /** Вызвать тактильную обратную связь */
  hapticFeedback: (type: "success" | "warning" | "error" | "impact") => void;
  /** Открыть внешнюю ссылку */
  openLink: (url: string) => void;
  /** Открыть ссылку в Telegram */
  openTelegramLink: (url: string) => void;
}

/**
 * Основной хук для работы с Telegram Mini App
 * Предоставляет удобный интерфейс для взаимодействия с Telegram WebApp API
 */
export function useTelegramWebApp(): UseTelegramWebAppResult {
  const [isTelegram] = useState(() => isTelegramWebApp());
  const [webApp] = useState(() => getTelegramWebApp());
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(() => {
    return webApp?.colorScheme || "light";
  });

  // Подписываемся на изменение темы
  useEffect(() => {
    if (!webApp) return;

    const handleThemeChange = () => {
      setColorScheme(webApp.colorScheme);
    };

    webApp.onEvent("themeChanged", handleThemeChange);

    return () => {
      webApp.offEvent("themeChanged", handleThemeChange);
    };
  }, [webApp]);

  const close = useCallback(() => {
    webApp?.close();
  }, [webApp]);

  const expand = useCallback(() => {
    webApp?.expand();
  }, [webApp]);

  const showAlert = useCallback(
    (message: string, callback?: () => void) => {
      if (webApp) {
        webApp.showAlert(message, callback);
      } else {
        alert(message);
        callback?.();
      }
    },
    [webApp]
  );

  const showConfirm = useCallback(
    (message: string, callback?: (confirmed: boolean) => void) => {
      if (webApp) {
        webApp.showConfirm(message, callback);
      } else {
        const result = confirm(message);
        callback?.(result);
      }
    },
    [webApp]
  );

  const hapticFeedback = useCallback(
    (type: "success" | "warning" | "error" | "impact") => {
      triggerHapticFeedback(type);
    },
    []
  );

  const openLink = useCallback(
    (url: string) => {
      if (webApp) {
        webApp.openLink(url);
      } else {
        window.open(url, "_blank");
      }
    },
    [webApp]
  );

  const openTelegramLink = useCallback(
    (url: string) => {
      if (webApp) {
        webApp.openTelegramLink(url);
      } else {
        window.open(url, "_blank");
      }
    },
    [webApp]
  );

  return {
    isTelegram,
    webApp,
    colorScheme,
    close,
    expand,
    showAlert,
    showConfirm,
    hapticFeedback,
    openLink,
    openTelegramLink,
  };
}
