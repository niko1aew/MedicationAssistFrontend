import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useStores } from '../../../hooks/useStores';
import { Card } from '../../common';
import { formatTime } from '../../../utils/formatDate';
import styles from './TodayIntakes.module.css';

export const TodayIntakes: React.FC = observer(() => {
  const { intakeStore } = useStores();
  const todayIntakes = intakeStore.todayIntakes;

  return (
    <Card
      title="Приемы сегодня"
      subtitle={todayIntakes.length > 0 ? `${todayIntakes.length} записей` : undefined}
      actions={
        <Link to="/intakes" className={styles.link}>
          Вся история →
        </Link>
      }
    >
      {todayIntakes.length === 0 ? (
        <p className={styles.empty}>Сегодня приемов не было</p>
      ) : (
        <ul className={styles.list}>
          {todayIntakes.slice(0, 5).map((intake) => (
            <li key={intake.id} className={styles.item}>
              <span className={styles.icon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span className={styles.name}>{intake.medicationName}</span>
              <span className={styles.time}>{formatTime(intake.intakeTime)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
});

