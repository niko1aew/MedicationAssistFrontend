import React from "react";
import { useNavigate } from "react-router-dom";
import { Medication } from "../../../types/medication.types";
import { Reminder } from "../../../types/reminder.types";
import { Button } from "../../common";
import styles from "./MedicationCard.module.css";

interface MedicationCardProps {
  medication: Medication;
  reminders: Reminder[];
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
  onTakeIntake: (medication: Medication) => void;
  onSetReminder: (medication: Medication) => void;
  onDeleteReminder: (reminder: Reminder) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = React.memo(
  ({
    medication,
    reminders,
    onEdit,
    onDelete,
    onTakeIntake,
    onSetReminder,
    onDeleteReminder,
  }) => {
    const navigate = useNavigate();

    return (
      <div className={styles.card}>
        {/* Mobile top-right actions (edit/delete) */}
        <div className={styles.topRightActions}>
          <button
            className={styles.topActionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(medication);
            }}
            title="Изменить"
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
            className={`${styles.topActionBtn} ${styles.topActionDanger}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(medication);
            }}
            title="Удалить"
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

        <div
          className={styles.content}
          onClick={() => navigate(`/medications/${medication.id}`)}
        >
          <div className={styles.mainInfo}>
            <div className={styles.icon}>
              <svg
                width="24"
                height="24"
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
            <div className={styles.info}>
              <h3 className={styles.name}>{medication.name}</h3>
              {medication.dosage && (
                <p className={styles.dosage}>{medication.dosage}</p>
              )}
              {medication.description && (
                <p className={styles.description}>{medication.description}</p>
              )}
            </div>
          </div>

          {/* Mobile reminders - right side */}
          {reminders.length > 0 && (
            <div className={styles.mobileRemindersSection}>
              {reminders.map((reminder) => (
                <div key={reminder.id} className={styles.mobileReminderItem}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{reminder.time}</span>
                  <button
                    className={styles.mobileReminderDeleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReminder(reminder);
                    }}
                    title="Удалить напоминание"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Mobile action icons */}
          <div className={styles.mobileActions}>
            <button
              className={`${styles.mobileActionBtn} ${styles.mobileActionPrimary}`}
              onClick={(e) => {
                e.stopPropagation();
                onTakeIntake(medication);
              }}
              title="Принять"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Принять</span>
            </button>
            <button
              className={styles.mobileActionBtn}
              onClick={(e) => {
                e.stopPropagation();
                onSetReminder(medication);
              }}
              title="Добавить напоминание"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Напоминание</span>
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onTakeIntake(medication);
            }}
            icon={
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
          >
            Принять
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onSetReminder(medication);
            }}
            icon={
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          >
            Добавить напоминание
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(medication);
            }}
            icon={
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
            }
          >
            Изменить
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(medication);
            }}
            icon={
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
            }
          >
            Удалить
          </Button>
        </div>
      </div>
    );
  }
);
