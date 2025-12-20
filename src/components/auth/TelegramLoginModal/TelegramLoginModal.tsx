import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Modal } from "../../common";
import { TelegramLoginInitResponse } from "../../../types/user.types";
import styles from "./TelegramLoginModal.module.css";

interface TelegramLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginData: TelegramLoginInitResponse | null;
  isPolling: boolean;
}

export const TelegramLoginModal: React.FC<TelegramLoginModalProps> = ({
  isOpen,
  onClose,
  loginData,
  isPolling,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Определяем мобильное устройство
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  if (!loginData) return null;

  console.log("TelegramLoginModal loginData:", loginData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Вход через Telegram"
      size="medium"
    >
      <div className={styles.content}>
        {/* Кнопка для открытия Telegram */}
        <div className={styles.qrSection}>
          <a
            href={loginData.deepLink}
            className={styles.telegramButton}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Telegram button clicked:", loginData.deepLink);
            }}
          >
            <svg
              className={styles.telegramIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.18.943.112.78.89z" />
            </svg>
            Открыть Telegram
          </a>

          {/* Кнопка для показа QR-кода */}
          <button
            type="button"
            className={styles.showQrButton}
            onClick={(e) => {
              e.stopPropagation();
              setShowQR(!showQR);
            }}
          >
            {showQR ? "Скрыть QR-код" : "Показать QR-код"}
          </button>

          {/* QR-код (показывается при нажатии) */}
          {showQR && (
            <div className={styles.qrCodeWrapper}>
              <div className={styles.qrCode}>
                <QRCodeSVG
                  value={loginData.deepLink}
                  size={isMobile ? 200 : 256}
                  level="H"
                  includeMargin
                />
              </div>
              <p className={styles.instruction}>
                Отсканируйте QR-код с помощью приложения Telegram
              </p>
            </div>
          )}
        </div>

        <div className={styles.instructions}>
          <h3 className={styles.instructionsTitle}>Инструкция:</h3>
          <ol className={styles.instructionsList}>
            <li>Откройте ссылку в Telegram</li>
            <li>Подтвердите вход в боте</li>
            <li>Нажмите на кнопку "Войти на сайт"</li>
          </ol>
        </div>

        {isPolling && (
          <div className={styles.waiting}>
            <div className={styles.spinner}></div>
            <p className={styles.waitingText}>⏳ Ожидание авторизации...</p>
          </div>
        )}

        <p className={styles.expiration}>
          ⏱️ Ссылка действительна {loginData.expiresInMinutes} мин.
        </p>
      </div>
    </Modal>
  );
};
