import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import "./TelegramAuthPage.css";

export const TelegramAuthPage: React.FC = observer(() => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authStore } = useStores();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError(
        "Токен не найден. Пожалуйста, попробуйте снова из Telegram бота."
      );
      setLoading(false);
      return;
    }

    const authenticateWithToken = async (tokenValue: string) => {
      try {
        setLoading(true);

        // Вызываем метод входа через Telegram
        const success = await authStore.telegramWebLogin(tokenValue);

        if (success) {
          // Очищаем токен из URL
          window.history.replaceState({}, document.title, "/");

          // Перенаправляем на дашборд
          navigate("/", { replace: true });
        } else {
          // Ошибка уже установлена в authStore
          setError(authStore.error || "Произошла ошибка при входе");
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("Telegram login error:", err);
        setError("Произошла ошибка при входе. Попробуйте еще раз.");
        setLoading(false);
      }
    };

    authenticateWithToken(token);
  }, [searchParams, authStore, navigate]);

  const handleManualLogin = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="telegram-auth-page">
        <div className="telegram-auth-container">
          <div className="auth-loading">
            <div className="spinner"></div>
            <h2>🔐 Вход через Telegram</h2>
            <p>Пожалуйста, подождите...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="telegram-auth-page">
        <div className="telegram-auth-container">
          <div className="auth-error">
            <div className="error-icon">❌</div>
            <h2>Ошибка входа</h2>
            <p className="error-message">{error}</p>
            <button className="btn-primary" onClick={handleManualLogin}>
              Войти вручную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
});
