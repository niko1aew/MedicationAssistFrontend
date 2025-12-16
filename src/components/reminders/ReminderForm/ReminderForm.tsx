import React, { useState } from "react";
import { CreateReminderDto } from "../../../types/reminder.types";
import { Button, Input } from "../../common";
import { validateReminderTime } from "../../../utils/validators";
import styles from "./ReminderForm.module.css";

interface ReminderFormProps {
  medicationName: string;
  onSubmit: (data: CreateReminderDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialTime?: string;
  telegramUserId?: number;
}

interface FormErrors {
  time?: string;
}

export const ReminderForm: React.FC<ReminderFormProps> = ({
  medicationName,
  onSubmit,
  onCancel,
  isLoading = false,
  initialTime = "",
  telegramUserId = 0,
}) => {
  const [time, setTime] = useState(initialTime || "08:00");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const timeResult = validateReminderTime(time);
    if (!timeResult.isValid) {
      newErrors.time = timeResult.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Input type="time" уже возвращает время в формате HH:mm
    await onSubmit({
      telegramUserId: telegramUserId,
      medicationId: "", // Будет установлено в родительском компоненте
      time: time,
    });
  };

  const clearFieldError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.info}>
        <p className={styles.medicationName}>{medicationName}</p>
        <p className={styles.description}>
          Установите время ежедневного напоминания
        </p>
      </div>

      <div className={styles.fields}>
        <Input
          label="Время напоминания"
          type="time"
          value={time}
          onChange={(value) => {
            setTime(value);
            clearFieldError("time");
          }}
          error={errors.time}
          required
        />
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Отмена
        </Button>
        <Button type="submit" variant="primary" loading={isLoading}>
          Установить напоминание
        </Button>
      </div>
    </form>
  );
};
