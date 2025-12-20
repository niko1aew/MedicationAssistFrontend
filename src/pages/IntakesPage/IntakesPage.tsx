import React, { useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { useRefreshOnVisible } from "../../hooks/useRefreshOnVisible";
import { IntakeList, IntakeFilter, IntakeForm } from "../../components/intakes";
import { Modal, ConfirmDialog } from "../../components/common";
import {
  MedicationIntake,
  IntakeFilter as IntakeFilterType,
  CreateIntakeDto,
} from "../../types/intake.types";
import styles from "./IntakesPage.module.css";

export const IntakesPage: React.FC = observer(() => {
  const { medicationStore, intakeStore, uiStore } = useStores();

  const [showFilter, setShowFilter] = useState(false);
  const [editingIntake, setEditingIntake] = useState<MedicationIntake | null>(
    null
  );
  const [deletingIntake, setDeletingIntake] = useState<MedicationIntake | null>(
    null
  );

  // Initial data fetch
  useEffect(() => {
    medicationStore.fetchMedications();
    intakeStore.fetchIntakes();
  }, [medicationStore, intakeStore]);

  // Auto-refresh when tab becomes visible
  const handleRefresh = useCallback(() => {
    medicationStore.fetchMedications();
    intakeStore.fetchIntakes(intakeStore.filter);
  }, [medicationStore, intakeStore]);

  useRefreshOnVisible({
    onRefresh: handleRefresh,
    refreshThreshold: 30000, // 30 seconds
  });

  const handleApplyFilter = (filter: IntakeFilterType) => {
    intakeStore.setFilter(filter);
    intakeStore.fetchIntakes(filter);
    setShowFilter(false);
  };

  const handleResetFilter = () => {
    intakeStore.clearFilter();
    intakeStore.fetchIntakes();
  };

  const handleUpdateIntake = async (data: CreateIntakeDto) => {
    if (!editingIntake) return;

    const success = await intakeStore.updateIntake(editingIntake.id, {
      intakeTime: data.intakeTime || new Date().toISOString(),
      notes: data.notes,
    });
    if (success) {
      uiStore.showToast("success", "Запись обновлена");
      setEditingIntake(null);
    }
  };

  const handleDeleteIntake = async () => {
    if (!deletingIntake) return;

    const success = await intakeStore.deleteIntake(deletingIntake.id);
    if (success) {
      uiStore.showToast("success", "Запись удалена");
      setDeletingIntake(null);
    }
  };

  const hasActiveFilter = Object.keys(intakeStore.filter).length > 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>История приемов</h1>
          <p className={styles.subtitle}>Все записи о приеме лекарств</p>
        </div>
        <button
          className={`${styles.filterButton} ${
            hasActiveFilter ? styles.filterActive : ""
          }`}
          onClick={() => setShowFilter(!showFilter)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Фильтры
          {hasActiveFilter && <span className={styles.filterBadge}></span>}
        </button>
      </header>

      {showFilter && (
        <IntakeFilter onApply={handleApplyFilter} onReset={handleResetFilter} />
      )}

      <IntakeList onEdit={setEditingIntake} onDelete={setDeletingIntake} />

      {/* Edit Intake Modal */}
      <Modal
        isOpen={!!editingIntake}
        onClose={() => setEditingIntake(null)}
        title="Редактирование записи"
      >
        {editingIntake && (
          <IntakeForm
            intake={editingIntake}
            onSubmit={handleUpdateIntake}
            onCancel={() => setEditingIntake(null)}
            isLoading={intakeStore.isLoading}
          />
        )}
      </Modal>

      {/* Delete Intake Confirm */}
      <ConfirmDialog
        isOpen={!!deletingIntake}
        title="Удалить запись?"
        message="Запись о приеме будет удалена. Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
        onConfirm={handleDeleteIntake}
        onCancel={() => setDeletingIntake(null)}
        isLoading={intakeStore.isLoading}
      />
    </div>
  );
});
