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

### Переменные окружения

Создайте файл `.env` на основе примера:

```bash
cp .env.example .env
```

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `VITE_API_URL` | URL API (build-time) | `http://localhost:5018/api` |
| `FRONTEND_PORT` | Порт frontend | `3000` |

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
