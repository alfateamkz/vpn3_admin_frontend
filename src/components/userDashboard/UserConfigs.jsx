import React, { useState, useEffect } from 'react';
import './UserConfigs.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mirnet.site/api';

const UserConfigs = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const token = localStorage.getItem('user_access_token');
      const response = await fetch(`${API_BASE_URL}/servers/app?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки серверов');
      }

      const data = await response.json();
      setServers(data.servers || []);
    } catch (err) {
      setError('Ошибка загрузки серверов');
      console.error('Error fetching servers:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, serverId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(serverId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getCountryFlag = (country) => {
    // Простая эмодзи-карта стран
    const flags = {
      'RU': '🇷🇺',
      'US': '🇺🇸',
      'DE': '🇩🇪',
      'NL': '🇳🇱',
      'FR': '🇫🇷',
      'GB': '🇬🇧',
      'JP': '🇯🇵',
      'SG': '🇸🇬',
    };
    return flags[country] || '🌍';
  };

  if (loading) {
    return <div className="loading">Загрузка серверов...</div>;
  }

  return (
    <div className="user-configs">
      <h2>Конфигурации VPN</h2>
      {error && <div className="error-message">{error}</div>}
      
      {servers.length === 0 ? (
        <div className="empty-state">
          <p>Серверы временно недоступны</p>
        </div>
      ) : (
        <div className="servers-list">
          {servers.map((server) => (
            <div key={server.server_id} className="server-card">
              <div className="server-header">
                <div className="server-info">
                  <span className="country-flag">
                    {getCountryFlag(server.country)}
                  </span>
                  <div>
                    <h3>{server.country || 'Неизвестная страна'}</h3>
                    <p className="server-name">{server.name || server.server_id}</p>
                  </div>
                </div>
                {server.is_active && (
                  <span className="status-badge active">Активен</span>
                )}
              </div>

              {server.connect_link ? (
                <div className="config-section">
                  <div className="config-header">
                    <span className="config-label">Конфигурация:</span>
                    <button
                      className={`copy-btn ${copiedId === server.server_id ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(server.connect_link, server.server_id)}
                    >
                      {copiedId === server.server_id ? '✓ Скопировано' : 'Копировать'}
                    </button>
                  </div>
                  <div className="config-link">
                    <code>{server.connect_link}</code>
                  </div>
                </div>
              ) : (
                <div className="no-config">
                  <p>Конфигурация недоступна</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserConfigs;

