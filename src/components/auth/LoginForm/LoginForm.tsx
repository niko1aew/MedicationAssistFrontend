import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../hooks/useStores";
import { Button, Input } from "../../common";
import { TelegramLoginModal } from "../TelegramLoginModal";
import { authApi } from "../../../api";
import {
  TelegramLoginInitResponse,
  TelegramLoginPollResponse,
} from "../../../types/user.types";
import { validateEmail } from "../../../utils/validators";
import styles from "./LoginForm.module.css";

export const LoginForm: React.FC = observer(() => {
  const { authStore, uiStore } = useStores();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Telegram Login State
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramLoginData, setTelegramLoginData] =
    useState<TelegramLoginInitResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<number | null>(null);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error;
    }

    if (!password) {
      newErrors.password = "Введите пароль";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const success = await authStore.login({ email, password });

    if (success) {
      uiStore.showToast("success", "Вход выполнен успешно");
      navigate("/");
    }
  };

  // Telegram Login Handlers
  const handleTelegramLogin = async () => {
    try {
      authStore.clearError();
      const response = await authApi.telegramLoginInit();
      console.log("Telegram Init Response:", response);
      const data = response.data;
      console.log("Telegram Init Data:", data);
      setTelegramLoginData(data);
      setShowTelegramModal(true);
      startPolling(data.token);
    } catch (error: any) {
      console.error("Ошибка инициализации Telegram авторизации:", error);
      uiStore.showToast(
        "error",
        error.response?.data?.message ||
          "Не удалось инициализировать вход через Telegram"
      );
    }
  };

  const startPolling = async (token: string) => {
    setIsPolling(true);
    const maxAttempts = 60; // 60 попыток по 5 секунд = 5 минут
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        stopPolling();
        uiStore.showToast("error", "Время ожидания авторизации истекло");
        setShowTelegramModal(false);
        return;
      }

      attempts++;

      try {
        const pollResponse = await authApi.telegramLoginPoll(token);
        const result: TelegramLoginPollResponse =
          pollResponse.data || pollResponse;

        if (result.status === "authorized") {
          stopPolling();
          // Сохраняем данные авторизации
          if (result.token && result.user) {
            const authResponse = {
              token: result.token,
              refreshToken: result.refreshToken,
              tokenExpires: result.tokenExpires,
              user: result.user,
            };

            authStore.setAuthData(authResponse);

            uiStore.showToast(
              "success",
              "Вход выполнен успешно через Telegram!"
            );
            setShowTelegramModal(false);
            navigate("/");
          }
          return;
        }

        if (result.status === "expired") {
          stopPolling();
          uiStore.showToast("error", "Токен авторизации истёк");
          setShowTelegramModal(false);
          return;
        }

        // Статус 'pending', продолжаем polling
      } catch (error: any) {
        console.error("Ошибка polling:", error);
        // Продолжаем polling даже при ошибке сети
      }
    };

    // Немедленная первая проверка
    await poll();

    // Установка интервала для последующих проверок
    pollingIntervalRef.current = setInterval(poll, 5000);
  };

  const stopPolling = () => {
    setIsPolling(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleCloseTelegramModal = () => {
    stopPolling();
    setShowTelegramModal(false);
    setTelegramLoginData(null);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Вход в систему</h2>

      {authStore.error && (
        <div className={styles.error} role="alert">
          {authStore.error}
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        size="large"
        fullWidth
        onClick={handleTelegramLogin}
        disabled={isPolling || authStore.isLoading}
        className={styles.telegramButton}
      >
        <span className={styles.telegramButtonContent}>
          <svg
            className={styles.telegramIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
            width="20"
            height="20"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.18.943.112.78.89z" />
          </svg>
          <span>Войти через Telegram</span>
        </span>
      </Button>

      <div className={styles.divider}>
        <span>ИЛИ</span>
      </div>

      <div className={styles.fields}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setErrors((prev) => ({ ...prev, email: undefined }));
            authStore.clearError();
          }}
          error={errors.email}
          placeholder="your@email.com"
          required
          autoComplete="email"
        />

        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setErrors((prev) => ({ ...prev, password: undefined }));
            authStore.clearError();
          }}
          error={errors.password}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="large"
        fullWidth
        loading={authStore.isLoading}
      >
        Войти
      </Button>

      <p className={styles.footer}>
        Нет аккаунта?{" "}
        <Link to="/register" className={styles.link}>
          Зарегистрируйтесь
        </Link>
      </p>

      <TelegramLoginModal
        isOpen={showTelegramModal}
        onClose={handleCloseTelegramModal}
        loginData={telegramLoginData}
        isPolling={isPolling}
      />
    </form>
  );
});
