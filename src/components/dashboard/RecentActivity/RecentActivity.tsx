import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useStores } from '../../../hooks/useStores';
import { Card } from '../../common';
import { formatRelativeDate } from '../../../utils/formatDate';
import styles from './RecentActivity.module.css';

export const RecentActivity: React.FC = observer(() => {
  const { intakeStore } = useStores();
  const recentIntakes = intakeStore.sortedIntakes.slice(0, 5);

  return (
    <Card
      title="Последняя активность"
      actions={
        <Link to="/intakes" className={styles.link}>
          Вся история →
        </Link>
      }
    >
      {recentIntakes.length === 0 ? (
        <p className={styles.empty}>Нет записей</p>
      ) : (
        <ul className={styles.list}>
          {recentIntakes.map((intake) => (
            <li key={intake.id} className={styles.item}>
              <div className={styles.dot}></div>
              <div className={styles.content}>
                <span className={styles.name}>{intake.medicationName}</span>
                <span className={styles.time}>{formatRelativeDate(intake.intakeTime)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
});

