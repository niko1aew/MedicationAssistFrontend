import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks/useStores';
import { MedicationList, MedicationForm } from '../../components/medications';
import { IntakeForm } from '../../components/intakes';
import { Button, Modal, ConfirmDialog } from '../../components/common';
import { Medication, CreateMedicationDto, UpdateMedicationDto } from '../../types/medication.types';
import { CreateIntakeDto } from '../../types/intake.types';
import styles from './MedicationsPage.module.css';

export const MedicationsPage: React.FC = observer(() => {
  const { medicationStore, intakeStore, uiStore } = useStores();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [deletingMedication, setDeletingMedication] = useState<Medication | null>(null);
  const [intakeMedication, setIntakeMedication] = useState<Medication | null>(null);

  useEffect(() => {
    medicationStore.fetchMedications();
  }, [medicationStore]);

  const handleCreate = async (data: CreateMedicationDto) => {
    const result = await medicationStore.createMedication(data);
    if (result) {
      uiStore.showToast('success', 'Лекарство добавлено');
      setShowCreateModal(false);
    }
  };

  const handleUpdate = async (data: UpdateMedicationDto) => {
    if (!editingMedication) return;
    
    const success = await medicationStore.updateMedication(editingMedication.id, data);
    if (success) {
      uiStore.showToast('success', 'Лекарство обновлено');
      setEditingMedication(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingMedication) return;
    
    const success = await medicationStore.deleteMedication(deletingMedication.id);
    if (success) {
      uiStore.showToast('success', 'Лекарство удалено');
      setDeletingMedication(null);
    }
  };

  const handleIntake = async (data: CreateIntakeDto) => {
    const result = await intakeStore.createIntake(data);
    if (result) {
      uiStore.showToast('success', 'Прием зарегистрирован');
      setIntakeMedication(null);
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
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
    </div>
  );
});

