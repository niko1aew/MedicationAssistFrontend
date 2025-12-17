import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../hooks/useStores";
import { MedicationIntake, CreateIntakeDto } from "../../../types/intake.types";
import { Button, Input, Select, Textarea } from "../../common";
import { validateNotes, validateIntakeTime } from "../../../utils/validators";
import {
  toDateTimeLocalValue,
  getCurrentDateTimeLocal,
} from "../../../utils/formatDate";
import { formatLocalTimeForApi } from "../../../utils/timezone";
import styles from "./IntakeForm.module.css";

interface IntakeFormProps {
  intake?: MedicationIntake;
  preselectedMedicationId?: string;
  onSubmit: (data: CreateIntakeDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  medicationId?: string;
  intakeTime?: string;
  notes?: string;
}

export const IntakeForm: React.FC<IntakeFormProps> = observer(
  ({
    intake,
    preselectedMedicationId,
    onSubmit,
    onCancel,
    isLoading = false,
  }) => {
    const { medicationStore } = useStores();

    const [medicationId, setMedicationId] = useState(
      intake?.medicationId || preselectedMedicationId || ""
    );
    const [intakeTime, setIntakeTime] = useState(
      intake
        ? toDateTimeLocalValue(intake.intakeTime)
        : getCurrentDateTimeLocal()
    );
    const [notes, setNotes] = useState(intake?.notes || "");
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
      if (medicationStore.medications.length === 0) {
        medicationStore.fetchMedications();
      }
    }, [medicationStore]);

    const medicationOptions = medicationStore.sortedMedications.map((med) => ({
      value: med.id,
      label: med.name,
    }));

    const validate = (): boolean => {
      const newErrors: FormErrors = {};

      if (!intake && !medicationId) {
        newErrors.medicationId = "Выберите лекарство";
      }

      const timeResult = validateIntakeTime(intakeTime);
      if (!timeResult.isValid) newErrors.intakeTime = timeResult.error;

      const notesResult = validateNotes(notes);
      if (!notesResult.isValid) newErrors.notes = notesResult.error;

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      // Конвертируем локальное время в формат для API (БЕЗ 'Z')
      const localTimeForApi = intakeTime
        ? formatLocalTimeForApi(new Date(intakeTime))
        : undefined;

      await onSubmit({
        medicationId: intake?.medicationId || medicationId,
        intakeTime: localTimeForApi,
        notes: notes.trim() || undefined,
      });
    };

    const clearFieldError = (field: keyof FormErrors) => {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          {!intake && (
            <Select
              label="Лекарство"
              options={medicationOptions}
              value={medicationId}
              onChange={(value) => {
                setMedicationId(value);
                clearFieldError("medicationId");
              }}
              error={errors.medicationId}
              placeholder="Выберите лекарство"
              required
              disabled={!!preselectedMedicationId}
            />
          )}

          <Input
            label="Время приема"
            type="datetime-local"
            value={intakeTime}
            onChange={(value) => {
              setIntakeTime(value);
              clearFieldError("intakeTime");
            }}
            error={errors.intakeTime}
          />

          <Textarea
            label="Примечания"
            value={notes}
            onChange={(value) => {
              setNotes(value);
              clearFieldError("notes");
            }}
            error={errors.notes}
            placeholder="Дополнительная информация..."
            maxLength={500}
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Отмена
          </Button>
          <Button type="submit" variant="primary" loading={isLoading}>
            {intake ? "Сохранить" : "Записать прием"}
          </Button>
        </div>
      </form>
    );
  }
);
