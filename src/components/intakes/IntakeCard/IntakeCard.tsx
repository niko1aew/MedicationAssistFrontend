import React from "react";
import { MedicationIntake } from "../../../types/intake.types";
import { formatRelativeDate } from "../../../utils/formatDate";
import { formatTimeInTimeZone } from "../../../utils/timezone";
import { useStores } from "../../../hooks/useStores";
import styles from "./IntakeCard.module.css";

interface IntakeCardProps {
  intake: MedicationIntake;
  onEdit: (intake: MedicationIntake) => void;
  onDelete: (intake: MedicationIntake) => void;
  showDate?: boolean;
}

export const IntakeCard: React.FC<IntakeCardProps> = React.memo(
  ({ intake, onEdit, onDelete, showDate = false }) => {
    const { authStore } = useStores();
    const userTimeZone = authStore.user?.timeZoneId || "Europe/Moscow";

    return (
      <div className={styles.card}>
        <div className={styles.icon}>
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
        </div>

        <div className={styles.content}>
          <h4 className={styles.name}>{intake.medicationName}</h4>
          <p className={styles.time}>
            {showDate
              ? formatRelativeDate(intake.intakeTime)
              : formatTimeInTimeZone(intake.intakeTime, userTimeZone)}
          </p>
          {intake.notes && <p className={styles.notes}>{intake.notes}</p>}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={() => onEdit(intake)}
            aria-label="Редактировать"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className={styles.actionButton}
            onClick={() => onDelete(intake)}
            aria-label="Удалить"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);
