// stores/VersionStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { versionApi } from "../api/version.api";

const CURRENT_VERSION = "1.0.0"; // Будет синхронизироваться с package.json
const DISMISSED_VERSION_KEY = "dismissedVersion";

export class VersionStore {
  currentVersion: string = CURRENT_VERSION;
  latestVersion: string | null = null;
  updateAvailable: boolean = false;
  isChecking: boolean = false;
  lastCheckTime: Date = new Date();
  dismissedVersion: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadDismissedVersion();
  }

  /**
   * Проверить доступность новой версии
   */
  async checkVersion(): Promise<void> {
    if (this.isChecking) {
      return;
    }

    this.isChecking = true;

    try {
      const versionInfo = await versionApi.getVersion();

      runInAction(() => {
        this.latestVersion = versionInfo.version;
        this.lastCheckTime = new Date();

        // Проверяем, есть ли обновление и не было ли оно отклонено
        if (
          this.latestVersion !== this.currentVersion &&
          this.latestVersion !== this.dismissedVersion
        ) {
          this.updateAvailable = true;
        }

        this.isChecking = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isChecking = false;
        console.error("Failed to check version:", error);
      });
    }
  }

  /**
   * Отклонить текущее обновление
   * Пользователь не увидит уведомление до следующего обновления
   */
  dismissUpdate(): void {
    if (this.latestVersion) {
      this.dismissedVersion = this.latestVersion;
      localStorage.setItem(DISMISSED_VERSION_KEY, this.latestVersion);
    }
    this.updateAvailable = false;
  }

  /**
   * Загрузить информацию об отклоненной версии из localStorage
   */
  private loadDismissedVersion(): void {
    const dismissed = localStorage.getItem(DISMISSED_VERSION_KEY);
    if (dismissed) {
      this.dismissedVersion = dismissed;
    }
  }

  /**
   * Перезагрузить приложение для применения обновления
   */
  reloadApp(): void {
    // Очищаем кэш и перезагружаем страницу
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    // Принудительная перезагрузка без кэша
    window.location.reload();
  }

  /**
   * Сбросить информацию об отклоненной версии
   * (используется для тестирования)
   */
  clearDismissedVersion(): void {
    this.dismissedVersion = null;
    localStorage.removeItem(DISMISSED_VERSION_KEY);
  }
}
