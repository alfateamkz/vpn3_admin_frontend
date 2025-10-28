import React, { useState, useEffect } from "react";
import "./IPWhitelistComponent.scss";
import { apiRequests } from "../../shared/api/apiRequests";

export const IPWhitelistComponent = () => {
  const [ipList, setIpList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    console.log("🔄 Загружаем данные IP whitelist...");
    try {
      const response = await apiRequests.ipWhitelist.list(currentPage, limit);
      console.log("✅ IP Whitelist response получен:", response);
      
      // Данные находятся в response.data.data, а не в response.data
      const data = response.data.data || response.data;
      console.log("📊 IP список:", data.ips);
      console.log("📈 Общее количество:", data.total);
      
      setIpList(data.ips || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("❌ Ошибка при загрузке данных:", error);
      console.error("📋 Детали ошибки:", error.response?.data);
      console.error("🔢 Статус ошибки:", error.response?.status);
      const errorMessage = error.response?.data?.detail || error.message || "Ошибка при загрузке списка IP";
      alert(errorMessage);
      setIpList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit]);

  const handleAddIP = async () => {
    if (!ipAddress) {
      alert("Введите IP адрес");
      return;
    }

    setLoading(true);
    try {
      await apiRequests.ipWhitelist.add(ipAddress, description);
      alert("IP успешно добавлен в белый список");
      setIsModalOpen(false);
      setIpAddress("");
      setDescription("");
      // Принудительно обновляем данные
      setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error("Ошибка при добавлении IP:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Ошибка при добавлении IP";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveIP = async (ip) => {
    if (!window.confirm(`Удалить IP ${ip.ip_address} из белого списка?`)) {
      return;
    }

    setLoading(true);
    try {
      await apiRequests.ipWhitelist.remove(ip.ip_address);
      alert("IP удален из белого списка");
      fetchData();
    } catch (error) {
      console.error("Ошибка при удалении IP:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Ошибка при удалении IP";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIP = async (ip) => {
    setLoading(true);
    try {
      await apiRequests.ipWhitelist.toggle(ip.ip_address, !ip.is_active);
      fetchData();
    } catch (error) {
      console.error("Ошибка при изменении статуса IP:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Ошибка при изменении статуса IP";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ip-whitelist-container">
      <div className="header-bar">
        <h2>🔐 IP Белый список</h2>
        <button
          className="add-button"
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          + Добавить IP
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Добавить IP в белый список</h3>
            <input
              type="text"
              placeholder="IP адрес"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Описание (опционально)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleAddIP} disabled={loading}>
                Добавить
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIpAddress("");
                  setDescription("");
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="ip-table">
        <thead>
          <tr>
            <th>IP Адрес</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Дата добавления</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {ipList.map((ip) => (
            <tr key={ip.id}>
              <td>{ip.ip_address}</td>
              <td>{ip.description || "—"}</td>
              <td>
                <span
                  className={ip.is_active ? "status-active" : "status-inactive"}
                >
                  {ip.is_active ? "✅ Активен" : "❌ Неактивен"}
                </span>
              </td>
              <td>
                {ip.created_at
                  ? new Date(ip.created_at).toLocaleString()
                  : "—"}
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleToggleIP(ip)}
                    className={ip.is_active ? "btn-inactive" : "btn-active"}
                  >
                    {ip.is_active ? "Деактивировать" : "Активировать"}
                  </button>
                  <button
                    onClick={() => handleRemoveIP(ip)}
                    className="btn-delete"
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ipList.length === 0 && !loading && (
        <div className="empty-state">
          <p>📋 Список IP адресов пуст</p>
          <p>Добавьте IP адреса в белый список для управления доступом к админ-панели</p>
        </div>
      )}

      <div className="pagination-info">
        <p>Страница {currentPage} из {Math.ceil(totalCount / limit)}</p>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            ← Назад
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalCount / limit) || loading}
          >
            Вперед →
          </button>
        </div>
      </div>
    </div>
  );
};

