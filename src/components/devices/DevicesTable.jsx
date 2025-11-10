import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDateMoscow } from "../../shared/utils/dateUtils";

export const DevicesTable = ({ devices, onDelete }) => {
  const navigate = useNavigate();
  if (!devices || devices.length === 0) {
    return <div className="no-data">Нет устройств</div>;
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      ios: "📱",
      android: "🤖",
      windows: "🪟",
      macos: "🍎",
      linux: "🐧",
    };
    return icons[platform?.toLowerCase()] || "💻";
  };

  return (
    <div className="devices-table-container">
      <table className="devices-table">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Платформа</th>
            <th>Модель</th>
            <th>Страна</th>
            <th>IP</th>
            <th>Последняя активность</th>
            <th>Создано</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device._id || device.id}>
              <td>
                <div className="user-info">
                  {device.user_id ? (
                    <a
                      href={`/users/${device.user_id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/users/${device.user_id}`);
                      }}
                      style={{ 
                        textDecoration: "none", 
                        color: "#1890ff",
                        cursor: "pointer"
                      }}
                    >
                      <strong>
                        {device.user?.first_name || "—"} {device.user?.last_name || ""}
                      </strong>
                      {device.user?.username && (
                        <span className="username"> {device.user.username}</span>
                      )}
                    </a>
                  ) : (
                    <>
                      <strong>
                        {device.user?.first_name || "—"} {device.user?.last_name || ""}
                      </strong>
                      {device.user?.username && (
                        <span className="username">{device.user.username}</span>
                      )}
                    </>
                  )}
                </div>
              </td>
              <td>
                <div className="platform-cell">
                  <span className="platform-icon">{getPlatformIcon(device.platform)}</span>
                  <span className="platform-name">{device.platform || "—"}</span>
                </div>
              </td>
              <td>{device.model || "—"}</td>
              <td>
                <span className="country-badge">{device.country || "Unknown"}</span>
              </td>
              <td className="ip-address">{device.ip_address || "—"}</td>
              <td>{formatDateMoscow(device.last_activity)}</td>
              <td>{formatDateMoscow(device.created_at)}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(device._id || device.id)}
                  title="Отвязать устройство (удалить токен, сбросить сессию)"
                >
                  🔓 Отвязать
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
