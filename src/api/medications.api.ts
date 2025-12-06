import client from './client';
import { Medication, CreateMedicationDto, UpdateMedicationDto } from '../types/medication.types';

export const medicationsApi = {
  getAll: (userId: string) => 
    client.get<Medication[]>(`/users/${userId}/medications`),
  
  getById: (userId: string, id: string) => 
    client.get<Medication>(`/users/${userId}/medications/${id}`),
  
  create: (userId: string, data: CreateMedicationDto) => 
    client.post<Medication>(`/users/${userId}/medications`, data),
  
  update: (userId: string, id: string, data: UpdateMedicationDto) => 
    client.put<Medication>(`/users/${userId}/medications/${id}`, data),
  
  delete: (userId: string, id: string) => 
    client.delete(`/users/${userId}/medications/${id}`),
};

