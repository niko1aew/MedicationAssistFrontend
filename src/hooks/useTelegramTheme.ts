// hooks/useTelegramTheme.ts
// Хук для применения цветовой темы Telegram к приложению

import { useEffect } from "react";
import { getTelegramWebApp } from "../services/telegramWebApp";

/**
 * Хук для применения цветовой темы Telegram Mini App
 * Автоматически применяет CSS переменные из Telegram при монтировании
 */
export function useTelegramTheme(): void {
  useEffect(() => {
    const tg = getTelegramWebApp();
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
      root.style.setProperty(
        "--tg-secondary-bg-color",
        theme.secondary_bg_color
      );
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

    // Подписываемся на изменение темы
    const handleThemeChange = () => {
      const newTheme = tg.themeParams;
      if (newTheme.bg_color) {
        root.style.setProperty("--tg-bg-color", newTheme.bg_color);
      }
      if (newTheme.text_color) {
        root.style.setProperty("--tg-text-color", newTheme.text_color);
      }
      if (newTheme.button_color) {
        root.style.setProperty("--tg-button-color", newTheme.button_color);
      }
      if (newTheme.button_text_color) {
        root.style.setProperty(
          "--tg-button-text-color",
          newTheme.button_text_color
        );
      }
      root.setAttribute(
        "data-telegram-theme",
        tg.colorScheme === "dark" ? "dark" : "light"
      );
    };

    tg.onEvent("themeChanged", handleThemeChange);

    return () => {
      tg.offEvent("themeChanged", handleThemeChange);
    };
  }, []);
}
