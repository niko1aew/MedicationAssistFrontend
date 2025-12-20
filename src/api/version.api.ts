// api/version.api.ts

import axios from "axios";

interface VersionInfo {
  version: string;
  buildTime: string;
}

export const versionApi = {
  /**
   * Получить информацию о версии приложения с сервера
   * Запрос идет напрямую к статическому файлу, минуя API
   */
  getVersion: async (): Promise<VersionInfo> => {
    // Добавляем timestamp для предотвращения кеширования
    const timestamp = Date.now();
    const response = await axios.get<VersionInfo>(
      `/version.json?t=${timestamp}`,
      {
        // Не используем baseURL API, запрашиваем напрямую с корня
        baseURL: window.location.origin,
        // Отключаем интерцепторы для этого запроса
        transformRequest: [(data) => data],
      }
    );
    return response.data;
  },
};
