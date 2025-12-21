// hooks/useTelegramMainButton.ts
// Хук для работы с главной кнопкой Telegram Mini App

import { useEffect, useCallback, useRef } from "react";
import { getTelegramWebApp } from "../services/telegramWebApp";

interface UseTelegramMainButtonOptions {
  text: string;
  onClick: () => void;
  isVisible?: boolean;
  isActive?: boolean;
  color?: string;
  textColor?: string;
  showProgress?: boolean;
}

/**
 * Хук для управления главной кнопкой Telegram Mini App
 * @param options - Параметры кнопки
 */
export function useTelegramMainButton(
  options: UseTelegramMainButtonOptions
): void {
  const {
    text,
    onClick,
    isVisible = true,
    isActive = true,
    color,
    textColor,
    showProgress = false,
  } = options;

  // Используем ref для хранения актуального callback
  const callbackRef = useRef(onClick);
  callbackRef.current = onClick;

  // Стабильный wrapper для onClick
  const stableOnClick = useCallback(() => {
    callbackRef.current();
  }, []);

  useEffect(() => {
    const tg = getTelegramWebApp();
    if (!tg) return;

    const mainButton = tg.MainButton;

    // Устанавливаем текст
    mainButton.setText(text);

    // Устанавливаем цвета если указаны
    if (color || textColor) {
      mainButton.setParams({
        color: color,
        text_color: textColor,
      });
    }

    // Устанавливаем активность
    if (isActive) {
      mainButton.enable();
    } else {
      mainButton.disable();
    }

    // Показываем/скрываем прогресс
    if (showProgress) {
      mainButton.showProgress(true);
    } else {
      mainButton.hideProgress();
    }

    // Устанавливаем обработчик
    mainButton.onClick(stableOnClick);

    // Показываем/скрываем кнопку
    if (isVisible) {
      mainButton.show();
    } else {
      mainButton.hide();
    }

    // Очистка при размонтировании
    return () => {
      mainButton.offClick(stableOnClick);
      mainButton.hide();
    };
  }, [
    text,
    isVisible,
    isActive,
    color,
    textColor,
    showProgress,
    stableOnClick,
  ]);
}

/**
 * Показать главную кнопку Telegram
 */
export function showTelegramMainButton(
  text: string,
  onClick: () => void
): () => void {
  const tg = getTelegramWebApp();
  if (!tg) return () => {};

  const mainButton = tg.MainButton;
  mainButton.setText(text);
  mainButton.onClick(onClick);
  mainButton.show();

  return () => {
    mainButton.offClick(onClick);
    mainButton.hide();
  };
}

/**
 * Скрыть главную кнопку Telegram
 */
export function hideTelegramMainButton(): void {
  getTelegramWebApp()?.MainButton.hide();
}
