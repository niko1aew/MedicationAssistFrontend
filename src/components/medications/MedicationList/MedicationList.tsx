import React from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../hooks/useStores";
import { Medication } from "../../../types/medication.types";
import { Reminder } from "../../../types/reminder.types";
import { MedicationCard } from "../MedicationCard";
import { EmptyState, Loader, ErrorMessage } from "../../common";
import styles from "./MedicationList.module.css";

interface MedicationListProps {
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
  onTakeIntake: (medication: Medication) => void;
  onSetReminder: (medication: Medication) => void;
  onDeleteReminder: (reminder: Reminder) => void;
  onAdd: () => void;
}

export const MedicationList: React.FC<MedicationListProps> = observer(
  ({
    onEdit,
    onDelete,
    onTakeIntake,
    onSetReminder,
    onDeleteReminder,
    onAdd,
  }) => {
    const { medicationStore, reminderStore } = useStores();

    if (medicationStore.isLoading && medicationStore.medications.length === 0) {
      return <Loader text="Загрузка лекарств..." />;
    }

    if (medicationStore.error) {
      return (
        <ErrorMessage
          message={medicationStore.error}
          onRetry={() => medicationStore.fetchMedications()}
        />
      );
    }

    if (medicationStore.medications.length === 0) {
      return (
        <EmptyState
          icon={
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.5"
            >
              <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
              <path d="m8.5 8.5 7 7" />
            </svg>
          }
          title="У вас пока нет лекарств"
          description="Добавьте первое лекарство, чтобы начать отслеживать приемы"
          action={{
            label: "Добавить лекарство",
            onClick: onAdd,
          }}
        />
      );
    }

    return (
      <div className={styles.list}>
        {medicationStore.sortedMedications.map((medication) => {
          const reminders = reminderStore.getRemindersForMedication(
            medication.id
          );
          return (
            <MedicationCard
              key={medication.id}
              medication={medication}
              reminders={reminders}
              onEdit={onEdit}
              onDelete={onDelete}
              onTakeIntake={onTakeIntake}
              onSetReminder={onSetReminder}
              onDeleteReminder={onDeleteReminder}
            />
          );
        })}
      </div>
    );
  }
);
