// hooks/useVersionCheck.ts

import { useEffect } from "react";
import { useStores } from "./useStores";

interface UseVersionCheckOptions {
  /**
   * Интервал проверки версии в миллисекундах
   * По умолчанию: 5 минут (300000 мс)
   */
  checkInterval?: number;

  /**
   * Включить/выключить проверку версии
   * По умолчанию: true
   */
  enabled?: boolean;

  /**
   * Проверять версию при возврате на вкладку после отсутствия
   * По умолчанию: true
   */
  checkOnFocus?: boolean;
}

/**
 * Хук для периодической проверки версии приложения
 * Автоматически проверяет наличие обновлений и уведомляет пользователя
 */
export const useVersionCheck = ({
  checkInterval = 300000, // 5 минут
  enabled = true,
  checkOnFocus = true,
}: UseVersionCheckOptions = {}): void => {
  const { versionStore } = useStores();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Начальная проверка версии
    versionStore.checkVersion();

    // Периодическая проверка версии
    const intervalId = setInterval(() => {
      versionStore.checkVersion();
    }, checkInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [versionStore, checkInterval, enabled]);

  // Проверка версии при возврате на вкладку
  useEffect(() => {
    if (!enabled || !checkOnFocus) {
      return;
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Проверяем только если прошло достаточно времени с последней проверки
        const timeSinceLastCheck =
          Date.now() - versionStore.lastCheckTime.getTime();
        // Проверяем если прошло больше 1 минуты
        if (timeSinceLastCheck > 60000) {
          versionStore.checkVersion();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [versionStore, enabled, checkOnFocus]);
};
