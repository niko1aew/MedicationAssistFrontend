// components/common/TelegramWebAppInit/TelegramWebAppInit.tsx
// Компонент для инициализации и авторизации через Telegram Mini App

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../hooks/useStores";
import {
  isTelegramWebApp,
  getTelegramWebApp,
  applyTelegramTheme,
} from "../../../services/telegramWebApp";
import { Loader } from "../Loader";
import styles from "./TelegramWebAppInit.module.css";

interface TelegramWebAppInitProps {
  children: React.ReactNode;
}

/**
 * Компонент-обёртка для инициализации Telegram Mini App
 * Автоматически авторизует пользователя при открытии из Telegram
 */
export const TelegramWebAppInit = observer(function TelegramWebAppInit({
  children,
}: TelegramWebAppInitProps) {
  const { authStore } = useStores();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function initTelegramAuth() {
      // Проверяем, запущено ли приложение внутри Telegram Mini App
      if (!isTelegramWebApp()) {
        console.log("Not running inside Telegram Mini App, skipping auto-auth");
        setIsInitializing(false);
        return;
      }

      const tg = getTelegramWebApp();
      if (!tg) {
        setIsInitializing(false);
        return;
      }

      console.log("Running inside Telegram Mini App, initializing...");

      // Сообщаем Telegram, что приложение готово
      tg.ready();

      // Расширяем на весь экран
      tg.expand();

      // Применяем тему Telegram
      applyTelegramTheme();

      // Если пользователь уже авторизован с валидным токеном, пропускаем авторизацию
      if (authStore.isAuthenticated) {
        console.log("User already authenticated, skipping Telegram auth");
        setIsInitializing(false);
        return;
      }

      // Получаем initData для авторизации
      const initData = tg.initData;
      if (!initData) {
        console.warn("No initData available from Telegram");
        setIsInitializing(false);
        return;
      }

      try {
        // Выполняем авторизацию через AuthStore
        const success = await authStore.telegramWebAppLogin(initData);

        if (success) {
          console.log("Telegram Mini App auth successful");
        } else {
          console.error("Telegram Mini App auth failed:", authStore.error);
          setInitError(authStore.error || "Ошибка авторизации");
        }
      } catch (error) {
        console.error("Telegram Mini App auth error:", error);
        setInitError(
          error instanceof Error ? error.message : "Неизвестная ошибка"
        );
      } finally {
        setIsInitializing(false);
      }
    }

    initTelegramAuth();
  }, [authStore]);

  // Показываем лоадер при инициализации
  if (isInitializing) {
    return (
      <div className={styles.initContainer}>
        <Loader size="large" />
        <p className={styles.initText}>Загрузка приложения...</p>
      </div>
    );
  }

  // Показываем ошибку инициализации (но не блокируем приложение)
  if (initError && !authStore.isAuthenticated) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2 className={styles.errorTitle}>Ошибка авторизации</h2>
        <p className={styles.errorMessage}>{initError}</p>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return <>{children}</>;
});
