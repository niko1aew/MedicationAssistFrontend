import { makeAutoObservable, runInAction } from 'mobx';
import { medicationsApi } from '../api/medications.api';
import { Medication, CreateMedicationDto, UpdateMedicationDto } from '../types/medication.types';
import type { RootStore } from './RootStore';

export class MedicationStore {
  rootStore: RootStore;
  medications: Medication[] = [];
  selectedMedication: Medication | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  searchQuery: string = '';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get userId(): string | null {
    return this.rootStore.authStore.userId;
  }

  get sortedMedications(): Medication[] {
    return [...this.medications].sort((a, b) => a.name.localeCompare(b.name));
  }

  get filteredMedications(): Medication[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      return this.sortedMedications;
    }
    return this.sortedMedications.filter(med =>
      med.name.toLowerCase().includes(query)
    );
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  async fetchMedications(): Promise<void> {
    if (!this.userId) return;
    
    this.isLoading = true;
    this.error = null;

    try {
      const response = await medicationsApi.getAll(this.userId);
      runInAction(() => {
        this.medications = response.data;
        this.isLoading = false;
      });
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка загрузки лекарств';
        this.isLoading = false;
      });
    }
  }

  async fetchMedicationById(id: string): Promise<void> {
    if (!this.userId) return;
    
    this.isLoading = true;
    this.error = null;

    try {
      const response = await medicationsApi.getById(this.userId, id);
      runInAction(() => {
        this.selectedMedication = response.data;
        this.isLoading = false;
      });
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Лекарство не найдено';
        this.isLoading = false;
      });
    }
  }

  async createMedication(data: CreateMedicationDto): Promise<Medication | null> {
    if (!this.userId) return null;
    
    this.isLoading = true;
    this.error = null;

    try {
      const response = await medicationsApi.create(this.userId, data);
      runInAction(() => {
        this.medications.push(response.data);
        this.isLoading = false;
      });
      return response.data;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка создания лекарства';
        this.isLoading = false;
      });
      return null;
    }
  }

  async updateMedication(id: string, data: UpdateMedicationDto): Promise<boolean> {
    if (!this.userId) return false;
    
    this.isLoading = true;
    this.error = null;

    try {
      const response = await medicationsApi.update(this.userId, id, data);
      runInAction(() => {
        const index = this.medications.findIndex(m => m.id === id);
        if (index !== -1) {
          this.medications[index] = response.data;
        }
        if (this.selectedMedication?.id === id) {
          this.selectedMedication = response.data;
        }
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка обновления лекарства';
        this.isLoading = false;
      });
      return false;
    }
  }

  async deleteMedication(id: string): Promise<boolean> {
    if (!this.userId) return false;
    
    this.isLoading = true;
    this.error = null;

    try {
      await medicationsApi.delete(this.userId, id);
      runInAction(() => {
        this.medications = this.medications.filter(m => m.id !== id);
        if (this.selectedMedication?.id === id) {
          this.selectedMedication = null;
        }
        this.isLoading = false;
      });
      return true;
    } catch (err: unknown) {
      runInAction(() => {
        const axiosError = err as { response?: { data?: { error?: string } } };
        this.error = axiosError.response?.data?.error || 'Ошибка удаления лекарства';
        this.isLoading = false;
      });
      return false;
    }
  }

  getMedicationById(id: string): Medication | undefined {
    return this.medications.find(m => m.id === id);
  }

  clear() {
    this.medications = [];
    this.selectedMedication = null;
    this.error = null;
    this.searchQuery = '';
  }

  clearError() {
    this.error = null;
  }
}

