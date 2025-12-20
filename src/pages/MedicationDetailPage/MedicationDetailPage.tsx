import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { MedicationForm } from "../../components/medications";
import { IntakeForm, IntakeCard } from "../../components/intakes";
import {
  Button,
  Card,
  Modal,
  ConfirmDialog,
  ErrorMessage,
  Skeleton,
} from "../../components/common";
import { UpdateMedicationDto } from "../../types/medication.types";
import { CreateIntakeDto, MedicationIntake } from "../../types/intake.types";
import { formatDate } from "../../utils/formatDate";
import styles from "./MedicationDetailPage.module.css";

export const MedicationDetailPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { medicationStore, intakeStore, uiStore } = useStores();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [editingIntake, setEditingIntake] = useState<MedicationIntake | null>(
    null
  );
  const [deletingIntake, setDeletingIntake] = useState<MedicationIntake | null>(
    null
  );

  useEffect(() => {
    if (id) {
      medicationStore.fetchMedicationById(id);
      intakeStore.fetchIntakes({ medicationId: id });
    }
  }, [id, medicationStore, intakeStore]);

  const medication = medicationStore.selectedMedication;
  const medicationIntakes = intakeStore.sortedIntakes.filter(
    (intake) => intake.medicationId === id
  );

  const handleUpdate = async (data: UpdateMedicationDto) => {
    if (!id) return;

    const success = await medicationStore.updateMedication(id, data);
    if (success) {
      uiStore.showToast("success", "Лекарство обновлено");
      setShowEditModal(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const success = await medicationStore.deleteMedication(id);
    if (success) {
      uiStore.showToast("success", "Лекарство удалено");
      navigate("/medications");
    }
  };

  const handleCreateIntake = async (data: CreateIntakeDto) => {
    const result = await intakeStore.createIntake(data);
    if (result) {
      uiStore.showToast("success", "Прием зарегистрирован");
      setShowIntakeModal(false);
    }
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

  if (medicationStore.isLoading && !medication) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Skeleton width={80} height={36} />
        </header>

        <Card className={styles.mainCard}>
          <div className={styles.medicationHeader}>
            <Skeleton variant="circular" width={32} height={32} />
            <div className={styles.medicationInfo}>
              <Skeleton
                width={200}
                height={32}
                style={{ marginBottom: "0.5rem" }}
              />
              <Skeleton width={120} height={20} />
            </div>
          </div>
          <Skeleton width="80%" height={16} style={{ margin: "1rem 0" }} />
          <Skeleton width="40%" height={14} />
          <div className={styles.actions} style={{ marginTop: "1.5rem" }}>
            <Skeleton width="100%" height={48} />
            <div className={styles.secondaryActions}>
              <Skeleton width={120} height={40} />
              <Skeleton width={100} height={40} />
            </div>
          </div>
        </Card>

        <section className={styles.historySection}>
          <Skeleton width={180} height={28} style={{ marginBottom: "1rem" }} />
          <div className={styles.intakesList}>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div style={{ padding: "1rem" }}>
                  <Skeleton
                    width="60%"
                    height={20}
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <Skeleton width="30%" height={16} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (medicationStore.error) {
    return (
      <ErrorMessage
        message={medicationStore.error}
        onRetry={() => id && medicationStore.fetchMedicationById(id)}
      />
    );
  }

  if (!medication) {
    return <ErrorMessage message="Лекарство не найдено" />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/medications")}
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
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Назад
        </button>
      </header>

      <Card className={styles.mainCard}>
        <div className={styles.medicationHeader}>
          <div className={styles.medicationIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
              <path d="m8.5 8.5 7 7" />
            </svg>
          </div>
          <div className={styles.medicationInfo}>
            <h1 className={styles.medicationName}>{medication.name}</h1>
            {medication.dosage && (
              <p className={styles.dosage}>{medication.dosage}</p>
            )}
          </div>
        </div>

        {medication.description && (
          <p className={styles.description}>{medication.description}</p>
        )}

        <div className={styles.meta}>
          <span>Добавлено: {formatDate(medication.createdAt)}</span>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={() => setShowIntakeModal(true)}
            icon={
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
          >
            Принял лекарство
          </Button>
          <div className={styles.secondaryActions}>
            <Button variant="secondary" onClick={() => setShowEditModal(true)}>
              Редактировать
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
              Удалить
            </Button>
          </div>
        </div>
      </Card>

      <section className={styles.historySection}>
        <h2 className={styles.sectionTitle}>История приемов</h2>
        {intakeStore.isLoading ? (
          <div className={styles.intakesList}>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div style={{ padding: "1rem" }}>
                  <Skeleton
                    width="60%"
                    height={20}
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <Skeleton width="30%" height={16} />
                </div>
              </Card>
            ))}
          </div>
        ) : medicationIntakes.length === 0 ? (
          <p className={styles.emptyHistory}>
            Нет записей о приеме этого лекарства
          </p>
        ) : (
          <div className={styles.intakesList}>
            {medicationIntakes.slice(0, 10).map((intake) => (
              <IntakeCard
                key={intake.id}
                intake={intake}
                onEdit={setEditingIntake}
                onDelete={setDeletingIntake}
                showDate
              />
            ))}
          </div>
        )}
      </section>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Редактирование"
      >
        <MedicationForm
          medication={medication}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
          isLoading={medicationStore.isLoading}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Удалить лекарство?"
        message={`Лекарство «${medication.name}» будет удалено. Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={medicationStore.isLoading}
      />

      {/* Intake Modal */}
      <Modal
        isOpen={showIntakeModal}
        onClose={() => setShowIntakeModal(false)}
        title={`Прием: ${medication.name}`}
      >
        <IntakeForm
          preselectedMedicationId={medication.id}
          onSubmit={handleCreateIntake}
          onCancel={() => setShowIntakeModal(false)}
          isLoading={intakeStore.isLoading}
        />
      </Modal>

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
