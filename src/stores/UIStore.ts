import { makeAutoObservable } from "mobx";
import type { RootStore } from "./RootStore";

export type ModalType =
  | "createMedication"
  | "editMedication"
  | "deleteMedication"
  | "createIntake"
  | "editIntake"
  | "deleteIntake"
  | "quickIntake"
  | "confirm"
  | null;

export type ToastType = "success" | "error" | "warning" | "info";
export type Theme = "light" | "dark";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export class UIStore {
  rootStore: RootStore;

  // Модальные окна
  activeModal: ModalType = null;
  modalData: unknown = null;

  // Тосты (уведомления)
  toasts: Toast[] = [];

  // Сайдбар
  isSidebarCollapsed: boolean = false;

  // Мобильное меню
  isMobileMenuOpen: boolean = false;

  // Тема
  theme: Theme = "light";

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.loadTheme();
  }

  // Загрузка темы из localStorage
  private loadTheme() {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      this.theme = savedTheme;
    } else {
      // Определяем предпочтения системы
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      this.theme = prefersDark ? "dark" : "light";
    }
    // Устанавливаем тему при загрузке
    document.documentElement.setAttribute("data-theme", this.theme);
    this.updateThemeColor(this.theme);
  }

  // Модальные окна
  openModal(type: ModalType, data?: unknown) {
    this.activeModal = type;
    this.modalData = data || null;
  }

  closeModal() {
    this.activeModal = null;
    this.modalData = null;
  }

  // Тосты
  showToast(type: ToastType, message: string) {
    const id = Date.now().toString();
    this.toasts.push({ id, type, message });

    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
      this.removeToast(id);
    }, 5000);
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  // Сайдбар
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Мобильное меню
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  // Обновление meta theme-color для iOS статус-бара
  private updateThemeColor(theme: Theme) {
    const themeColor = theme === "dark" ? "#0f172a" : "#ffffff";

    // Обновляем или создаем meta тег theme-color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", themeColor);
  }

  // Тема
  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.theme);
    document.documentElement.setAttribute("data-theme", this.theme);
    this.updateThemeColor(this.theme);
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    this.updateThemeColor(theme);
  }
}
