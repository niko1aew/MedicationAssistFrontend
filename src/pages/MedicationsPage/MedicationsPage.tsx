import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import { MedicationList, MedicationForm } from "../../components/medications";
import { IntakeForm } from "../../components/intakes";
import { ReminderForm } from "../../components/reminders";
import {
  Button,
  Modal,
  ConfirmDialog,
  TelegramLinkModal,
} from "../../components/common";
import {
  Medication,
  CreateMedicationDto,
  UpdateMedicationDto,
} from "../../types/medication.types";
import { CreateIntakeDto } from "../../types/intake.types";
import { Reminder, CreateReminderDto } from "../../types/reminder.types";
import styles from "./MedicationsPage.module.css";

export const MedicationsPage: React.FC = observer(() => {
  const { medicationStore, intakeStore, reminderStore, uiStore, authStore } =
    useStores();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(
    null
  );
  const [deletingMedication, setDeletingMedication] =
    useState<Medication | null>(null);
  const [intakeMedication, setIntakeMedication] = useState<Medication | null>(
    null
  );
  const [reminderMedication, setReminderMedication] =
    useState<Medication | null>(null);
  const [deletingReminder, setDeletingReminder] = useState<Reminder | null>(
    null
  );
  const [showTelegramLinkModal, setShowTelegramLinkModal] = useState(false);

  useEffect(() => {
    medicationStore.fetchMedications();
    if (authStore.userId) {
      reminderStore.loadReminders(authStore.userId);
    }
  }, [medicationStore, reminderStore, authStore.userId]);

  const handleCreate = async (data: CreateMedicationDto) => {
    const result = await medicationStore.createMedication(data);
    if (result) {
      uiStore.showToast("success", "Лекарство добавлено");
      setShowCreateModal(false);
    }
  };

  const handleUpdate = async (data: UpdateMedicationDto) => {
    if (!editingMedication) return;

    const success = await medicationStore.updateMedication(
      editingMedication.id,
      data
    );
    if (success) {
      uiStore.showToast("success", "Лекарство обновлено");
      setEditingMedication(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingMedication) return;

    const success = await medicationStore.deleteMedication(
      deletingMedication.id
    );
    if (success) {
      uiStore.showToast("success", "Лекарство удалено");
      setDeletingMedication(null);
    }
  };

  const handleIntake = async (data: CreateIntakeDto) => {
    const result = await intakeStore.createIntake(data);
    if (result) {
      uiStore.showToast("success", "Прием зарегистрирован");
      setIntakeMedication(null);
    }
  };

  const handleReminderClick = (medication: Medication) => {
    // Проверяем, привязан ли Telegram к аккаунту
    if (!authStore.user?.telegramUserId) {
      setShowTelegramLinkModal(true);
      return;
    }

    // Если Telegram привязан, открываем форму напоминания
    setReminderMedication(medication);
  };

  const handleSetReminder = async (data: CreateReminderDto) => {
    if (
      !reminderMedication ||
      !authStore.userId ||
      !authStore.user?.telegramUserId
    )
      return;

    const reminderData: CreateReminderDto = {
      ...data,
      medicationId: reminderMedication.id,
      telegramUserId: authStore.user.telegramUserId,
    };

    const success = await reminderStore.createReminder(
      authStore.userId,
      reminderData
    );
    if (success) {
      uiStore.showToast("success", "Напоминание установлено");
      setReminderMedication(null);
    } else {
      uiStore.showToast(
        "error",
        reminderStore.error || "Ошибка установки напоминания"
      );
    }
  };

  const handleDeleteReminder = async () => {
    if (!deletingReminder || !authStore.userId) return;

    const success = await reminderStore.deleteReminder(
      authStore.userId,
      deletingReminder.id
    );
    if (success) {
      uiStore.showToast("success", "Напоминание удалено");
      setDeletingReminder(null);
    } else {
      uiStore.showToast(
        "error",
        reminderStore.error || "Ошибка удаления напоминания"
      );
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Мои лекарства</h1>
          <p className={styles.subtitle}>Управление списком лекарств</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
        >
          Добавить
        </Button>
      </header>

      <MedicationList
        onEdit={setEditingMedication}
        onDelete={setDeletingMedication}
        onTakeIntake={setIntakeMedication}
        onSetReminder={handleReminderClick}
        onDeleteReminder={setDeletingReminder}
        onAdd={() => setShowCreateModal(true)}
      />

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Новое лекарство"
      >
        <MedicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={medicationStore.isLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingMedication}
        onClose={() => setEditingMedication(null)}
        title="Редактирование"
      >
        {editingMedication && (
          <MedicationForm
            medication={editingMedication}
            onSubmit={handleUpdate}
            onCancel={() => setEditingMedication(null)}
            isLoading={medicationStore.isLoading}
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingMedication}
        title="Удалить лекарство?"
        message={`Лекарство «${deletingMedication?.name}» будет удалено. Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeletingMedication(null)}
        isLoading={medicationStore.isLoading}
      />

      {/* Intake Modal */}
      <Modal
        isOpen={!!intakeMedication}
        onClose={() => setIntakeMedication(null)}
        title={`Прием: ${intakeMedication?.name}`}
      >
        {intakeMedication && (
          <IntakeForm
            preselectedMedicationId={intakeMedication.id}
            onSubmit={handleIntake}
            onCancel={() => setIntakeMedication(null)}
            isLoading={intakeStore.isLoading}
          />
        )}
      </Modal>

      {/* Reminder Modal */}
      <Modal
        isOpen={!!reminderMedication}
        onClose={() => setReminderMedication(null)}
        title="Установить напоминание"
      >
        {reminderMedication && (
          <ReminderForm
            medicationName={reminderMedication.name}
            onSubmit={handleSetReminder}
            onCancel={() => setReminderMedication(null)}
            isLoading={reminderStore.isLoading}
            telegramUserId={authStore.user?.telegramUserId || 0}
          />
        )}
      </Modal>

      {/* Delete Reminder Confirm */}
      <ConfirmDialog
        isOpen={!!deletingReminder}
        title="Удалить напоминание?"
        message={`Напоминание о приеме «${deletingReminder?.medicationName}» в ${deletingReminder?.time} будет удалено.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
        onConfirm={handleDeleteReminder}
        onCancel={() => setDeletingReminder(null)}
        isLoading={reminderStore.isLoading}
      />

      {/* Telegram Link Modal */}
      <TelegramLinkModal
        isOpen={showTelegramLinkModal}
        onClose={() => setShowTelegramLinkModal(false)}
      />
    </div>
  );
});
