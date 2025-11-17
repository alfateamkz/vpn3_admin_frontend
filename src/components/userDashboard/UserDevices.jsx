import React, { useState, useEffect } from 'react';
import './UserDevices.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mirnet.site/api';

const UserDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [deviceLink, setDeviceLink] = useState(null);
  const [linkLoading, setLinkLoading] = useState(false);

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

  const handleAddDevice = () => {
    if (devices.length >= 3) {
      setError('Достигнут лимит устройств (3). Удалите одно из устройств перед добавлением нового.');
      return;
    }
    setShowAddModal(true);
    setSelectedPlatform(null);
    setDeviceLink(null);
  };

  const handleSelectPlatform = async (platform) => {
    setSelectedPlatform(platform);
    setLinkLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('user_access_token');
      const response = await fetch(`${API_BASE_URL}/website/user/device-link?platform=${platform}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Ошибка генерации ссылки');
      }

      const data = await response.json();
      setDeviceLink(data);
    } catch (err) {
      setError(err.message || 'Ошибка генерации ссылки');
      console.error('Error generating device link:', err);
    } finally {
      setLinkLoading(false);
    }
  };

  const copyLink = () => {
    if (deviceLink?.link) {
      navigator.clipboard.writeText(deviceLink.link).then(() => {
        alert('Ссылка скопирована в буфер обмена');
      });
    }
  };

  const generateQRCode = (text) => {
    // Простая генерация QR через API (можно использовать библиотеку qrcode.react)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  const platforms = [
    { id: 'android', name: 'Android', icon: '📱' },
    { id: 'ios', name: 'iOS', icon: '🍎' },
    { id: 'windows', name: 'Windows', icon: '🪟' },
  ];

  if (loading) {
    return <div className="loading">Загрузка устройств...</div>;
  }

  return (
    <div className="user-devices">
      <div className="devices-header">
        <h2>Мои устройства</h2>
        <button
          className="add-device-btn"
          onClick={handleAddDevice}
          disabled={devices.length >= 3}
        >
          + Привязать устройство
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {devices.length >= 3 && (
        <div className="limit-warning">
          ⚠️ Достигнут лимит устройств (3). Удалите одно из устройств для добавления нового.
        </div>
      )}
      
      {devices.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет зарегистрированных устройств</p>
          <button className="add-device-btn-primary" onClick={handleAddDevice}>
            Привязать первое устройство
          </button>
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

      {/* Модальное окно для привязки устройства */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Привязать устройство</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            {!selectedPlatform ? (
              <div className="platform-selection">
                <p>Выберите платформу вашего устройства:</p>
                <div className="platforms-grid">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      className="platform-btn"
                      onClick={() => handleSelectPlatform(platform.id)}
                    >
                      <span className="platform-icon-large">{platform.icon}</span>
                      <span>{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="device-link-section">
                {linkLoading ? (
                  <div className="loading">Генерация ссылки...</div>
                ) : deviceLink ? (
                  <>
                    <div className="instructions">
                      <h4>Инструкция по привязке:</h4>
                      <div className="instructions-text">
                        {deviceLink.instructions.split('\n').map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    </div>

                    <div className="qr-section">
                      <div className="qr-code">
                        <img
                          src={generateQRCode(deviceLink.link)}
                          alt="QR код для привязки устройства"
                        />
                      </div>
                      <p className="qr-hint">Отсканируйте QR-код на вашем устройстве</p>
                    </div>

                    <div className="link-section">
                      <label>Или скопируйте ссылку:</label>
                      <div className="link-input-group">
                        <input
                          type="text"
                          value={deviceLink.link}
                          readOnly
                          className="link-input"
                        />
                        <button className="copy-btn" onClick={copyLink}>
                          Копировать
                        </button>
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button
                        className="back-btn"
                        onClick={() => {
                          setSelectedPlatform(null);
                          setDeviceLink(null);
                        }}
                      >
                        Назад
                      </button>
                      <button
                        className="close-modal-btn"
                        onClick={() => {
                          setShowAddModal(false);
                          setSelectedPlatform(null);
                          setDeviceLink(null);
                          fetchDevices(); // Обновляем список после привязки
                        }}
                      >
                        Закрыть
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="error-message">
                    Не удалось сгенерировать ссылку. Попробуйте еще раз.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDevices;

