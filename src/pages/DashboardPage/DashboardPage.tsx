import React, { useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { useRefreshOnVisible } from "../../hooks/useRefreshOnVisible";
import {
  TodayIntakes,
  MedicationSummary,
  RecentActivity,
} from "../../components/dashboard";
import { QuickIntakeButton, IntakeForm } from "../../components/intakes";
import { Modal, Loader, Select } from "../../components/common";
import { CreateIntakeDto } from "../../types/intake.types";
import styles from "./DashboardPage.module.css";

export const DashboardPage: React.FC = observer(() => {
  const { authStore, medicationStore, intakeStore, uiStore } = useStores();
  const [showQuickIntake, setShowQuickIntake] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState("");
  const [isQuickMode, setIsQuickMode] = useState(true);

  // Initial data fetch
  useEffect(() => {
    medicationStore.fetchMedications();
    intakeStore.fetchIntakes();
  }, [medicationStore, intakeStore]);

  // Auto-refresh when tab becomes visible
  const handleRefresh = useCallback(() => {
    medicationStore.fetchMedications();
    intakeStore.fetchIntakes();
  }, [medicationStore, intakeStore]);

  useRefreshOnVisible({
    onRefresh: handleRefresh,
    refreshThreshold: 30000, // 30 seconds
  });

  const handleQuickIntake = async () => {
    if (!selectedMedication) return;

    const result = await intakeStore.quickIntake(selectedMedication);
    if (result) {
      uiStore.showToast("success", "Прием зарегистрирован");
      setShowQuickIntake(false);
      setSelectedMedication("");
    }
  };

  const handleFullIntakeSubmit = async (data: CreateIntakeDto) => {
    const result = await intakeStore.createIntake(data as CreateIntakeDto);
    if (result) {
      uiStore.showToast("success", "Прием зарегистрирован");
      setShowQuickIntake(false);
    }
  };

  const medicationOptions = medicationStore.sortedMedications.map((med) => ({
    value: med.id,
    label: med.name,
  }));

  if (!authStore.isInitialized) {
    return <Loader fullScreen />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>
          Здравствуйте, {authStore.user?.name}!
        </h1>
        <p className={styles.subtitle}>
          {new Date().toLocaleDateString("ru-RU", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      <section className={styles.quickAction}>
        <QuickIntakeButton onClick={() => setShowQuickIntake(true)} />
      </section>

      <section className={styles.grid}>
        <div className={styles.mainColumn}>
          <TodayIntakes />
        </div>
        <div className={styles.sideColumn}>
          <MedicationSummary />
          <RecentActivity />
        </div>
      </section>

      <Modal
        isOpen={showQuickIntake}
        onClose={() => {
          setShowQuickIntake(false);
          setSelectedMedication("");
          setIsQuickMode(true);
        }}
        title="Записать прием"
        size="small"
      >
        {isQuickMode ? (
          <div className={styles.quickIntakeModal}>
            <Select
              label="Выберите лекарство"
              options={medicationOptions}
              value={selectedMedication}
              onChange={setSelectedMedication}
              placeholder="Выберите..."
            />
            <div className={styles.quickIntakeActions}>
              <button
                className={styles.detailsLink}
                onClick={() => setIsQuickMode(false)}
              >
                Указать время и примечания
              </button>
              <button
                className={styles.quickSubmit}
                onClick={handleQuickIntake}
                disabled={!selectedMedication || intakeStore.isLoading}
              >
                {intakeStore.isLoading ? "Сохранение..." : "Записать сейчас"}
              </button>
            </div>
          </div>
        ) : (
          <IntakeForm
            onSubmit={handleFullIntakeSubmit}
            onCancel={() => setIsQuickMode(true)}
            isLoading={intakeStore.isLoading}
          />
        )}
      </Modal>
    </div>
  );
});
