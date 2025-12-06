export interface Medication {
  id: string;           // GUID
  userId: string;       // GUID
  name: string;
  description: string | null;
  dosage: string | null;
  createdAt: string;    // ISO 8601 datetime
  updatedAt: string | null;
}

export interface CreateMedicationDto {
  name: string;
  description?: string;
  dosage?: string;
}

export interface UpdateMedicationDto {
  name: string;
  description?: string;
  dosage?: string;
}

