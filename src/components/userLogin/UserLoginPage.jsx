import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLoginPage.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mirnet.site/api';

const UserLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/website/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Сохраняем токены в localStorage
        localStorage.setItem('user_access_token', data.access_token);
        localStorage.setItem('user_refresh_token', data.refresh_token);
        localStorage.setItem('user_id', data.user_id);

        // Перенаправляем на дашборд
        window.location.href = '/dashboard';
      } else {
        setError(data.detail || 'Ошибка входа. Проверьте email и пароль.');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу. Попробуйте позже.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Вход в личный кабинет</h1>
          <p>Введите ваши данные для доступа к конфигурациям VPN</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Нет аккаунта?{' '}
            <a href="/payment" className="link">
              Оплатить подписку
            </a>
          </p>
          <p className="help-text">
            Пароль был отправлен на ваш email после оплаты подписки
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;

