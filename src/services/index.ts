// services/index.ts
// Экспорт всех сервисов

export {
  isTelegramWebApp,
  getTelegramWebApp,
  initTelegramWebApp,
  applyTelegramTheme,
  getTelegramTheme,
  getTelegramColorScheme,
  closeTelegramWebApp,
  showTelegramAlert,
  showTelegramConfirm,
  triggerHapticFeedback,
  handleTelegramAuthError,
  type TelegramWebAppAuthResponse,
} from "./telegramWebApp";
