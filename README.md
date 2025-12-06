# MedicationAssist Frontend

Веб-приложение для контроля приема лекарственных препаратов.

## Технологии

- **React 18** + **TypeScript**
- **Vite** — сборка
- **MobX** — управление состоянием
- **React Router v6** — маршрутизация
- **Axios** — HTTP-клиент
- **CSS Modules** — стилизация

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

### Локальная сборка и запуск

```bash
# Сборка и запуск
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f frontend

# Остановка
docker-compose down
```

Приложение будет доступно на http://localhost:3000

### Production деплой

1. **Создайте файл `.env`** с production настройками:

```env
# API URL для сборки
VITE_API_URL=https://api.your-domain.com/api

# Порт frontend (опционально, по умолчанию 3000)
FRONTEND_PORT=80

# Runtime API URL (для изменения без пересборки)
RUNTIME_API_URL=https://api.your-domain.com/api
```

2. **Запустите с production конфигурацией:**

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `VITE_API_URL` | URL API (build-time) | `http://localhost:5018/api` |
| `FRONTEND_PORT` | Порт frontend | `3000` |
| `RUNTIME_API_URL` | URL API (runtime, опционально) | - |

### Health Check

Endpoint для проверки здоровья: `GET /health`

---

## Структура проекта

```
src/
├── api/              # API клиент и сервисы
├── components/       # React компоненты
│   ├── common/       # UI Kit (Button, Input, Modal...)
│   ├── layout/       # Layout (Header, Sidebar...)
│   ├── auth/         # Аутентификация
│   ├── medications/  # Лекарства
│   ├── intakes/      # Приемы
│   └── dashboard/    # Дашборд
├── pages/            # Страницы
├── stores/           # MobX сторы
├── hooks/            # React хуки
├── types/            # TypeScript типы
├── utils/            # Утилиты
└── styles/           # Глобальные стили
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Production сборка |
| `npm run preview` | Предпросмотр сборки |
| `npm run lint` | Проверка ESLint |

## API

Backend API должен быть запущен на `http://localhost:5018` (или URL, указанный в `VITE_API_URL`).

Документация API: `/swagger`

---

## Лицензия

MIT

