/**
 * Загрузчик конфигурации с сервера
 * Загружает конфиг при старте приложения
 * Сначала пытается загрузить с ooomir.store, если не получается - с бэкенда
 */

const CONFIG_URL_PRIMARY = "https://ooomir.store/backend-config.json";
const CONFIG_URL_FALLBACK = "/backend-config.json"; // Относительный путь к бэкенду

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

  // Начинаем загрузку - сначала пробуем основной URL, потом fallback
  configLoadPromise = (async () => {
    // Пробуем загрузить с основного URL
    try {
      const response = await fetch(CONFIG_URL_PRIMARY, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      
      if (response.ok) {
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

        console.log("✅ Конфигурация загружена с основного источника:", cachedConfig);
        return cachedConfig;
      }
    } catch (error) {
      console.warn("⚠️ Не удалось загрузить конфиг с основного источника, пробуем fallback:", error.message);
    }
    
    // Если основной URL не сработал, пробуем fallback (бэкенд)
    try {
      const response = await fetch(CONFIG_URL_FALLBACK, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      
      if (response.ok) {
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

        console.log("✅ Конфигурация загружена с fallback источника (бэкенд):", cachedConfig);
        return cachedConfig;
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки конфигурации с fallback:", error);
    }
    
    // Если оба источника не сработали, используем переменные окружения
    const fallbackConfig = {
      baseURL: process.env.REACT_APP_URL || "",
      telegramBot: null,
      support: null,
    };
    
    console.warn("⚠️ Используется fallback конфигурация из env:", fallbackConfig);
    cachedConfig = fallbackConfig;
    return cachedConfig;
  })()
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

