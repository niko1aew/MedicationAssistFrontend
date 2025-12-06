import client from './client';
import { MedicationIntake, CreateIntakeDto, UpdateIntakeDto, IntakeFilter } from '../types/intake.types';

export const intakesApi = {
  getAll: (userId: string, filter?: IntakeFilter) => {
    const params = new URLSearchParams();
    if (filter?.fromDate) params.append('fromDate', filter.fromDate);
    if (filter?.toDate) params.append('toDate', filter.toDate);
    if (filter?.medicationId) params.append('medicationId', filter.medicationId);
    
    const queryString = params.toString();
    return client.get<MedicationIntake[]>(`/users/${userId}/intakes${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (userId: string, id: string) => 
    client.get<MedicationIntake>(`/users/${userId}/intakes/${id}`),
  
  create: (userId: string, data: CreateIntakeDto) => 
    client.post<MedicationIntake>(`/users/${userId}/intakes`, data),
  
  update: (userId: string, id: string, data: UpdateIntakeDto) => 
    client.put<MedicationIntake>(`/users/${userId}/intakes/${id}`, data),
  
  delete: (userId: string, id: string) => 
    client.delete(`/users/${userId}/intakes/${id}`),
};

