import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Modal } from "../Modal";
import { Button } from "../Button";
import { Loader } from "../Loader";
import { TelegramLinkData } from "../../../types/user.types";
import styles from "./TelegramLinkModal.module.css";

interface TelegramLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkData: TelegramLinkData | null;
  isLoading?: boolean;
  error?: string | null;
  onGenerate?: () => void;
}

export const TelegramLinkModal: React.FC<TelegramLinkModalProps> = ({
  isOpen,
  onClose,
  linkData,
  isLoading = false,
  error = null,
  onGenerate,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!linkData) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiresAt = new Date(linkData.expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(diff);
      setIsExpired(diff === 0);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [linkData]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOpenTelegram = () => {
    if (linkData && !isExpired) {
      window.open(linkData.deepLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = async () => {
    if (linkData && !isExpired) {
      try {
        await navigator.clipboard.writeText(linkData.deepLink);
        // Можно добавить уведомление об успехе
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const renderContent = () => {
    // Если идет загрузка ИЛИ нет данных и нет ошибки - показываем загрузку
    if (isLoading || (!linkData && !error)) {
      return (
        <div className={styles.loadingState}>
          <Loader />
          <p className={styles.loadingText}>Генерация ссылки для привязки...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorText}>{error}</p>
          {onGenerate && (
            <Button variant="primary" onClick={onGenerate}>
              Попробовать снова
            </Button>
          )}
        </div>
      );
    }

    if (isExpired && linkData) {
      return (
        <div className={styles.expiredState}>
          <div className={styles.expiredIcon}>⏰</div>
          <h3 className={styles.expiredTitle}>Ссылка истекла</h3>
          <p className={styles.expiredText}>
            Срок действия ссылки истек. Пожалуйста, сгенерируйте новую ссылку.
          </p>
          {onGenerate && (
            <Button variant="primary" onClick={onGenerate}>
              Создать новую ссылку
            </Button>
          )}
        </div>
      );
    }

    if (!linkData) {
      return null;
    }

    return (
      <>
        {!isMobile && (
          <div className={styles.qrSection}>
            <div className={styles.qrCodeWrapper}>
              <QRCodeSVG
                value={linkData.deepLink}
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
            <p className={styles.qrDescription}>
              Отсканируйте QR-код с мобильного устройства
            </p>
          </div>
        )}

        {!isMobile && <div className={styles.divider}>или</div>}

        <div className={styles.linkSection}>
          <Button
            variant="primary"
            onClick={handleOpenTelegram}
            fullWidth
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
            Открыть в Telegram
          </Button>

          <Button
            variant="secondary"
            onClick={handleCopyLink}
            fullWidth
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            }
          >
            Скопировать ссылку
          </Button>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>⏱️</span>
            <span className={styles.infoText}>
              Ссылка действительна: <strong>{formatTime(timeLeft)}</strong>{" "}
              минут
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>🔒</span>
            <span className={styles.infoText}>
              Ссылка одноразовая и защищена
            </span>
          </div>
        </div>

        <div className={styles.steps}>
          <h4 className={styles.stepsTitle}>Что произойдет дальше:</h4>
          <ol className={styles.stepsList}>
            <li>Telegram откроется автоматически</li>
            <li>Бот привяжет ваш аккаунт мгновенно</li>
            <li>Вы увидите главное меню</li>
          </ol>
        </div>
      </>
    );
  };

  const content = renderContent();
  console.log("Modal content to render:", content);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Привязать Telegram аккаунт">
      <div className={styles.content}>
        {content || (
          <div style={{ padding: "20px", color: "red" }}>
            DEBUG: Content is null or undefined
          </div>
        )}
      </div>
    </Modal>
  );
};
