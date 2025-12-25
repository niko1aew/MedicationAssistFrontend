import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useStores } from "../../../hooks/useStores";
import { OnboardingStep } from "../../../types/user.types";
import { Button } from "../Button";
import styles from "./OnboardingModal.module.css";

// Иконки для шагов
const WelcomeIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const MedicationIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.5 20.5L3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7z" />
    <path d="M8.5 8.5l7 7" />
  </svg>
);

const AddIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const ReminderIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SuccessIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

interface StepConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  tips?: string[];
  primaryAction: string;
  secondaryAction?: string;
  successIcon?: boolean;
}

const STEPS_CONFIG: Record<OnboardingStep, StepConfig> = {
  [OnboardingStep.Welcome]: {
    icon: <WelcomeIcon />,
    title: "Добро пожаловать!",
    description:
      "Это приложение поможет вам отслеживать прием лекарств и не пропускать важные напоминания. Давайте настроим его вместе!",
    tips: [
      "Добавьте свои лекарства в список",
      "Настройте напоминания для каждого лекарства",
      "Отмечайте приемы, чтобы вести историю",
    ],
    primaryAction: "Начать",
    secondaryAction: "Пропустить",
  },
  [OnboardingStep.NavigateToMedications]: {
    icon: <MedicationIcon />,
    title: "Список лекарств",
    description:
      "Сейчас мы перейдем на страницу «Мои лекарства», где вы сможете добавить свое первое лекарство.",
    tips: [
      "Здесь хранятся все ваши лекарства",
      "Вы можете добавлять, редактировать и удалять записи",
      "Для каждого лекарства можно настроить напоминания",
    ],
    primaryAction: "Перейти к лекарствам",
    secondaryAction: "Пропустить",
  },
  [OnboardingStep.AddMedication]: {
    icon: <AddIcon />,
    title: "Добавьте лекарство",
    description:
      "Нажмите кнопку «Добавить» в верхней части страницы, чтобы создать запись о вашем первом лекарстве.",
    tips: [
      "Укажите название лекарства",
      "Добавьте дозировку (например, 500 мг)",
      "При необходимости добавьте описание",
    ],
    primaryAction: "Понятно",
    secondaryAction: "Пропустить",
  },
  [OnboardingStep.AddReminder]: {
    icon: <ReminderIcon />,
    title: "Настройте напоминание",
    description:
      "Отлично! Теперь нажмите на иконку с часами рядом с лекарством, чтобы настроить напоминание о приеме.",
    tips: [
      "Выберите удобное время для напоминания",
      "Напоминания приходят в Telegram",
      "Вы можете настроить несколько напоминаний",
    ],
    primaryAction: "Понятно",
    secondaryAction: "Пропустить",
  },
  [OnboardingStep.Completed]: {
    icon: <SuccessIcon />,
    title: "Готово!",
    description:
      "Поздравляем! Вы успешно настроили приложение. Теперь вы не пропустите ни одного приема лекарств.",
    tips: [
      "Добавляйте новые лекарства в любое время",
      "Отмечайте приемы нажатием на таблетку",
      "Смотрите историю в разделе «Приемы»",
    ],
    primaryAction: "Завершить",
    successIcon: true,
  },
};

export const OnboardingModal: React.FC = observer(() => {
  const navigate = useNavigate();
  const { onboardingStore, authStore } = useStores();

  const { currentStep, isLoading } = onboardingStore;
  const shouldShow = onboardingStore.isActive && onboardingStore.isModalVisible;

  // Автоматический запуск онбординга при первом рендере
  useEffect(() => {
    if (onboardingStore.shouldShowOnboarding && !onboardingStore.isActive) {
      onboardingStore.startOnboarding();
    }
  }, [
    onboardingStore,
    onboardingStore.shouldShowOnboarding,
    onboardingStore.isActive,
  ]);

  // Если модалка не должна показываться, не рендерим
  if (!shouldShow) return null;

  const stepConfig = STEPS_CONFIG[currentStep];

  const handlePrimaryAction = async () => {
    switch (currentStep) {
      case OnboardingStep.Welcome:
        onboardingStore.nextStep();
        break;

      case OnboardingStep.NavigateToMedications:
        navigate("/medications");
        onboardingStore.nextStep();
        break;

      case OnboardingStep.AddMedication:
        // Скрываем модалку, пользователь должен добавить лекарство
        // После добавления лекарства MedicationsPage вызовет nextStep и модалка появится снова
        onboardingStore.hideModal();
        break;

      case OnboardingStep.AddReminder:
        // Скрываем модалку, пользователь должен настроить напоминание
        // После создания напоминания MedicationsPage вызовет nextStep
        onboardingStore.hideModal();
        break;

      case OnboardingStep.Completed:
        await onboardingStore.completeOnboarding();
        break;
    }
  };

  const handleSecondaryAction = () => {
    onboardingStore.skipOnboarding();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Не закрываем по клику на overlay, только по кнопке "Пропустить"
    e.stopPropagation();
  };

  // Проверяем, есть ли Telegram для шага напоминаний
  const hasTelegram = authStore.user?.telegramUserId;
  const showTelegramWarning =
    currentStep === OnboardingStep.AddReminder && !hasTelegram;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        {/* Progress bar */}
        <div className={styles.progressBar}>
          {Object.values(OnboardingStep)
            .filter((v): v is OnboardingStep => typeof v === "number")
            .map((step) => (
              <div
                key={step}
                className={`${styles.progressStep} ${
                  step === currentStep ? styles.active : ""
                } ${step < currentStep ? styles.completed : ""}`}
              />
            ))}
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div
            className={`${styles.stepIcon} ${
              stepConfig.successIcon ? styles.successIcon : ""
            }`}
          >
            {stepConfig.icon}
          </div>

          <h2 id="onboarding-title" className={styles.stepTitle}>
            {stepConfig.title}
          </h2>

          <p className={styles.stepDescription}>{stepConfig.description}</p>

          {/* Предупреждение о Telegram */}
          {showTelegramWarning && (
            <div className={styles.telegramStep}>
              <p style={{ margin: 0, fontSize: "var(--font-size-sm)" }}>
                ⚠️ Для получения напоминаний нужно привязать Telegram в профиле.
                Вы можете сделать это позже.
              </p>
            </div>
          )}

          {/* Tips */}
          {stepConfig.tips && stepConfig.tips.length > 0 && (
            <div className={styles.tipsList}>
              {stepConfig.tips.map((tip, index) => (
                <div key={index} className={styles.tipItem}>
                  <span className={styles.tipIcon}>
                    <CheckIcon />
                  </span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {stepConfig.secondaryAction && (
            <Button
              variant="secondary"
              onClick={handleSecondaryAction}
              className={styles.skipButton}
            >
              {stepConfig.secondaryAction}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handlePrimaryAction}
            loading={isLoading}
          >
            {stepConfig.primaryAction}
          </Button>
        </div>
      </div>
    </div>
  );
});
