import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { OnboardingModal } from "../../common/OnboardingModal";
import styles from "./MainLayout.module.css";

export const MainLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>
      <OnboardingModal />
    </div>
  );
};
