import React from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { useStores } from "../../../hooks/useStores";
import { Card, Skeleton } from "../../common";
import { formatRelativeDate } from "../../../utils/formatDate";
import styles from "./RecentActivity.module.css";

export const RecentActivity: React.FC = observer(() => {
  const { intakeStore } = useStores();
  const recentIntakes = intakeStore.sortedIntakes.slice(0, 5);

  const renderSkeleton = () => (
    <ul className={styles.list}>
      {[1, 2, 3, 4, 5].map((i) => (
        <li key={i} className={styles.item}>
          <Skeleton variant="circular" width={8} height={8} />
          <div className={styles.content}>
            <Skeleton width="60%" height={16} />
            <Skeleton width={80} height={14} />
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <Card
      title="Последняя активность"
      actions={
        <Link to="/intakes" className={styles.link}>
          Вся история →
        </Link>
      }
    >
      {intakeStore.isLoading ? (
        renderSkeleton()
      ) : recentIntakes.length === 0 ? (
        <p className={styles.empty}>Нет записей</p>
      ) : (
        <ul className={styles.list}>
          {recentIntakes.map((intake) => (
            <li key={intake.id} className={styles.item}>
              <div className={styles.dot}></div>
              <div className={styles.content}>
                <span className={styles.name}>{intake.medicationName}</span>
                <span className={styles.time}>
                  {formatRelativeDate(intake.intakeTime)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
});
