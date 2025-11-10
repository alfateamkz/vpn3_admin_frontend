/**
 * Утилиты для работы с датами и временем
 * Конвертация UTC в московское время (МСК) - добавляем 3 часа к UTC
 */

/**
 * Конвертирует UTC дату в московское время (добавляет 3 часа)
 * @param {string|Date} date - Дата в UTC
 * @returns {Date} - Дата в московском времени
 */
export const convertToMoscow = (date) => {
  if (!date) return null;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Добавляем 3 часа к UTC (Москва UTC+3)
  const utcTime = dateObj.getTime();
  const moscowOffset = 3 * 60 * 60 * 1000; // 3 часа в миллисекундах
  return new Date(utcTime + moscowOffset);
};

/**
 * Форматирует число с ведущим нулем
 * @param {number} num - Число
 * @returns {string} - Отформатированное число
 */
const padZero = (num) => {
  return num.toString().padStart(2, '0');
};

/**
 * Форматирует дату и время в московском времени
 * Формат: 10.11.2025, 22:08:38 МСК
 * @param {string|Date} date - Дата в UTC
 * @param {Object} options - Опции форматирования
 * @returns {string} - Отформатированная дата с пометкой МСК
 */
export const formatDateTimeMoscow = (date, options = {}) => {
  if (!date) return "—";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Добавляем 3 часа к UTC
  const moscowTime = convertToMoscow(dateObj);
  
  const day = padZero(moscowTime.getDate());
  const month = padZero(moscowTime.getMonth() + 1);
  const year = moscowTime.getFullYear();
  const hours = padZero(moscowTime.getHours());
  const minutes = padZero(moscowTime.getMinutes());
  const seconds = padZero(moscowTime.getSeconds());
  
  return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds} МСК`;
};

/**
 * Форматирует только дату в московском времени
 * Формат: 10.11.2025 МСК
 * @param {string|Date} date - Дата в UTC
 * @returns {string} - Отформатированная дата с пометкой МСК
 */
export const formatDateMoscow = (date) => {
  if (!date) return "—";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Добавляем 3 часа к UTC
  const moscowTime = convertToMoscow(dateObj);
  
  const day = padZero(moscowTime.getDate());
  const month = padZero(moscowTime.getMonth() + 1);
  const year = moscowTime.getFullYear();
  
  return `${day}.${month}.${year} МСК`;
};

/**
 * Форматирует дату и время в коротком формате (без секунд)
 * Формат: 10.11.2025, 22:08 МСК
 * @param {string|Date} date - Дата в UTC
 * @returns {string} - Отформатированная дата с пометкой МСК
 */
export const formatDateTimeShortMoscow = (date) => {
  if (!date) return "—";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Добавляем 3 часа к UTC
  const moscowTime = convertToMoscow(dateObj);
  
  const day = padZero(moscowTime.getDate());
  const month = padZero(moscowTime.getMonth() + 1);
  const year = moscowTime.getFullYear();
  const hours = padZero(moscowTime.getHours());
  const minutes = padZero(moscowTime.getMinutes());
  
  return `${day}.${month}.${year}, ${hours}:${minutes} МСК`;
};

/**
 * Форматирует дату для графиков (только день и месяц)
 * @param {string|Date} date - Дата в UTC
 * @returns {string} - Отформатированная дата
 */
export const formatDateForChart = (date) => {
  if (!date) return "—";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Добавляем 3 часа к UTC
  const moscowTime = convertToMoscow(dateObj);
  
  const day = moscowTime.getDate();
  const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const month = monthNames[moscowTime.getMonth()];
  
  return `${day} ${month}`;
};

