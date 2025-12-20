import React from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../hooks/useStores";
import { MedicationIntake } from "../../../types/intake.types";
import { IntakeCard } from "../IntakeCard";
import { EmptyState, ErrorMessage, Skeleton, Card } from "../../common";
import styles from "./IntakeList.module.css";

interface IntakeListProps {
  onEdit: (intake: MedicationIntake) => void;
  onDelete: (intake: MedicationIntake) => void;
}

const IntakeSkeleton: React.FC = () => (
  <Card>
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
        }}
      >
        <Skeleton width="50%" height={20} />
        <Skeleton width={60} height={18} />
      </div>
      <Skeleton width="30%" height={16} />
    </div>
  </Card>
);

export const IntakeList: React.FC<IntakeListProps> = observer(
  ({ onEdit, onDelete }) => {
    const { intakeStore } = useStores();

    if (intakeStore.isLoading && intakeStore.intakes.length === 0) {
      return (
        <div className={styles.list}>
          {[1, 2].map((groupIdx) => (
            <div key={groupIdx} className={styles.group}>
              <Skeleton
                width={150}
                height={24}
                style={{ marginBottom: "1rem" }}
              />
              <div className={styles.intakes}>
                {[1, 2, 3].map((i) => (
                  <IntakeSkeleton key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (intakeStore.error) {
      return (
        <ErrorMessage
          message={intakeStore.error}
          onRetry={() => intakeStore.fetchIntakes()}
        />
      );
    }

    if (intakeStore.intakes.length === 0) {
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
          title="Нет записей о приеме"
          description="История приема лекарств пуста. Записи появятся здесь после регистрации приема."
        />
      );
    }

    return (
      <div className={styles.list}>
        {Array.from(intakeStore.intakesGroupedByDate.entries()).map(
          ([date, intakes]) => (
            <div key={date} className={styles.group}>
              <h3 className={styles.date}>{date}</h3>
              <div className={styles.intakes}>
                {intakes.map((intake) => (
                  <IntakeCard
                    key={intake.id}
                    intake={intake}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>
    );
  }
);
