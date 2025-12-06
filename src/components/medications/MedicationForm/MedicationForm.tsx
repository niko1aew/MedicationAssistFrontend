import React, { useState, useEffect } from 'react';
import { Medication, CreateMedicationDto, UpdateMedicationDto } from '../../../types/medication.types';
import { Button, Input, Textarea } from '../../common';
import { validateMedicationName, validateDescription, validateDosage } from '../../../utils/validators';
import styles from './MedicationForm.module.css';

interface MedicationFormProps {
  medication?: Medication;
  onSubmit: (data: CreateMedicationDto | UpdateMedicationDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  dosage?: string;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({
  medication,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState(medication?.name || '');
  const [description, setDescription] = useState(medication?.description || '');
  const [dosage, setDosage] = useState(medication?.dosage || '');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDescription(medication.description || '');
      setDosage(medication.dosage || '');
    }
  }, [medication]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    const nameResult = validateMedicationName(name);
    if (!nameResult.isValid) newErrors.name = nameResult.error;
    
    const descResult = validateDescription(description);
    if (!descResult.isValid) newErrors.description = descResult.error;
    
    const dosageResult = validateDosage(dosage);
    if (!dosageResult.isValid) newErrors.dosage = dosageResult.error;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      dosage: dosage.trim() || undefined,
    });
  };

  const clearFieldError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <Input
          label="Название лекарства"
          type="text"
          value={name}
          onChange={(value) => {
            setName(value);
            clearFieldError('name');
          }}
          error={errors.name}
          placeholder="Например: Аспирин"
          required
          maxLength={200}
        />
        
        <Input
          label="Дозировка"
          type="text"
          value={dosage}
          onChange={(value) => {
            setDosage(value);
            clearFieldError('dosage');
          }}
          error={errors.dosage}
          placeholder="Например: 500 мг, 2 таблетки"
          maxLength={100}
        />
        
        <Textarea
          label="Описание"
          value={description}
          onChange={(value) => {
            setDescription(value);
            clearFieldError('description');
          }}
          error={errors.description}
          placeholder="Дополнительная информация о лекарстве..."
          maxLength={1000}
          rows={3}
        />
      </div>
      
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Отмена
        </Button>
        <Button type="submit" variant="primary" loading={isLoading}>
          {medication ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </form>
  );
};

