import { makeAutoObservable } from 'mobx';
import type { RootStore } from './RootStore';

export type ModalType = 'createMedication' | 'editMedication' | 'deleteMedication' |
                        'createIntake' | 'editIntake' | 'deleteIntake' | 
                        'quickIntake' | 'confirm' | null;

export type ToastType = 'success' | 'error' | 'warning' | 'info';

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

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
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
    this.toasts = this.toasts.filter(t => t.id !== id);
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
}

