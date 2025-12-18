# MedicationAssist Frontend

Веб-приложение для контроля приема лекарственных препаратов с интеграцией Telegram-уведомлений.

## Технологии

- **React 18** + **TypeScript**
- **Vite** — сборка
- **MobX** — управление состоянием
- **React Router v6** — маршрутизация
- **Axios** — HTTP-клиент
- **CSS Modules** — стилизация
- **QR Code** — генерация QR-кодов для Telegram-интеграции

## Быстрый старт (Development)

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev
```

Приложение будет доступно на http://localhost:3000

## Сборка

```bash
# Production сборка
npm run build

# Предпросмотр сборки
npm run preview
```

---

## Docker

### Переменные окружения

Создайте файл `.env` на основе примера:

```bash
cp .env.example .env
```

| Переменная      | Описание             | По умолчанию                |
| --------------- | -------------------- | --------------------------- |
| `VITE_API_URL`  | URL API (build-time) | `http://localhost:5018/api` |
| `FRONTEND_PORT` | Порт frontend        | `3000`                      |

### Сборка и запуск

```bash
# Сборка и запуск
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f frontend

# Остановка
docker-compose down
```

Приложение будет доступно на http://localhost:3000 (или на порту, указанном в `FRONTEND_PORT`).

### Пример `.env` для production

```env
VITE_API_URL=https://api.your-domain.com/api
FRONTEND_PORT=80
```

---

## Структура проекта

```
src/
├── api/              # API клиент и сервисы
│   ├── auth.api.ts       # Аутентификация
│   ├── medications.api.ts # Лекарства
│   ├── intakes.api.ts    # Приемы
│   ├── reminders.api.ts  # Напоминания
│   └── users.api.ts      # Пользователи и Telegram
├── components/       # React компоненты
│   ├── common/       # UI Kit
│   │   ├── Button, Input, Modal
│   │   ├── TelegramIntegration  # Telegram виджет
│   │   └── TelegramLinkModal    # Модал для привязки Telegram
│   ├── layout/       # Header, Sidebar, MainLayout
│   ├── auth/         # LoginForm, RegisterForm, ProtectedRoute
│   ├── medications/  # MedicationCard, MedicationForm, MedicationList
│   ├── intakes/      # IntakeCard, IntakeForm, QuickIntakeButton
│   ├── reminders/    # ReminderForm
│   └── dashboard/    # MedicationSummary, TodayIntakes, RecentActivity
├── pages/            # Страницы приложения
│   ├── DashboardPage      # Главная страница
│   ├── MedicationsPage    # Список лекарств
│   ├── MedicationDetailPage # Детали лекарства
│   ├── IntakesPage        # История приемов
│   ├── ProfilePage        # Профиль и Telegram-интеграция
│   ├── LoginPage          # Вход
│   └── RegisterPage       # Регистрация
├── stores/           # MobX сторы
│   ├── AuthStore.ts       # Аутентификация
│   ├── MedicationStore.ts # Лекарства
│   ├── IntakeStore.ts     # Приемы
│   ├── ReminderStore.ts   # Напоминания
│   ├── UserStore.ts       # Пользователь и Telegram
│   └── UIStore.ts         # UI состояние
├── hooks/            # React хуки (useAuth, useStores)
├── types/            # TypeScript типы
├── utils/            # Утилиты (validators, formatDate, timezone)
└── styles/           # Глобальные стили
```

## Основные возможности

- ✅ Управление лекарствами (CRUD)
- ✅ Отметка приемов лекарств
- ✅ Настройка напоминаний с гибкими интервалами
- ✅ **Telegram-интеграция** — привязка аккаунта через QR-код
- ✅ **Push-уведомления в Telegram** о приемах лекарств
- ✅ Поддержка часовых поясов
- ✅ История приемов с фильтрацией
- ✅ Дашборд с актуальной информацией
- ✅ Адаптивный дизайн

## Скрипты

| Команда           | Описание            |
| ----------------- | ------------------- |
| `npm run dev`     | Запуск dev-сервера  |
| `npm run build`   | Production сборка   |
| `npm run preview` | Предпросмотр сборки |
| `npm run lint`    | Проверка ESLint     |

## API

Backend API должен быть запущен на `http://localhost:5018` (или URL, указанный в `VITE_API_URL`).

Документация API: `/swagger`

### Основные эндпоинты

- `POST /api/auth/register` — Регистрация
- `POST /api/auth/login` — Вход
- `POST /api/auth/refresh` — Обновление токена
- `GET /api/medications` — Список лекарств
- `POST /api/medications` — Создание лекарства
- `POST /api/intakes` — Отметка приема
- `GET /api/intakes` — История приемов
- `POST /api/reminders` — Создание напоминания
- `GET /api/users/me` — Профиль пользователя
- `POST /api/users/telegram/init-link` — Инициализация привязки Telegram
- `GET /api/users/telegram/status` — Статус привязки Telegram
- `DELETE /api/users/telegram/unlink` — Отвязка Telegram

---

## Лицензия

MIT
