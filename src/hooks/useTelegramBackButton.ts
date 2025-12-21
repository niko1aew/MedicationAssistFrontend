// hooks/useTelegramBackButton.ts
// Хук для работы с кнопкой "Назад" в Telegram Mini App

import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTelegramWebApp } from "../services/telegramWebApp";

/**
 * Хук для управления кнопкой "Назад" в Telegram Mini App
 * @param onBack - Кастомный обработчик нажатия. Если не указан, будет использован navigate(-1)
 * @param isVisible - Показывать ли кнопку (по умолчанию true)
 */
export function useTelegramBackButton(
  onBack?: () => void,
  isVisible: boolean = true
): void {
  const navigate = useNavigate();

  // Используем ref для хранения актуального callback
  const callbackRef = useRef(onBack);
  callbackRef.current = onBack;

  // Стабильный wrapper для onBack
  const handleBack = useCallback(() => {
    if (callbackRef.current) {
      callbackRef.current();
    } else {
      navigate(-1);
    }
  }, [navigate]);

  useEffect(() => {
    const tg = getTelegramWebApp();
    if (!tg) return;

    const backButton = tg.BackButton;

    backButton.onClick(handleBack);

    if (isVisible) {
      backButton.show();
    } else {
      backButton.hide();
    }

    return () => {
      backButton.offClick(handleBack);
      backButton.hide();
    };
  }, [handleBack, isVisible]);
}

/**
 * Показать кнопку "Назад" в Telegram
 */
export function showTelegramBackButton(onClick: () => void): () => void {
  const tg = getTelegramWebApp();
  if (!tg) return () => {};

  const backButton = tg.BackButton;
  backButton.onClick(onClick);
  backButton.show();

  return () => {
    backButton.offClick(onClick);
    backButton.hide();
  };
}

/**
 * Скрыть кнопку "Назад" в Telegram
 */
export function hideTelegramBackButton(): void {
  getTelegramWebApp()?.BackButton.hide();
}
