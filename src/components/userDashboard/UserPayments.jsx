import React, { useState, useEffect } from 'react';
import './UserPayments.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mirnet.site/api';

const UserPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('user_access_token');
      const response = await fetch(`${API_BASE_URL}/website/user/payments?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки платежей');
      }

      const data = await response.json();
      setPayments(data.payments || []);
      setTotalPages(Math.ceil((data.count || 0) / 20));
    } catch (err) {
      setError('Ошибка загрузки платежей');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };

  const getStatusBadge = (status) => {
    const statuses = {
      'FINISHED': { text: 'Завершен', class: 'success' },
      'PENDING': { text: 'Ожидает', class: 'pending' },
      'FAILED': { text: 'Ошибка', class: 'error' },
      'CANCELLED': { text: 'Отменен', class: 'cancelled' },
    };
    return statuses[status] || { text: status, class: 'unknown' };
  };

  const getPaymentType = (type) => {
    const types = {
      'yookassa': 'ЮKassa',
      'crypto': 'Криптовалюта',
      'telegram': 'Telegram',
    };
    return types[type] || type;
  };

  if (loading) {
    return <div className="loading">Загрузка платежей...</div>;
  }

  return (
    <div className="user-payments">
      <h2>История платежей</h2>
      {error && <div className="error-message">{error}</div>}
      
      {payments.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет платежей</p>
        </div>
      ) : (
        <>
          <div className="payments-list">
            {payments.map((payment) => {
              const statusInfo = getStatusBadge(payment.status);
              return (
                <div key={payment.id} className="payment-card">
                  <div className="payment-header">
                    <div className="payment-info">
                      <h3>{payment.description || 'Платеж'}</h3>
                      <p className="payment-date">{formatDate(payment.created_at)}</p>
                    </div>
                    <div className="payment-amount">
                      <span className="amount">{payment.amount} ₽</span>
                      <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  <div className="payment-details">
                    <div className="detail-item">
                      <span className="label">Тип оплаты:</span>
                      <span className="value">{getPaymentType(payment.type)}</span>
                    </div>
                    {payment.payment_id && (
                      <div className="detail-item">
                        <span className="label">ID платежа:</span>
                        <span className="value">{payment.payment_id}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="page-btn"
              >
                Назад
              </button>
              <span className="page-info">
                Страница {page} из {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="page-btn"
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserPayments;

