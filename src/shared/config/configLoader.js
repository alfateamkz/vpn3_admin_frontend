/**
 * Загрузчик конфигурации с сервера
 * Загружает конфиг при старте приложения с домена ooomir.store
 */

const CONFIG_URL = "https://ooomir.store/backend-config.json";

let cachedConfig = null;
let configLoadPromise = null;

/**
 * Загружает конфигурацию с сервера
 * @returns {Promise<Object>} Конфигурация с полями: baseURL, telegramBot, support
 */
export async function loadConfig() {
  // Если конфиг уже загружен, возвращаем его
  if (cachedConfig) {
    return cachedConfig;
  }

  // Если загрузка уже идет, возвращаем тот же промис
  if (configLoadPromise) {
    return configLoadPromise;
  }

  // Начинаем загрузку
  configLoadPromise = fetch(CONFIG_URL, {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
      }
      const config = await response.json();
      
      // Валидация конфига
      if (!config.baseURL) {
        throw new Error("Config missing required field: baseURL");
      }

      cachedConfig = {
        baseURL: config.baseURL,
        telegramBot: config.telegramBot || null,
        support: config.support || null,
      };

      console.log("✅ Конфигурация загружена:", cachedConfig);
      return cachedConfig;
    })
    .catch((error) => {
      console.error("❌ Ошибка загрузки конфигурации:", error);
      
      // Fallback на переменные окружения
      const fallbackConfig = {
        baseURL: process.env.REACT_APP_URL || "",
        telegramBot: null,
        support: null,
      };
      
      console.warn("⚠️ Используется fallback конфигурация из env:", fallbackConfig);
      cachedConfig = fallbackConfig;
      return cachedConfig;
    })
    .finally(() => {
      // Очищаем промис после загрузки
      configLoadPromise = null;
    });

  return configLoadPromise;
}

/**
 * Получает загруженную конфигурацию (синхронно)
 * @returns {Object|null} Конфигурация или null если еще не загружена
 */
export function getConfig() {
  return cachedConfig;
}

/**
 * Сбрасывает кэш конфигурации (для тестирования)
 */
export function resetConfig() {
  cachedConfig = null;
  configLoadPromise = null;
}

