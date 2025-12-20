// components/common/UpdateNotification/UpdateNotification.tsx

import { observer } from "mobx-react-lite";
import { useStores } from "../../../hooks/useStores";
import styles from "./UpdateNotification.module.css";

export const UpdateNotification = observer(() => {
  const { versionStore } = useStores();

  if (!versionStore.updateAvailable) {
    return null;
  }

  const handleUpdate = () => {
    versionStore.reloadApp();
  };

  const handleDismiss = () => {
    versionStore.dismissUpdate();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.notification}>
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>Доступно обновление</h3>
          <p className={styles.message}>
            Установлена новая версия приложения. Обновите страницу, чтобы
            получить последние улучшения и исправления.
          </p>
          {versionStore.latestVersion && (
            <p className={styles.version}>
              Версия: {versionStore.latestVersion}
            </p>
          )}
        </div>
        <div className={styles.actions}>
          <button
            className={styles.dismissButton}
            onClick={handleDismiss}
            type="button"
          >
            Позже
          </button>
          <button
            className={styles.updateButton}
            onClick={handleUpdate}
            type="button"
          >
            Обновить
          </button>
        </div>
      </div>
    </div>
  );
});

UpdateNotification.displayName = "UpdateNotification";
