import React from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../hooks/useStores";
import { Medication } from "../../../types/medication.types";
import { Reminder } from "../../../types/reminder.types";
import { MedicationCard } from "../MedicationCard";
import { EmptyState, ErrorMessage, Skeleton, Card, Input } from "../../common";
import styles from "./MedicationList.module.css";

interface MedicationListProps {
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
  onTakeIntake: (medication: Medication) => void;
  onSetReminder: (medication: Medication) => void;
  onDeleteReminder: (reminder: Reminder) => void;
  onAdd: () => void;
}

const MedicationSkeleton: React.FC = () => (
  <Card>
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Skeleton variant="circular" width={48} height={48} />
        <div style={{ flex: 1 }}>
          <Skeleton
            width="60%"
            height={24}
            style={{ marginBottom: "0.5rem" }}
          />
          <Skeleton width="40%" height={16} />
        </div>
      </div>
      <Skeleton width="80%" height={16} style={{ marginBottom: "1rem" }} />
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <Skeleton width={100} height={36} />
        <Skeleton width={100} height={36} />
        <Skeleton width={100} height={36} />
      </div>
    </div>
  </Card>
);

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

    const handleSearchChange = (value: string) => {
      medicationStore.setSearchQuery(value);
    };

    const handleClearSearch = () => {
      medicationStore.setSearchQuery("");
    };

    const searchInput = (
      <div className={styles.searchContainer}>
        <Input
          placeholder="Поиск по названию..."
          value={medicationStore.searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        {medicationStore.searchQuery && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearSearch}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>
    );

    if (medicationStore.isLoading && medicationStore.medications.length === 0) {
      return (
        <div className={styles.list}>
          {[1, 2, 3].map((i) => (
            <MedicationSkeleton key={i} />
          ))}
        </div>
      );
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

    if (
      medicationStore.searchQuery &&
      medicationStore.filteredMedications.length === 0
    ) {
      return (
        <>
          {searchInput}
          <EmptyState
            title="Ничего не найдено"
            description={`По запросу "${medicationStore.searchQuery}" лекарства не найдены`}
          />
        </>
      );
    }

    return (
      <>
        {searchInput}
        <div className={styles.list}>
          {medicationStore.filteredMedications.map((medication) => {
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
      </>
    );
  }
);
