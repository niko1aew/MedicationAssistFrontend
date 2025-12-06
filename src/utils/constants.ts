export const APP_NAME = import.meta.env.VITE_APP_NAME || 'MedicationAssist';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MEDICATIONS: '/medications',
  MEDICATION_DETAIL: '/medications/:id',
  INTAKES: '/intakes',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: '/users',
  MEDICATIONS: (userId: string) => `/users/${userId}/medications`,
  INTAKES: (userId: string) => `/users/${userId}/intakes`,
} as const;

export const MESSAGES = {
  SUCCESS: {
    REGISTER: 'Регистрация прошла успешно!',
    LOGIN: 'Вход выполнен успешно',
    MEDICATION_CREATED: 'Лекарство добавлено',
    MEDICATION_UPDATED: 'Лекарство обновлено',
    MEDICATION_DELETED: 'Лекарство удалено',
    INTAKE_CREATED: 'Прием зарегистрирован',
    INTAKE_UPDATED: 'Запись обновлена',
    INTAKE_DELETED: 'Запись удалена',
    PROFILE_UPDATED: 'Профиль обновлен',
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Неверный email или пароль',
    EMAIL_EXISTS: 'Пользователь с таким email уже существует',
    LOAD_ERROR: 'Ошибка загрузки данных',
    SAVE_ERROR: 'Не удалось сохранить изменения',
    DELETE_ERROR: 'Не удалось удалить',
    NETWORK_ERROR: 'Нет подключения к интернету. Проверьте соединение.',
    SERVER_ERROR: 'Сервер временно недоступен. Попробуйте позже.',
  },
  CONFIRM: {
    DELETE_MEDICATION: {
      title: 'Удалить лекарство?',
      message: (name: string) => `Лекарство «${name}» будет удалено. Это действие нельзя отменить.`,
    },
    DELETE_INTAKE: {
      title: 'Удалить запись?',
      message: 'Запись о приеме будет удалена. Это действие нельзя отменить.',
    },
    LOGOUT: {
      title: 'Выйти из аккаунта?',
      message: 'Вы уверены, что хотите выйти?',
    },
  },
} as const;

