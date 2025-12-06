import { makeAutoObservable, runInAction } from 'mobx';
import { intakesApi } from '../api/intakes.api';
import { MedicationIntake, CreateIntakeDto, UpdateIntakeDto, IntakeFilter } from '../types/intake.types';
import type { RootStore } from './RootStore';

export class IntakeStore {
  rootStore: RootStore;
  intakes: MedicationIntake[] = [];
  selectedIntake: MedicationIntake | null = null;
  filter: IntakeFilter = {};
  isLoading: boolean = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get userId(): string | null {
    return this.rootStore.authStore.userId;
  }

  // Сортировка по времени приема (новые сверху)
  get sortedIntakes(): MedicationIntake[] {
    return [...this.intakes].sort(
      (a, b) => new Date(b.intakeTime).getTime() - new Date(a.intakeTime).getTime()
    );
  }

  // Приемы за сегодня
  get todayIntakes(): MedicationIntake[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.sortedIntakes.filter(intake => {
      const intakeDate = new Date(intake.intakeTime);
      return intakeDate >= today && intakeDate < tomorrow;
    });
  }

  // Группировка по дате
  get intakesGroupedByDate(): Map<string, MedicationIntake[]> {
    const grouped = new Map<string, MedicationIntake[]>();
    
    this.sortedIntakes.forEach(intake => {
      const date = new Date(intake.intakeTime).toLocaleDateString('ru-RU');
      const existing = grouped.get(date) || [];
      grouped.set(date, [...existing, intake]);
    });
    
    return grouped;
  }

  setFilter(filter: IntakeFilter) {
    this.filter = filter;
  }

  clearFilter() {
    this.filter = {};
  }

  async fetchIntakes(customFilter?: IntakeFilter): Promise<void> {
    if (!this.userId) return;
    
    this.isLoading = true;
    this.error = null;
    const filterToUse = customFilter || this.filter;

    try {
      const response = await intakesApi.getAll(this.userId, filterToUse);
      runInAction(() => {
        this.intakes = response.data;
        this.isLoading = false;
      });
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка загрузки истории приемов';
        this.isLoading = false;
      });
    }
  }

  async fetchIntakeById(id: string): Promise<void> {
    if (!this.userId) return;
    
    this.isLoading = true;
    this.error = null;

    try {
      const response = await intakesApi.getById(this.userId, id);
      runInAction(() => {
        this.selectedIntake = response.data;
        this.isLoading = false;
      });
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Запись не найдена';
        this.isLoading = false;
      });
    }
  }

  async createIntake(data: CreateIntakeDto): Promise<MedicationIntake | null> {
    if (!this.userId) return null;
    
    this.isLoading = true;
    this.error = null;

    try {
      const response = await intakesApi.create(this.userId, data);
      runInAction(() => {
        this.intakes.unshift(response.data);
        this.isLoading = false;
      });
      return response.data;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка регистрации приема';
        this.isLoading = false;
      });
      return null;
    }
  }

  async updateIntake(id: string, data: UpdateIntakeDto): Promise<boolean> {
    if (!this.userId) return false;
    
    this.isLoading = true;
    this.error = null;

    try {
      const response = await intakesApi.update(this.userId, id, data);
      runInAction(() => {
        const index = this.intakes.findIndex(i => i.id === id);
        if (index !== -1) {
          this.intakes[index] = response.data;
        }
        if (this.selectedIntake?.id === id) {
          this.selectedIntake = response.data;
        }
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка обновления записи';
        this.isLoading = false;
      });
      return false;
    }
  }

  async deleteIntake(id: string): Promise<boolean> {
    if (!this.userId) return false;
    
    this.isLoading = true;
    this.error = null;

    try {
      await intakesApi.delete(this.userId, id);
      runInAction(() => {
        this.intakes = this.intakes.filter(i => i.id !== id);
        if (this.selectedIntake?.id === id) {
          this.selectedIntake = null;
        }
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка удаления записи';
        this.isLoading = false;
      });
      return false;
    }
  }

  // Быстрая регистрация приема (текущее время)
  async quickIntake(medicationId: string, notes?: string): Promise<MedicationIntake | null> {
    return this.createIntake({
      medicationId,
      notes,
      // intakeTime не указываем — сервер установит текущее время
    });
  }

  clear() {
    this.intakes = [];
    this.selectedIntake = null;
    this.filter = {};
    this.error = null;
  }

  clearError() {
    this.error = null;
  }
}

