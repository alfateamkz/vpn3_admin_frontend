import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.scss';
import UserDevices from './UserDevices';
import UserConfigs from './UserConfigs';
import UserSubscription from './UserSubscription';
import UserPayments from './UserPayments';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mirnet.site/api';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('devices');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchUserInfo();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('user_access_token');
    if (!token) {
      navigate('/login');
      return;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('user_access_token');
      const response = await fetch(`${API_BASE_URL}/website/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('user_access_token');
        localStorage.removeItem('user_refresh_token');
        localStorage.removeItem('user_id');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }

      const data = await response.json();
      setUserInfo(data);
    } catch (err) {
      setError('Ошибка загрузки данных пользователя');
      console.error('Error fetching user info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_access_token');
    localStorage.removeItem('user_refresh_token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Личный кабинет</h1>
          <div className="user-info">
            {userInfo && (
              <>
                <span className="user-email">{userInfo.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          Устройства
        </button>
        <button
          className={`tab ${activeTab === 'configs' ? 'active' : ''}`}
          onClick={() => setActiveTab('configs')}
        >
          Конфигурации VPN
        </button>
        <button
          className={`tab ${activeTab === 'subscription' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscription')}
        >
          Подписка
        </button>
        <button
          className={`tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          История платежей
        </button>
      </div>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        {activeTab === 'devices' && <UserDevices />}
        {activeTab === 'configs' && <UserConfigs />}
        {activeTab === 'subscription' && <UserSubscription userInfo={userInfo} />}
        {activeTab === 'payments' && <UserPayments />}
      </div>
    </div>
  );
};

export default UserDashboard;

