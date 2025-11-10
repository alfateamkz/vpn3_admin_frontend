/**
 * Утилиты для работы с датами и временем
 * Конвертация UTC в московское время (МСК)
 */

/**
 * Конвертирует UTC дату в московское время
 * @param {string|Date} date - Дата в UTC
 * @returns {Date} - Дата в московском времени
 */
export const convertToMoscow = (date) => {
  if (!date) return null;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Простой способ: добавляем 3 часа к UTC (Москва UTC+3)
  const utcTime = dateObj.getTime();
  const moscowOffset = 3 * 60 * 60 * 1000; // 3 часа в миллисекундах
  return new Date(utcTime + moscowOffset);
};

/**
 * Форматирует дату и время в московском времени
 * @param {string|Date} date - Дата в UTC
 * @param {Object} options - Опции форматирования
 * @returns {string} - Отформатированная дата с пометкой МСК
 */
export const formatDateTimeMoscow = (date, options = {}) => {
  if (!date) return "—";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Moscow',
    ...options
  };
  
  return `${dateObj.toLocaleString('ru-RU', defaultOptions)} МСК`;
};

/**
 * Форматирует только дату в московском времени
 * @param {string|Date} date - Дата в UTC
 * @returns {string} - Отформатированная дата с пометкой МСК
 */
export const formatDateMoscow = (date) => {
  if (!date) return "—";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return `${dateObj.toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК`;
};

/**
 * Форматирует дату и время в коротком формате (без секунд)
 * @param {string|Date} date - Дата в UTC
 * @returns {string} - Отформатированная дата с пометкой МСК
 */
export const formatDateTimeShortMoscow = (date) => {
  if (!date) return "—";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return `${dateObj.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow'
  })} МСК`;
};

/**
 * Форматирует дату для графиков (только день и месяц)
 * @param {string|Date} date - Дата в UTC
 * @returns {string} - Отформатированная дата
 */
export const formatDateForChart = (date) => {
  if (!date) return "—";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'short',
    timeZone: 'Europe/Moscow'
  });
};

