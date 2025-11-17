import React, { useState, useEffect } from 'react';
import './PaymentPage.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mirnet.site/api';

const PaymentPage = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('yookassa'); // 'yookassa' или 'crypto'
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referalCode, setReferalCode] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/website/subs/list`);
      const data = await response.json();
      if (data.status === 'success') {
        setSubs(data.subs);
        
        // Проверяем, есть ли сумма из GET-параметра
        const urlParams = new URLSearchParams(window.location.search);
        const priceParam = urlParams.get('price');
        
        if (priceParam) {
          // Пытаемся найти тариф по сумме
          const price = parseFloat(priceParam);
          if (!isNaN(price)) {
            const foundSub = data.subs.find(sub => Math.abs(sub.price - price) < 0.01);
            if (foundSub) {
              // Если тариф с такой суммой найден, выбираем его
              setSelectedSub(foundSub.id);
            } else if (data.subs.length > 0) {
              // Если не найден, выбираем первый тариф
              setSelectedSub(data.subs[0].id);
            }
          } else if (data.subs.length > 0) {
            // Если price не число, выбираем первый тариф
            setSelectedSub(data.subs[0].id);
          }
        } else if (data.subs.length > 0) {
          // Если параметра нет, выбираем первый тариф
          setSelectedSub(data.subs[0].id);
        }
      }
    } catch (err) {
      setError('Ошибка загрузки тарифов');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // Сначала создаем/находим пользователя
      const userResponse = await fetch(`${API_BASE_URL}/website/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: firstName || null,
          last_name: lastName || null,
          referal_code: referalCode || null,
        }),
      });

      const userData = await userResponse.json();
      if (userData.status !== 'exists' && userData.status !== 'created') {
        throw new Error('Ошибка создания пользователя');
      }

      // Создаем платеж
      const paymentResponse = await fetch(`${API_BASE_URL}/website/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          sub_id: selectedSub,
          payment_method: paymentMethod,
        }),
      });

      const paymentData = await paymentResponse.json();
      if (paymentData.status === 'success') {
        // Перенаправляем на страницу оплаты
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error(paymentData.detail || 'Ошибка создания платежа');
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при создании платежа');
      setProcessing(false);
    }
  };

  const selectedSubData = subs.find(s => s.id === selectedSub);

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="loading">Загрузка тарифов...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Безопасный интернет с VPN MirNet</h1>
          <p>Обеспечиваем максимальный комфорт и скорость в сети с VPN Mirnet</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-section">
            <h2>Выберите тариф</h2>
            <div className="subs-list">
              {subs.map((sub) => (
                <div
                  key={sub.id}
                  className={`sub-card ${selectedSub === sub.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSub(sub.id)}
                >
                  <div className="sub-duration">{sub.duration_months} {sub.duration_months === 1 ? 'месяц' : sub.duration_months < 5 ? 'месяца' : 'месяцев'}</div>
                  <div className="sub-price">{sub.price} ₽</div>
                </div>
              ))}
            </div>
            {subs.length === 0 && (
              <div className="no-subs-message">
                Тарифы временно недоступны
              </div>
            )}
          </div>

          <div className="form-section">
            <h2>Ваши данные</h2>
            <div className="form-row">
              <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={processing}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Имя"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={processing}
              />
              <input
                type="text"
                placeholder="Фамилия"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={processing}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Реферальный код (необязательно)"
                value={referalCode}
                onChange={(e) => setReferalCode(e.target.value)}
                disabled={processing}
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Способ оплаты</h2>
            <div className="payment-methods">
              <label className={`payment-method ${paymentMethod === 'yookassa' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="yookassa"
                  checked={paymentMethod === 'yookassa'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={processing}
                />
                <span>Банковская карта (ЮКасса)</span>
              </label>
              <label className={`payment-method ${paymentMethod === 'crypto' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="crypto"
                  checked={paymentMethod === 'crypto'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={processing}
                />
                <span>Криптовалюта (NOWPayments)</span>
              </label>
            </div>
          </div>

          {selectedSubData && (
            <div className="payment-summary">
              <div className="summary-row">
                <span>Тариф:</span>
                <span>{selectedSubData.duration_months} {selectedSubData.duration_months === 1 ? 'месяц' : selectedSubData.duration_months < 5 ? 'месяца' : 'месяцев'}</span>
              </div>
              <div className="summary-row total">
                <span>Итого:</span>
                <span>{selectedSubData.price} ₽</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="payment-button"
            disabled={processing || !selectedSub || !email}
          >
            {processing ? 'Обработка...' : 'Оплатить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;

