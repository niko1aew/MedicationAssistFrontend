import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../hooks/useStores";
import { Button } from "../Button";
import { TelegramLinkModal } from "../TelegramLinkModal";
import { ConfirmDialog } from "../ConfirmDialog";
import { usersApi } from "../../../api/users.api";
import { TelegramLinkData } from "../../../types/user.types";
import styles from "./TelegramIntegration.module.css";

interface TelegramIntegrationProps {
  userId: string;
}

export const TelegramIntegration: React.FC<TelegramIntegrationProps> = observer(
  ({ userId }) => {
    const { authStore, uiStore } = useStores();
    const user = authStore.user;

    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
    const [linkData, setLinkData] = useState<TelegramLinkData | null>(null);
    const [modalIsLoading, setModalIsLoading] = useState(false);
    const [isUnlinking, setIsUnlinking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    console.log("TelegramIntegration render:", {
      showLinkModal,
      modalIsLoading,
      linkData,
      error,
    });

    const isLinked = !!user?.telegramUserId;

    const handleGenerateLink = async () => {
      setError(null);
      setLinkData(null); // Очищаем предыдущие данные
      setModalIsLoading(true);
      setShowLinkModal(true);

      try {
        const response = await usersApi.generateTelegramLinkToken(userId);
        const data = response.data;
        const expiresAt = new Date(
          Date.now() + data.expiresInMinutes * 60 * 1000
        );

        setLinkData({
          token: data.token,
          deepLink: data.deepLink,
          expiresInMinutes: data.expiresInMinutes,
          expiresAt,
        });

        // Начинаем polling для проверки статуса привязки
        startPolling();
      } catch (err) {
        const error = err as {
          response?: { data?: { error?: string } };
          message?: string;
        };
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Ошибка генерации ссылки";
        setError(errorMessage);
        uiStore.showToast("error", errorMessage);
      } finally {
        setModalIsLoading(false);
      }
    };

    const handleUnlink = async () => {
      setIsUnlinking(true);

      try {
        await usersApi.unlinkTelegram(userId);

        // Обновляем данные пользователя
        await authStore.refreshUser();

        uiStore.showToast("success", "Telegram отвязан от аккаунта");
        setShowUnlinkConfirm(false);
      } catch (err) {
        const error = err as {
          response?: { data?: { error?: string } };
          message?: string;
        };
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Ошибка отвязки Telegram";
        uiStore.showToast("error", errorMessage);
      } finally {
        setIsUnlinking(false);
      }
    };

    const startPolling = () => {
      let attempts = 0;
      const maxAttempts = 15; // 30 секунд (15 * 2 секунды)
      const interval = 2000; // 2 секунды

      const pollInterval = setInterval(async () => {
        attempts++;

        try {
          // Обновляем данные пользователя
          await authStore.refreshUser();

          // Проверяем, привязан ли Telegram
          if (authStore.user?.telegramUserId) {
            clearInterval(pollInterval);
            setShowLinkModal(false);
            uiStore.showToast(
              "success",
              "Telegram успешно привязан к аккаунту!"
            );
          }
        } catch (err) {
          console.error("Polling error:", err);
        }

        // Останавливаем polling после максимального количества попыток
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
        }
      }, interval);

      // Очищаем интервал при размонтировании или закрытии модального окна
      return () => clearInterval(pollInterval);
    };

    const handleCloseModal = () => {
      setShowLinkModal(false);
      setLinkData(null);
      setError(null);
      setModalIsLoading(false);
    };

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.icon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
            </div>
            <h3 className={styles.title}>Интеграция с Telegram</h3>
          </div>
        </div>

        {isLinked ? (
          <div className={styles.linkedState}>
            <div className={styles.statusBadge}>
              <span className={styles.statusIcon}>✅</span>
              <span className={styles.statusText}>Подключено</span>
            </div>

            <div className={styles.userInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Username:</span>
                <span className={styles.infoValue}>
                  @{user?.telegramUsername}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Telegram ID:</span>
                <span className={styles.infoValue}>{user?.telegramUserId}</span>
              </div>
            </div>

            <div className={styles.benefits}>
              <p className={styles.benefitsTitle}>Доступные возможности:</p>
              <ul className={styles.benefitsList}>
                <li>📬 Получение напоминаний о приеме лекарств</li>
                <li>💊 Управление лекарствами через бота</li>
                <li>📊 Отслеживание истории приема</li>
              </ul>
            </div>

            <Button
              variant="secondary"
              onClick={() => setShowUnlinkConfirm(true)}
              loading={isUnlinking}
            >
              Отключить
            </Button>
          </div>
        ) : (
          <div className={styles.notLinkedState}>
            <div className={styles.statusBadge}>
              <span className={styles.statusIcon}>⚪</span>
              <span className={styles.statusText}>Не подключено</span>
            </div>

            <p className={styles.description}>
              Подключите Telegram аккаунт для получения уведомлений о приеме
              лекарств и управления через бота.
            </p>

            <div className={styles.benefits}>
              <p className={styles.benefitsTitle}>
                Подключив Telegram, вы сможете:
              </p>
              <ul className={styles.benefitsList}>
                <li>📬 Получать напоминания о приеме лекарств</li>
                <li>💊 Управлять лекарствами через бота</li>
                <li>📊 Отслеживать историю приема</li>
              </ul>
            </div>

            <Button
              variant="primary"
              onClick={handleGenerateLink}
              loading={modalIsLoading}
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
              Подключить Telegram
            </Button>
          </div>
        )}

        <TelegramLinkModal
          isOpen={showLinkModal}
          onClose={handleCloseModal}
          linkData={linkData}
          isLoading={modalIsLoading}
          error={error}
          onGenerate={handleGenerateLink}
        />

        <ConfirmDialog
          isOpen={showUnlinkConfirm}
          title="Отключить Telegram?"
          message="Вы уверены, что хотите отключить интеграцию с Telegram? Вы перестанете получать уведомления в боте."
          confirmText="Отключить"
          cancelText="Отмена"
          variant="warning"
          onConfirm={handleUnlink}
          onCancel={() => setShowUnlinkConfirm(false)}
        />
      </div>
    );
  }
);
