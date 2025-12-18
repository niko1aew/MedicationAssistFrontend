import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../hooks/useStores";
import { ThemeToggle } from "../../common";
import styles from "./Header.module.css";

export const Header: React.FC = observer(() => {
  const { authStore, uiStore } = useStores();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.menuButton}
          onClick={() => uiStore.toggleMobileMenu()}
          aria-label="Меню"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link to="/" className={styles.logo}>
          <svg
            className={styles.logoIcon}
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="m8.5 8.5 7 7" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className={styles.logoText}>MedicationAssist</span>
        </Link>
      </div>

      <div className={styles.right}>
        <ThemeToggle />
        <Link to="/profile" className={styles.userButton}>
          <div className={styles.avatar}>
            {authStore.user?.name.charAt(0).toUpperCase()}
          </div>
          <span className={styles.userName}>{authStore.user?.name}</span>
        </Link>
      </div>
    </header>
  );
});
