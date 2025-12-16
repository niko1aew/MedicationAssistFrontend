import React from "react";
import { Modal } from "../Modal";
import { Button } from "../Button";
import styles from "./TelegramLinkModal.module.css";

interface TelegramLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  botUsername?: string;
}

export const TelegramLinkModal: React.FC<TelegramLinkModalProps> = ({
  isOpen,
  onClose,
  botUsername = "MedicationAssistBot", // Замените на реальное имя вашего бота
}) => {
  const botLink = `https://t.me/${botUsername}`;

  const handleOpenBot = () => {
    window.open(botLink, "_blank", "noopener,noreferrer");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Привязка Telegram">
      <div className={styles.content}>
        <div className={styles.icon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
        </div>

        <div className={styles.message}>
          <h3 className={styles.messageTitle}>
            Для получения уведомлений необходимо привязать Telegram
          </h3>
          <p className={styles.messageText}>
            Чтобы получать напоминания о приеме лекарств в Telegram, необходимо
            авторизоваться в нашем боте.
          </p>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepText}>
              Нажмите кнопку "Открыть бота" ниже
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepText}>
              Нажмите "Start" или "/start" в боте
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepText}>
              Следуйте инструкциям бота для привязки аккаунта
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={handleOpenBot}
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
            }
          >
            Открыть бота
          </Button>
        </div>
      </div>
    </Modal>
  );
};
