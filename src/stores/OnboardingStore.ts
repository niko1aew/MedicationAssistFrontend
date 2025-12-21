import { makeAutoObservable, runInAction } from "mobx";
import type { RootStore } from "./RootStore";
import { OnboardingStep } from "../types/user.types";
import { usersApi } from "../api/users.api";

const ONBOARDING_SKIPPED_KEY = "onboarding_skipped";

export class OnboardingStore {
  rootStore: RootStore;

  // Текущий шаг в UI (может отличаться от сохраненного на сервере)
  currentStep: OnboardingStep = OnboardingStep.Welcome;

  // Флаг активности онбординга (отслеживает действия пользователя)
  isActive: boolean = false;

  // Флаг видимости модального окна (может быть скрыто, пока пользователь выполняет действие)
  isModalVisible: boolean = false;

  // Загрузка
  isLoading: boolean = false;

  // Ошибка
  error: string | null = null;

  // ID созданного лекарства (для перехода к напоминанию)
  createdMedicationId: string | null = null;
  createdMedicationName: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  // Проверяет, скипнут ли онбординг в localStorage
  isOnboardingSkipped(): boolean {
    const userId = this.rootStore.authStore.userId;
    if (!userId) return false;

    const skipped = localStorage.getItem(ONBOARDING_SKIPPED_KEY + "_" + userId);
    return skipped === "true";
  }

  // Сохраняет флаг скипа в localStorage
  setOnboardingSkipped(skipped: boolean): void {
    const userId = this.rootStore.authStore.userId;
    if (!userId) return;

    if (skipped) {
      localStorage.setItem(ONBOARDING_SKIPPED_KEY + "_" + userId, "true");
    } else {
      localStorage.removeItem(ONBOARDING_SKIPPED_KEY + "_" + userId);
    }
  }

  // Проверяет, нужно ли показывать онбординг
  get shouldShowOnboarding(): boolean {
    const user = this.rootStore.authStore.user;
    const isAuthenticated = this.rootStore.authStore.isAuthenticated;

    if (!isAuthenticated || !user) return false;

    // Если онбординг уже завершен - не показываем
    if (user.isOnboardingCompleted) return false;

    // Если пользователь скипнул онбординг в этой сессии
    if (this.isOnboardingSkipped()) return false;

    return true;
  }

  // Запускает онбординг
  startOnboarding(): void {
    this.isActive = true;
    this.isModalVisible = true;
    this.currentStep = OnboardingStep.Welcome;
    this.createdMedicationId = null;
    this.createdMedicationName = null;
    this.setOnboardingSkipped(false);
  }

  // Показывает модальное окно
  showModal(): void {
    this.isModalVisible = true;
  }

  // Скрывает модальное окно (онбординг продолжает отслеживать действия)
  hideModal(): void {
    this.isModalVisible = false;
  }

  // Переходит к следующему шагу
  nextStep(): void {
    if (this.currentStep < OnboardingStep.Completed) {
      this.currentStep = this.currentStep + 1;
      this.isModalVisible = true; // Показываем модалку на новом шаге
      this.syncStepToServer();
    }
  }

  // Устанавливает конкретный шаг
  setStep(step: OnboardingStep): void {
    this.currentStep = step;
    this.syncStepToServer();
  }

  // Сохраняет информацию о созданном лекарстве
  setCreatedMedication(id: string, name: string): void {
    this.createdMedicationId = id;
    this.createdMedicationName = name;
  }

  // Пропускает онбординг
  skipOnboarding(): void {
    this.isActive = false;
    this.isModalVisible = false;
    this.setOnboardingSkipped(true);
    this.currentStep = OnboardingStep.Welcome;
  }

  // Завершает онбординг
  async completeOnboarding(): Promise<boolean> {
    const userId = this.rootStore.authStore.userId;
    if (!userId) return false;

    this.isLoading = true;
    this.error = null;

    try {
      const response = await usersApi.updateOnboarding(userId, {
        isCompleted: true,
        step: OnboardingStep.Completed,
      });

      runInAction(() => {
        this.isLoading = false;
        this.isActive = false;
        this.isModalVisible = false;
        this.currentStep = OnboardingStep.Welcome;
        this.createdMedicationId = null;
        this.createdMedicationName = null;

        // Обновляем пользователя в AuthStore
        if (this.rootStore.authStore.user) {
          this.rootStore.authStore.updateUser(response.data);
        }
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this.isLoading = false;
        this.error =
          err instanceof Error ? err.message : "Ошибка завершения онбординга";
      });
      return false;
    }
  }

  // Синхронизирует текущий шаг с сервером
  async syncStepToServer(): Promise<void> {
    const userId = this.rootStore.authStore.userId;
    if (!userId) return;

    try {
      await usersApi.updateOnboarding(userId, {
        step: this.currentStep,
      });
    } catch {
      // Тихо игнорируем ошибки синхронизации шага
      console.warn("Failed to sync onboarding step to server");
    }
  }

  // Сбрасывает онбординг (для повторного прохождения)
  async resetOnboarding(): Promise<boolean> {
    const userId = this.rootStore.authStore.userId;
    if (!userId) return false;

    this.isLoading = true;
    this.error = null;

    try {
      const response = await usersApi.updateOnboarding(userId, {
        isCompleted: false,
        step: OnboardingStep.Welcome,
      });

      runInAction(() => {
        this.isLoading = false;
        this.setOnboardingSkipped(false);

        // Обновляем пользователя в AuthStore
        if (this.rootStore.authStore.user) {
          this.rootStore.authStore.updateUser(response.data);
        }

        // Запускаем онбординг заново
        this.startOnboarding();
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this.isLoading = false;
        this.error =
          err instanceof Error ? err.message : "Ошибка сброса онбординга";
      });
      return false;
    }
  }
}
