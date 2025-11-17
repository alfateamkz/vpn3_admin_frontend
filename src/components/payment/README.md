# Компонент оплаты VPN MirNet

Этот компонент можно использовать как отдельную страницу или встроить в Tilda.

## Роут для страницы оплаты

Страница оплаты доступна по адресу:
- **Локально**: `http://localhost:3000/payment`
- **Продакшн**: `https://your-domain.com/payment`

## Использование как отдельная страница

Компонент уже добавлен в роуты приложения (`/payment`).

Если нужно использовать в другом месте:
```jsx
import PaymentPage from './components/payment/PaymentPage';

function App() {
  return <PaymentPage />;
}
```

## Интеграция в Tilda

1. Соберите компонент:
```bash
npm run build
```

2. Скопируйте файлы из `build/static/js/` и `build/static/css/` на ваш сервер

3. В Tilda добавьте HTML блок с:
```html
<div id="payment-root"></div>
<script src="https://your-domain.com/static/js/payment.js"></script>
```

4. Или используйте iframe:
```html
<iframe 
  src="https://your-domain.com/payment" 
  width="100%" 
  height="800px"
  frameborder="0"
></iframe>
```

## Настройка API URL

Установите переменную окружения:
```bash
REACT_APP_API_URL=https://api.mirnet.site/api
```

Или измените `API_BASE_URL` в `PaymentPage.jsx`

## API Endpoints

Компонент использует следующие endpoints:
- `GET /api/website/subs/list` - список тарифов
- `POST /api/website/user/create` - создание/поиск пользователя
- `POST /api/website/payment/create` - создание платежа

