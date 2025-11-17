import React, { useState, useEffect } from 'react';
import './UserDevices.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mirnet.site/api';

const UserDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('user_access_token');
      const response = await fetch(`${API_BASE_URL}/devices/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки устройств');
      }

      const data = await response.json();
      setDevices(data.devices || []);
    } catch (err) {
      setError('Ошибка загрузки устройств');
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    if (!window.confirm('Вы уверены, что хотите удалить это устройство?')) {
      return;
    }

    try {
      const token = localStorage.getItem('user_access_token');
      const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления устройства');
      }

      // Обновляем список
      fetchDevices();
    } catch (err) {
      setError('Ошибка удаления устройства');
      console.error('Error deleting device:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      android: '📱',
      ios: '🍎',
      windows: '🪟',
      macos: '💻',
      linux: '🐧',
    };
    return icons[platform?.toLowerCase()] || '📱';
  };

  if (loading) {
    return <div className="loading">Загрузка устройств...</div>;
  }

  return (
    <div className="user-devices">
      <h2>Мои устройства</h2>
      {error && <div className="error-message">{error}</div>}
      
      {devices.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет зарегистрированных устройств</p>
        </div>
      ) : (
        <div className="devices-list">
          {devices.map((device) => (
            <div key={device._id} className="device-card">
              <div className="device-header">
                <div className="device-info">
                  <span className="platform-icon">{getPlatformIcon(device.platform)}</span>
                  <div>
                    <h3>{device.model || 'Неизвестное устройство'}</h3>
                    <p className="platform">{device.platform || 'Неизвестная платформа'}</p>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteDevice(device.device_id)}
                >
                  Удалить
                </button>
              </div>
              
              <div className="device-details">
                <div className="detail-item">
                  <span className="label">ID устройства:</span>
                  <span className="value">{device.device_id}</span>
                </div>
                {device.os_version && (
                  <div className="detail-item">
                    <span className="label">Версия ОС:</span>
                    <span className="value">{device.os_version}</span>
                  </div>
                )}
                {device.last_activity && (
                  <div className="detail-item">
                    <span className="label">Последняя активность:</span>
                    <span className="value">{formatDate(device.last_activity)}</span>
                  </div>
                )}
                {device.country && (
                  <div className="detail-item">
                    <span className="label">Страна:</span>
                    <span className="value">{device.country}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDevices;

