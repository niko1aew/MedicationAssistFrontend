export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Введите email' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Некорректный email' };
  }
  if (email.length > 200) {
    return { isValid: false, error: 'Email не может превышать 200 символов' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Введите пароль' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Пароль должен содержать минимум 6 символов' };
  }
  if (password.length > 100) {
    return { isValid: false, error: 'Пароль не может превышать 100 символов' };
  }
  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Введите имя' };
  }
  if (name.length > 200) {
    return { isValid: false, error: 'Имя не может превышать 200 символов' };
  }
  return { isValid: true };
};

export const validateMedicationName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Введите название лекарства' };
  }
  if (name.length > 200) {
    return { isValid: false, error: 'Название не может превышать 200 символов' };
  }
  return { isValid: true };
};

export const validateDescription = (description: string): ValidationResult => {
  if (description.length > 1000) {
    return { isValid: false, error: 'Описание не может превышать 1000 символов' };
  }
  return { isValid: true };
};

export const validateDosage = (dosage: string): ValidationResult => {
  if (dosage.length > 100) {
    return { isValid: false, error: 'Дозировка не может превышать 100 символов' };
  }
  return { isValid: true };
};

export const validateNotes = (notes: string): ValidationResult => {
  if (notes.length > 500) {
    return { isValid: false, error: 'Примечания не могут превышать 500 символов' };
  }
  return { isValid: true };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Подтвердите пароль' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Пароли не совпадают' };
  }
  return { isValid: true };
};

export const validateIntakeTime = (intakeTime: string): ValidationResult => {
  if (!intakeTime) {
    return { isValid: true }; // Необязательное поле
  }
  const date = new Date(intakeTime);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date > tomorrow) {
    return { isValid: false, error: 'Время приема не может быть более чем через день' };
  }
  return { isValid: true };
};

export const validateReminderTime = (time: string): ValidationResult => {
  if (!time.trim()) {
    return { isValid: false, error: 'Введите время напоминания' };
  }
  
  // Формат HH:mm (24-часовой)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return { isValid: false, error: 'Введите время в формате ЧЧ:ММ (например, 08:00)' };
  }
  
  return { isValid: true };
};

