import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './PaymentSuccessPage.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mirnet.site/api';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (!emailParam) {
      setError('Email не указан');
      setLoading(false);
      return;
    }
    
    setEmail(emailParam);
    // Проверяем статус оплаты
    checkPaymentStatus(emailParam);
  }, [searchParams]);

  const checkPaymentStatus = async (email) => {
    try {
      // Проверяем, что подписка активирована
      const response = await fetch(`${API_BASE_URL}/website/payment/success?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setSuccess(true);
        setEmail(data.email || email);
        // Пароль возвращается только если он был только что сгенерирован
        if (data.password) {
          setPassword(data.password);
        }
      } else {
        setError(data.detail || 'Ошибка проверки оплаты');
      }
    } catch (err) {
      setError('Ошибка проверки статуса оплаты');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-success-page">
        <div className="payment-success-container">
          <div className="loading">Проверка оплаты...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-success-page">
        <div className="payment-success-container">
          <div className="error-message">
            <h2>❌ Ошибка</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/payment')}>Вернуться к оплате</button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="payment-success-page">
        <div className="payment-success-container">
            <div className="success-content">
            <div className="success-icon">✅</div>
            <h1>Здравствуйте!</h1>
            <p className="success-message">
              Ваша оплата успешно обработана. Ваша подписка активирована и готова к использованию.
            </p>
            
            {password && (
              <div className="credentials-box">
                <h3>📧 Ваши данные для входа в личный кабинет:</h3>
                <div className="credential-item">
                  <div className="credential-label">Email:</div>
                  <div className="credential-value">{email}</div>
                </div>
                <div className="credential-item">
                  <div className="credential-label">Пароль:</div>
                  <div className="password-box">{password}</div>
                </div>
              </div>
            )}
            
            <div className="button-container">
              <button 
                className="login-button"
                onClick={() => navigate('/login')}
              >
                Войти в личный кабинет
              </button>
            </div>
            
            {password && (
              <div className="subscription-info">
                <p><strong>📅 Подписка активна на:</strong> 1 месяцев</p>
              </div>
            )}
            
            {!password && (
              <p className="note-message">
                Мы отправили вам письмо на <strong>{email}</strong> с данными для входа в личный кабинет.
                ⚠️ Если письмо не пришло, проверьте папку "Спам".
              </p>
            )}
            
            <div className="instructions">
              <h2>Что делать дальше?</h2>
              
              <div className="instruction-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Проверьте почту</h3>
                  <p>На адрес <strong>{email}</strong> отправлено письмо с паролем для входа в личный кабинет.</p>
                  <p className="note">⚠️ Если письмо не пришло, проверьте папку "Спам".</p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Войдите в личный кабинет</h3>
                  <p>Используйте ваш email и пароль из письма для входа:</p>
                  <button 
                    className="login-button"
                    onClick={() => navigate('/login')}
                  >
                    Войти в личный кабинет
                  </button>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Скачайте приложение</h3>
                  <p>В личном кабинете вы сможете скачать приложение для вашего устройства:</p>
                  <ul>
                    <li>📱 iOS (iPhone/iPad)</li>
                    <li>🤖 Android</li>
                    <li>🪟 Windows</li>
                    <li>🍎 macOS</li>
                  </ul>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Подключитесь к VPN</h3>
                  <p>После установки приложения:</p>
                  <ol>
                    <li>Откройте приложение</li>
                    <li>Войдите используя email и пароль из письма</li>
                    <li>Выберите сервер и страну подключения</li>
                    <li>Нажмите кнопку "Подключить"</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="support-info">
              <h3>Нужна помощь?</h3>
              <p>Если у вас возникли вопросы, обратитесь в поддержку:</p>
              <p className="support-link">
                Telegram: <a href="https://t.me/MirNetVpn" target="_blank" rel="noopener noreferrer">@MirNetVpn</a>
              </p>
            </div>

            <div className="actions">
              <button 
                className="primary-button"
                onClick={() => navigate('/login')}
              >
                Войти в личный кабинет
              </button>
              <button 
                className="secondary-button"
                onClick={() => navigate('/')}
              >
                На главную
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccessPage;

