import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/useStores';
import { IntakeFilter as IntakeFilterType } from '../../../types/intake.types';
import { Button, Input, Select } from '../../common';
import { toDateValue } from '../../../utils/formatDate';
import styles from './IntakeFilter.module.css';

interface IntakeFilterProps {
  onApply: (filter: IntakeFilterType) => void;
  onReset: () => void;
}

export const IntakeFilter: React.FC<IntakeFilterProps> = observer(({
  onApply,
  onReset,
}) => {
  const { medicationStore, intakeStore } = useStores();
  
  const [fromDate, setFromDate] = useState(intakeStore.filter.fromDate ? toDateValue(intakeStore.filter.fromDate) : '');
  const [toDate, setToDate] = useState(intakeStore.filter.toDate ? toDateValue(intakeStore.filter.toDate) : '');
  const [medicationId, setMedicationId] = useState(intakeStore.filter.medicationId || '');

  const medicationOptions = [
    { value: '', label: 'Все лекарства' },
    ...medicationStore.sortedMedications.map((med) => ({
      value: med.id,
      label: med.name,
    })),
  ];

  const handleApply = () => {
    const filter: IntakeFilterType = {};
    
    if (fromDate) {
      filter.fromDate = new Date(fromDate).toISOString();
    }
    if (toDate) {
      const date = new Date(toDate);
      date.setHours(23, 59, 59, 999);
      filter.toDate = date.toISOString();
    }
    if (medicationId) {
      filter.medicationId = medicationId;
    }
    
    onApply(filter);
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setMedicationId('');
    onReset();
  };

  return (
    <div className={styles.filter}>
      <div className={styles.fields}>
        <Input
          label="От"
          type="date"
          value={fromDate}
          onChange={setFromDate}
        />
        
        <Input
          label="До"
          type="date"
          value={toDate}
          onChange={setToDate}
        />
        
        <Select
          label="Лекарство"
          options={medicationOptions}
          value={medicationId}
          onChange={setMedicationId}
        />
      </div>
      
      <div className={styles.actions}>
        <Button variant="secondary" size="small" onClick={handleReset}>
          Сбросить
        </Button>
        <Button variant="primary" size="small" onClick={handleApply}>
          Применить
        </Button>
      </div>
    </div>
  );
});

