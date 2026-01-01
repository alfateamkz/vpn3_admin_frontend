<div align="center">

# MirNet VPN - Admin Panel

**Современная и мощная панель управления VPN сервисом**

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.5.0-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![React Router](https://img.shields.io/badge/React_Router-7.0.2-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![SASS](https://img.shields.io/badge/SASS-1.82.0-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)

[Возможности](#-возможности) • [Установка](#-установка) • [Разработка](#-разработка) • [Компоненты](#-компоненты) • [Deployment](#-deployment)

</div>

---

## Содержание

- [О проекте](#-о-проекте)
- [Возможности](#-возможности)
- [Технологический стек](#-технологический-стек)
- [Установка](#-установка)
- [Разработка](#-разработка)
- [Структура проекта](#-структура-проекта)
- [Компоненты](#-компоненты)
- [State Management](#-state-management)
- [Стилизация](#-стилизация)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## О проекте

**MirNet VPN Admin Panel** — это современная Single Page Application (SPA) для управления VPN сервисом. Построена на React 19 с использованием Redux Toolkit для управления состоянием и SASS для стилизации.

### Ключевые особенности:

- **React 19** - последняя версия с улучшенной производительностью
- **Redux Toolkit** - современное управление состоянием
- **SASS Modules** - изолированные стили
- **React Router v7** - клиентский роутинг
- **Responsive Design** - адаптивный интерфейс
- **JWT Authentication** - безопасная авторизация
- **Real-time Statistics** - живая статистика
- **Internationalization** - поддержка языков

---

## Возможности

### Управление пользователями
- Просмотр списка пользователей с пагинацией
- Поиск и фильтрация
- Создание/редактирование/удаление
- Пополнение баланса
- Блокировка/разблокировка
- История действий

### Управление серверами
- Добавление VPN серверов
- Мониторинг статуса
- Управление пользователями на серверах
- Просмотр нагрузки
- Настройка параметров

### Управление подписками
- Создание тарифных планов
- Активация подписок
- Продление и отмена
- История подписок
- Подарочные подписки

### Платежи
- Просмотр транзакций
- Статистика доходов
- Возвраты
- Логи платежей
- Интеграция с YooKassa и NOWPayments

### Устройства
- Просмотр подключенных устройств
- Управление лимитами
- Отвязка устройств
- История подключений

### Статистика и аналитика
- DAU/WAU/MAU метрики
- Графики доходов
- LTV и Churn rate
- Конверсия
- Реферальная статистика

### Рассылки
- Массовые уведомления
- Push через Firebase
- Email рассылки
- Telegram сообщения
- Шаблоны сообщений

### ⚙️ Настройки
- Управление администраторами
- IP Whitelist
- Настройки системы
- Языки интерфейса
- Экспорт данных

---

## 🛠 Технологический стек

### Core
- **React 19.0.0** - UI библиотека
- **React DOM 19.0.0** - рендеринг
- **Create React App 5.0.1** - сборка проекта

### State Management
- **Redux Toolkit 2.5.0** - управление состоянием
- **React Redux 9.2.0** - React bindings для Redux

### Routing
- **React Router DOM 7.0.2** - клиентский роутинг

### HTTP Client
- **Axios 1.7.9** - HTTP запросы

### Styling
- **SASS 1.82.0** - препроцессор CSS
- **CSS Modules** - изоляция стилей

### UI Components
- **Lucide React** - иконки
- **React Icons** - дополнительные иконки

### Utilities
- **js-cookie** - работа с cookies
- **date-fns** - работа с датами
- **recharts** - графики и диаграммы

---

## Установка

### Требования

- Node.js 14.0 или выше
- npm 6.0 или выше (или yarn)
- Backend API запущен и доступен

### Шаг 1: Клонирование репозитория

```bash
cd vpn3_admin_frontend
```

### Шаг 2: Установка зависимостей

```bash
npm install

# Или с yarn
yarn install
```

### Шаг 3: Настройка окружения

Создай файл `.env` в корне проекта:

```bash
# API Configuration
REACT_APP_API_URL=/api
REACT_APP_BACKEND_URL=http://localhost:8000

# Environment
REACT_APP_ENV=development

# Optional: Analytics
REACT_APP_GA_ID=your_google_analytics_id
```

---

## Разработка

### Запуск dev сервера

```bash
npm start
```

Приложение откроется на `http://localhost:3000`

### Доступные скрипты

```bash
# Development сервер с hot reload
npm start

# Production build
npm run build

# Тестирование
npm test

# Анализ bundle size
npm run build && npx source-map-explorer 'build/static/js/*.js'

# Форматирование кода
npm run format

# Линтинг
npm run lint
```

---

## Структура проекта

```
vpn3_admin_frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/          # React компоненты
│   │   ├── admins/         # Управление администраторами
│   │   ├── broadcast/      # Рассылки
│   │   ├── devices/        # Устройства
│   │   ├── export/         # Экспорт данных
│   │   ├── ipWhitelist/    # IP Whitelist
│   │   ├── languages/      # Языки
│   │   ├── modals/         # Модальные окна
│   │   ├── monitoring/     # Мониторинг
│   │   ├── pagination/     # Пагинация
│   │   ├── payment/        # Платежи
│   │   ├── referals/       # Рефералы
│   │   ├── servers/        # Серверы
│   │   ├── settings/       # Настройки
│   │   ├── stats/          # Статистика
│   │   ├── subscriptions/  # Подписки
│   │   └── users/          # Пользователи
│   ├── pages/              # Страницы
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Users.jsx
│   │   └── ...
│   ├── shared/             # Общие компоненты
│   │   ├── api/           # API клиент
│   │   ├── components/    # Переиспользуемые компоненты
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Утилиты
│   │   └── constants/     # Константы
│   ├── store/              # Redux store
│   │   ├── slices/        # Redux slices
│   │   └── store.js
│   ├── styles/             # Глобальные стили
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   └── global.scss
│   ├── App.jsx             # Главный компонент
│   ├── App.scss            # Стили приложения
│   ├── index.js            # Entry point
│   └── index.css
├── .env.example            # Пример конфигурации
├── .gitignore
├── package.json
└── README.md
```

---

## Компоненты

### Основные компоненты

#### UsersComponent
Управление пользователями с пагинацией, поиском и фильтрацией.

```jsx
import UsersComponent from './components/users/UsersComponent';

<UsersComponent />
```

#### ServersComponent
Управление VPN серверами.

```jsx
import ServersComponent from './components/servers/ServersComponent';

<ServersComponent />
```

#### StatsComponent
Отображение статистики и аналитики.

```jsx
import StatsComponent from './components/stats/StatsComponent';

<StatsComponent />
```

### Модальные окна

Все модальные окна находятся в `components/modals/`:

- `AddBalanceModal` - пополнение баланса
- `CreateServerModal` - создание сервера
- `CreateSubModal` - создание подписки
- `EditUserModal` - редактирование пользователя

### Переиспользуемые компоненты

#### Pagination
```jsx
import PaginationComponent from './components/pagination/PaginationComponent';

<PaginationComponent
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

#### Loader
```jsx
import Loader from './shared/components/Loader';

{loading && <Loader />}
```

---

## State Management

### Redux Store

Используем Redux Toolkit для управления глобальным состоянием:

```javascript
// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    // другие reducers
  }
});
```

### Использование в компонентах

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from './store/slices/usersSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return <div>{/* JSX */}</div>;
};
```

---

## Стилизация

### SASS Modules

Используем CSS Modules для изоляции стилей:

```scss
// Component.module.scss
.container {
  padding: 20px;
  
  .title {
    font-size: 24px;
    color: var(--primary-color);
  }
}
```

```jsx
import styles from './Component.module.scss';

const Component = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Title</h1>
  </div>
);
```

### Глобальные переменные

```scss
// styles/variables.scss
$primary-color: #007bff;
$secondary-color: #6c757d;
$success-color: #28a745;
$danger-color: #dc3545;

$font-family: 'Inter', -apple-system, sans-serif;
$border-radius: 8px;
$box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
```

### Responsive Design

```scss
// Breakpoints
$mobile: 576px;
$tablet: 768px;
$desktop: 992px;
$wide: 1200px;

@media (max-width: $tablet) {
  .container {
    padding: 10px;
  }
}
```

---

## API Integration

### Axios Configuration

```javascript
// shared/api/axios.js
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Calls

```javascript
// shared/api/users.js
import api from './axios';

export const getUsers = (page = 1, pageSize = 20) => {
  return api.get('/users', {
    params: { page, page_size: pageSize }
  });
};

export const createUser = (userData) => {
  return api.post('/users', userData);
};

export const updateUser = (userId, userData) => {
  return api.put(`/users/${userId}`, userData);
};

export const deleteUser = (userId) => {
  return api.delete(`/users/${userId}`);
};
```

---

## Deployment

### Production Build

```bash
# Создание production build
npm run build

# Build будет создан в папке build/
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;

    root /var/www/vpn3_admin_frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Сборка и запуск
docker build -t mirnet-admin .
docker run -d -p 3000:80 mirnet-admin
```

### Environment Variables для Production

```bash
# .env.production
REACT_APP_API_URL=/api
REACT_APP_BACKEND_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

---

## Troubleshooting

### Приложение не запускается

```bash
# Очистка node_modules
rm -rf node_modules package-lock.json
npm install

# Проверка версии Node
node --version  # Должна быть >= 14

# Очистка кэша
npm cache clean --force
```

### Ошибки при сборке

```bash
# Увеличение памяти для Node
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### CORS ошибки

Убедись, что Backend настроен правильно:

```python
# Backend CORS настройки
origins = [
    "http://localhost:3000",
    "https://admin.yourdomain.com"
]
```

### 401 Unauthorized

```javascript
// Проверь токен в cookies
import Cookies from 'js-cookie';

const token = Cookies.get('access_token');
console.log('Token:', token);

// Проверь срок действия токена
// Попробуй перелогиниться
```

### Белый экран после деплоя

```bash
# Проверь пути в build
# Убедись что homepage в package.json настроен правильно

# package.json
{
  "homepage": ".",
  // ...
}
```

---

## Дополнительная документация

- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [SASS Documentation](https://sass-lang.com/documentation)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

## Best Practices

### Компоненты
- Используй функциональные компоненты с hooks
- Разделяй логику и presentation
- Делай компоненты переиспользуемыми
- Следуй принципу единственной ответственности

### State Management
- Используй Redux только для глобального состояния
- Локальное состояние храни в useState
- Избегай излишней вложенности в store

### Производительность
- Используй React.memo для тяжелых компонентов
- Оптимизируй ре-рендеры с useMemo и useCallback
- Ленивая загрузка компонентов с React.lazy

### Стилизация
- Используй CSS Modules для изоляции
- Следуй BEM naming convention
- Избегай inline styles
- Используй CSS переменные для темизации

---

<div align="center">

**[⬆ Наверх](#-mirnet-vpn---admin-panel)**

</div>
