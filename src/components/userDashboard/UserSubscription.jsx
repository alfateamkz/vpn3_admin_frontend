import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserSubscription.scss';

const UserSubscription = ({ userInfo }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = userInfo?.sub_end_date ? getDaysRemaining(userInfo.sub_end_date) : null;

  return (
    <div className="user-subscription">
      <h2>Моя подписка</h2>

      {userInfo?.is_premium ? (
        <div className="subscription-card active">
          <div className="subscription-header">
            <div className="status-badge active">
              {userInfo.is_trial ? 'Пробный период' : 'Активна'}
            </div>
          </div>

          <div className="subscription-info">
            <div className="info-item">
              <span className="label">Статус:</span>
              <span className="value success">Активна</span>
            </div>

            {userInfo.sub_end_date && (
              <>
                <div className="info-item">
                  <span className="label">Действует до:</span>
                  <span className="value">{formatDate(userInfo.sub_end_date)}</span>
                </div>

                {daysRemaining !== null && (
                  <div className="info-item">
                    <span className="label">Осталось дней:</span>
                    <span className={`value ${daysRemaining > 7 ? 'success' : daysRemaining > 0 ? 'warning' : 'error'}`}>
                      {daysRemaining > 0 ? daysRemaining : 'Истекла'}
                    </span>
                  </div>
                )}
              </>
            )}

            {userInfo.is_trial && (
              <div className="trial-notice">
                <p>Вы используете пробный период. Оплатите подписку для продолжения использования.</p>
              </div>
            )}
          </div>

          <div className="subscription-actions">
            <button
              className="upgrade-btn"
              onClick={() => navigate('/payment')}
            >
              Продлить подписку
            </button>
          </div>
        </div>
      ) : (
        <div className="subscription-card inactive">
          <div className="subscription-header">
            <div className="status-badge inactive">Неактивна</div>
          </div>

          <div className="subscription-info">
            <p className="no-subscription">
              У вас нет активной подписки. Оформите подписку для доступа к VPN.
            </p>
          </div>

          <div className="subscription-actions">
            <button
              className="subscribe-btn"
              onClick={() => navigate('/payment')}
            >
              Оформить подписку
            </button>
          </div>
        </div>
      )}

      {userInfo?.balance !== undefined && userInfo.balance > 0 && (
        <div className="balance-card">
          <div className="balance-info">
            <span className="label">Баланс:</span>
            <span className="value">{userInfo.balance} ₽</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSubscription;

