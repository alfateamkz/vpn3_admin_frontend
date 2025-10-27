import React, { useState, useEffect } from "react";
import "./AdminActionsComponent.scss";
import { apiRequests } from "../../shared/api/apiRequests";

export const AdminActionsComponent = () => {
  const [actions, setActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    action: "",
    target_type: "",
    admin_id: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await apiRequests.adminActions.list(currentPage, limit, filters);
      setActions(data.actions || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("Ошибка при загрузке логов:", error);
      alert("Ошибка при загрузке логов действий");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getActionIcon = (action) => {
    if (action.includes("block")) return "🚫";
    if (action.includes("unblock")) return "🔓";
    if (action.includes("login")) return "🔐";
    if (action.includes("broadcast")) return "📧";
    if (action.includes("delete")) return "🗑️";
    return "📝";
  };

  const getSuccessIcon = (success) => {
    return success ? "✅" : "❌";
  };

  return (
    <div className="admin-actions-container">
      <h2>📊 Логи действий администраторов</h2>

      <div className="filters">
        <div className="filter-group">
          <label>Действие:</label>
          <input
            type="text"
            value={filters.action}
            onChange={(e) => handleFilterChange("action", e.target.value)}
            placeholder="block_user, unblock_user, etc."
          />
        </div>
        <div className="filter-group">
          <label>Тип цели:</label>
          <input
            type="text"
            value={filters.target_type}
            onChange={(e) => handleFilterChange("target_type", e.target.value)}
            placeholder="user, server, etc."
          />
        </div>
        <div className="filter-group">
          <label>ID Администратора:</label>
          <input
            type="text"
            value={filters.admin_id}
            onChange={(e) => handleFilterChange("admin_id", e.target.value)}
            placeholder="ID админа"
          />
        </div>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <table className="actions-table">
            <thead>
              <tr>
                <th>Время</th>
                <th>Действие</th>
                <th>Администратор</th>
                <th>Роль</th>
                <th>Цель</th>
                <th>IP Адрес</th>
                <th>Результат</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action) => (
                <tr key={action.id}>
                  <td>
                    {action.created_at
                      ? new Date(action.created_at).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    {getActionIcon(action.action)} {action.action}
                  </td>
                  <td>{action.admin_email}</td>
                  <td>{action.admin_role}</td>
                  <td>
                    {action.target_type && (
                      <>
                        {action.target_type}
                        {action.target_id && ` (${action.target_id.slice(0, 8)}...)`}
                      </>
                    )}
                  </td>
                  <td>{action.ip_address || "—"}</td>
                  <td>
                    {getSuccessIcon(action.success)}
                    {!action.success && action.error_message && (
                      <span className="error-message" title={action.error_message}>
                        {" "}
                        {action.error_message}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-info">
            <p>
              Страница {currentPage} из {Math.ceil(totalCount / limit)} (Всего:{" "}
              {totalCount})
            </p>
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
        </>
      )}
    </div>
  );
};

