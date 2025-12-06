import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useStores } from '../../../hooks/useStores';
import { Card } from '../../common';
import styles from './MedicationSummary.module.css';

export const MedicationSummary: React.FC = observer(() => {
  const { medicationStore } = useStores();
  const count = medicationStore.medications.length;

  return (
    <Card>
      <div className={styles.content}>
        <div className={styles.icon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
            <path d="m8.5 8.5 7 7"/>
          </svg>
        </div>
        <div className={styles.info}>
          <span className={styles.count}>{count}</span>
          <span className={styles.label}>
            {count === 1 ? 'лекарство' : count >= 2 && count <= 4 ? 'лекарства' : 'лекарств'}
          </span>
        </div>
        <Link to="/medications" className={styles.link}>
          Все лекарства →
        </Link>
      </div>
    </Card>
  );
});

