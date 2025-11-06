import { useSelector } from "react-redux";

/**
 * Хук для доступа к конфигурации приложения
 * @returns {Object} Конфигурация с полями: baseURL, telegramBot, support, loaded
 */
export function useConfig() {
  const config = useSelector((state) => state.config);
  return config;
}

