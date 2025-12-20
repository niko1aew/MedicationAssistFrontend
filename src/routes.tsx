import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthLayout } from "./components/layout/AuthLayout";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TelegramAuthPage } from "./pages/TelegramAuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MedicationsPage } from "./pages/MedicationsPage";
import { MedicationDetailPage } from "./pages/MedicationDetailPage";
import { IntakesPage } from "./pages/IntakesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  // Публичные маршруты (аутентификация)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // Telegram Web Login (публичный маршрут, но не в AuthLayout)
  {
    path: "/auth/telegram",
    element: <TelegramAuthPage />,
  },

  // Защищенные маршруты
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/medications", element: <MedicationsPage /> },
          { path: "/medications/:id", element: <MedicationDetailPage /> },
          { path: "/intakes", element: <IntakesPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },

  // 404
  { path: "/404", element: <NotFoundPage /> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);
