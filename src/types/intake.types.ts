export interface MedicationIntake {
  id: string;           // GUID
  userId: string;       // GUID
  medicationId: string; // GUID
  medicationName: string;
  intakeTime: string;   // ISO 8601 datetime
  notes: string | null;
  createdAt: string;    // ISO 8601 datetime
  updatedAt: string | null;
}

export interface CreateIntakeDto {
  medicationId: string;
  intakeTime?: string;  // ISO 8601, опционально (по умолчанию — текущее время)
  notes?: string;
}

export interface UpdateIntakeDto {
  intakeTime: string;   // ISO 8601
  notes?: string;
}

export interface IntakeFilter {
  fromDate?: string;    // ISO 8601
  toDate?: string;      // ISO 8601
  medicationId?: string;
}

