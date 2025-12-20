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

| Переменная                   | Описание                  | По умолчанию                |
| ---------------------------- | ------------------------- | --------------------------- |
| `VITE_API_URL`               | URL API (build-time)      | `http://localhost:5018/api` |
| `VITE_TELEGRAM_BOT_USERNAME` | Имя Telegram бота (без @) | `MedicationAssistBot`       |
| `FRONTEND_PORT`              | Порт frontend             | `3000`                      |

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
VITE_TELEGRAM_BOT_USERNAME=YourMedicationBot
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
- ✅ **Telegram-интеграция** — привязка аккаунта через QR-код или deep link
- ✅ **Push-уведомления в Telegram** о приемах лекарств
- ✅ Поддержка часовых поясов
- ✅ История приемов с фильтрацией
- ✅ Дашборд с актуальной информацией
- ✅ Адаптивный дизайн
- ✅ Темная/светлая тема

## Telegram-интеграция

### Возможности

- Привязка Telegram-аккаунта через QR-код (на десктопе) или deep link (на мобильных)
- Автоматическая проверка статуса привязки (polling каждые 2 секунды)
- Ручная проверка статуса через кнопку "Проверить статус"
- Отвязка аккаунта
- Время действия ссылки: 15 минут
- Одноразовый токен привязки

### Использование

1. Перейдите в профиль
2. В разделе "Интеграция с Telegram" нажмите "Подключить Telegram"
3. Отсканируйте QR-код или нажмите "Открыть в Telegram"
4. Подтвердите привязку в боте
5. Статус автоматически обновится (в течение 2 минут)

Если автоматическая проверка не сработала, используйте кнопку "Проверить статус" в модальном окне.

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

#### Аутентификация

- `POST /api/auth/register` — Регистрация
- `POST /api/auth/login` — Вход
- `POST /api/auth/refresh` — Обновление токена
- `POST /api/auth/revoke` — Выход (отзыв refresh токена)
- `POST /api/auth/revoke-all` — Выход со всех устройств

#### Лекарства

- `GET /api/users/{userId}/medications` — Список лекарств
- `POST /api/users/{userId}/medications` — Создание лекарства
- `GET /api/users/{userId}/medications/{id}` — Детали лекарства
- `PUT /api/users/{userId}/medications/{id}` — Обновление лекарства
- `DELETE /api/users/{userId}/medications/{id}` — Удаление лекарства

#### Приемы

- `GET /api/users/{userId}/intakes` — История приемов
- `POST /api/users/{userId}/intakes` — Отметка приема
- `DELETE /api/users/{userId}/intakes/{id}` — Удаление приема

#### Напоминания

- `GET /api/users/{userId}/reminders` — Список напоминаний
- `POST /api/users/{userId}/reminders` — Создание напоминания
- `DELETE /api/users/{userId}/reminders/{id}` — Удаление напоминания

#### Пользователи и Telegram

- `GET /api/users/{userId}` — Профиль пользователя
- `PUT /api/users/{userId}` — Обновление профиля
- `PUT /api/users/{userId}/timezone` — Обновление часового пояса
- `POST /api/users/{userId}/telegram-link-token` — Генерация токена для привязки Telegram
- `DELETE /api/users/{userId}/telegram-link` — Отвязка Telegram

---

## Лицензия

MIT
