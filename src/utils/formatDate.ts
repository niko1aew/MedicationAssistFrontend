export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  // Результат: "6 декабря 2025"
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
  // Результат: "14:30"
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  // Результат: "6 декабря 2025, 14:30"
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  
  return formatDate(dateString);
};

// Для input type="datetime-local"
export const toDateTimeLocalValue = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};

// Для input type="date"
export const toDateValue = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10);
};

// Текущая дата в формате для input
export const getCurrentDateTimeLocal = (): string => {
  return new Date().toISOString().slice(0, 16);
};

