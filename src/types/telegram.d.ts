// types/telegram.d.ts

/**
 * Telegram Web App SDK типы
 * @see https://core.telegram.org/bots/webapps
 */

interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
  allows_write_to_pm?: boolean;
}

interface TelegramWebAppChat {
  id: number;
  type: "group" | "supergroup" | "channel";
  title: string;
  username?: string;
  photo_url?: string;
}

interface TelegramWebAppInitData {
  query_id?: string;
  user?: TelegramWebAppUser;
  receiver?: TelegramWebAppUser;
  chat?: TelegramWebAppChat;
  chat_type?: "sender" | "private" | "group" | "supergroup" | "channel";
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
}

interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  bottom_bar_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  section_separator_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

interface TelegramMainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible: boolean;
  setText: (text: string) => TelegramMainButton;
  onClick: (callback: () => void) => TelegramMainButton;
  offClick: (callback: () => void) => TelegramMainButton;
  show: () => TelegramMainButton;
  hide: () => TelegramMainButton;
  enable: () => TelegramMainButton;
  disable: () => TelegramMainButton;
  showProgress: (leaveActive?: boolean) => TelegramMainButton;
  hideProgress: () => TelegramMainButton;
  setParams: (params: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }) => TelegramMainButton;
}

interface TelegramBackButton {
  isVisible: boolean;
  onClick: (callback: () => void) => TelegramBackButton;
  offClick: (callback: () => void) => TelegramBackButton;
  show: () => TelegramBackButton;
  hide: () => TelegramBackButton;
}

interface TelegramSettingsButton {
  isVisible: boolean;
  onClick: (callback: () => void) => TelegramSettingsButton;
  offClick: (callback: () => void) => TelegramSettingsButton;
  show: () => TelegramSettingsButton;
  hide: () => TelegramSettingsButton;
}

interface TelegramHapticFeedback {
  impactOccurred: (
    style: "light" | "medium" | "heavy" | "rigid" | "soft"
  ) => TelegramHapticFeedback;
  notificationOccurred: (
    type: "error" | "success" | "warning"
  ) => TelegramHapticFeedback;
  selectionChanged: () => TelegramHapticFeedback;
}

interface TelegramCloudStorage {
  setItem: (
    key: string,
    value: string,
    callback?: (error: string | null, success: boolean) => void
  ) => void;
  getItem: (
    key: string,
    callback: (error: string | null, value: string | null) => void
  ) => void;
  getItems: (
    keys: string[],
    callback: (error: string | null, values: Record<string, string>) => void
  ) => void;
  removeItem: (
    key: string,
    callback?: (error: string | null, success: boolean) => void
  ) => void;
  removeItems: (
    keys: string[],
    callback?: (error: string | null, success: boolean) => void
  ) => void;
  getKeys: (callback: (error: string | null, keys: string[]) => void) => void;
}

interface TelegramPopupButton {
  id?: string;
  type?: "default" | "ok" | "close" | "cancel" | "destructive";
  text?: string;
}

interface TelegramPopupParams {
  title?: string;
  message: string;
  buttons?: TelegramPopupButton[];
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitData;
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: TelegramThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  bottomBarColor: string;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;
  MainButton: TelegramMainButton;
  BackButton: TelegramBackButton;
  SettingsButton: TelegramSettingsButton;
  HapticFeedback: TelegramHapticFeedback;
  CloudStorage: TelegramCloudStorage;

  isVersionAtLeast: (version: string) => boolean;
  setHeaderColor: (
    color: "bg_color" | "secondary_bg_color" | `#${string}`
  ) => void;
  setBackgroundColor: (
    color: "bg_color" | "secondary_bg_color" | `#${string}`
  ) => void;
  setBottomBarColor: (
    color: "bg_color" | "secondary_bg_color" | `#${string}`
  ) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  enableVerticalSwipes: () => void;
  disableVerticalSwipes: () => void;
  onEvent: (
    eventType: string,
    eventHandler: (...args: unknown[]) => void
  ) => void;
  offEvent: (
    eventType: string,
    eventHandler: (...args: unknown[]) => void
  ) => void;
  sendData: (data: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (
    url: string,
    callback?: (status: "paid" | "cancelled" | "failed" | "pending") => void
  ) => void;
  showPopup: (
    params: TelegramPopupParams,
    callback?: (button_id: string) => void
  ) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (
    message: string,
    callback?: (confirmed: boolean) => void
  ) => void;
  showScanQrPopup: (
    params: { text?: string },
    callback?: (text: string) => boolean | void
  ) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (text: string | null) => void) => void;
  requestWriteAccess: (callback?: (access_granted: boolean) => void) => void;
  requestContact: (
    callback?: (shared: boolean, contact?: unknown) => void
  ) => void;
  ready: () => void;
  expand: () => void;
  close: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export {
  TelegramWebApp,
  TelegramWebAppUser,
  TelegramWebAppInitData,
  TelegramThemeParams,
  TelegramMainButton,
  TelegramBackButton,
  TelegramHapticFeedback,
  TelegramCloudStorage,
  TelegramPopupParams,
  TelegramPopupButton,
};
