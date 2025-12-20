import React from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { useStores } from "../../../hooks/useStores";
import { Card, Skeleton } from "../../common";
import { formatTimeInTimeZone } from "../../../utils/timezone";
import styles from "./TodayIntakes.module.css";

export const TodayIntakes: React.FC = observer(() => {
  const { intakeStore, authStore } = useStores();
  const todayIntakes = intakeStore.todayIntakes;
  const userTimeZone = authStore.user?.timeZoneId || "Europe/Moscow";

  const renderSkeleton = () => (
    <ul className={styles.list}>
      {[1, 2, 3].map((i) => (
        <li key={i} className={styles.item}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton width="40%" height={16} />
          <Skeleton width={60} height={16} />
        </li>
      ))}
    </ul>
  );

  return (
    <Card
      title="Приемы сегодня"
      subtitle={
        todayIntakes.length > 0 ? `${todayIntakes.length} записей` : undefined
      }
      actions={
        <Link to="/intakes" className={styles.link}>
          Вся история →
        </Link>
      }
    >
      {intakeStore.isLoading ? (
        renderSkeleton()
      ) : todayIntakes.length === 0 ? (
        <p className={styles.empty}>Сегодня приемов не было</p>
      ) : (
        <ul className={styles.list}>
          {todayIntakes.slice(0, 5).map((intake) => (
            <li key={intake.id} className={styles.item}>
              <span className={styles.icon}>
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
              </span>
              <span className={styles.name}>{intake.medicationName}</span>
              <span className={styles.time}>
                {formatTimeInTimeZone(intake.intakeTime, userTimeZone)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
});
