import React, { useState, useEffect } from "react";
import "./AdminActionsComponent.scss";
import { apiRequests } from "../../shared/api/apiRequests";
import { canEditUsers } from "../../shared/utils/roleUtils";
import { formatDateTimeMoscow } from "../../shared/utils/dateUtils";

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
    console.log("🔄 Загружаем логи действий администраторов...");
    try {
      const response = await apiRequests.adminActions.list(currentPage, limit, filters);
      console.log("✅ Логи действий получены:", response);
      
      // Данные находятся в response.data.data, а не в response.data
      const data = response.data.data || response.data;
      console.log("📊 Список действий:", data.actions);
      console.log("📈 Общее количество:", data.total);
      
      setActions(data.actions || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("❌ Ошибка при загрузке логов:", error);
      console.error("📋 Детали ошибки:", error.response?.data);
      console.error("🔢 Статус ошибки:", error.response?.status);
      alert("Ошибка при загрузке логов действий");
      setActions([]);
      setTotalCount(0);
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

  const translateAction = (action) => {
    const translations = {
      "block_user": "Блокировка пользователя",
      "unblock_user": "Разблокировка пользователя",
      "admin_login_success": "Успешный вход",
      "admin_login_failed": "Неудачный вход",
      "broadcast_message": "Массовая рассылка",
      "send_broadcast": "Отправка рассылки",
      "send_broadcast_with_photo": "Отправка рассылки с фото",
      "broadcast_push_notifications": "Массовая рассылка push-уведомлений",
      "delete_server": "Удаление сервера",
      "create_server": "Создание сервера",
      "update_server": "Обновление сервера",
      "delete_device": "Отвязка устройства",
      "export_users_csv": "Экспорт пользователей",
      "export_orders_csv": "Экспорт заказов",
      "export_payment_logs_csv": "Экспорт логов платежей",
      "export_admin_logs_csv": "Экспорт логов администраторов",
      "update_alert_settings": "Обновление настроек алертов",
      "resolve_alert": "Решение алерта",
      "dismiss_alert": "Отклонение алерта",
      "approve_payout": "Одобрение вывода средств",
      "reject_payout": "Отклонение вывода средств",
      "create_payout_request": "Создание заявки на вывод",
      "push_balance": "Пополнение баланса",
      "remove_balance": "Списание баланса",
      "remove_premium": "Снятие премиум подписки",
      "create_backup": "Создание резервной копии",
      "restore_backup": "Восстановление из резервной копии",
      "import_users_csv": "Импорт пользователей",
    };
    return translations[action] || action;
  };

  const translateTargetType = (targetType) => {
    const translations = {
      "user": "Пользователь",
      "server": "Сервер",
      "admin": "Администратор",
      "export": "Экспорт",
      "settings": "Настройки",
      "payout": "Вывод средств",
    };
    return translations[targetType] || targetType;
  };

  const translateRole = (role) => {
    const translations = {
      "super_admin": "Супер администратор",
      "admin": "Администратор",
      "analyst": "Аналитик",
      "moderator": "Модератор",
    };
    return translations[role] || role;
  };

  const getSuccessIcon = (success) => {
    return success ? "✅" : "❌";
  };

  if (!canEditUsers()) {
    return (
      <div className="admin-actions-container">
        <h2>📊 Логи действий администраторов</h2>
        <div style={{ padding: "40px", textAlign: "center", color: "#dc3545", fontWeight: "bold", fontSize: "18px" }}>
          У вас нет доступа к просмотру логов действий администраторов
        </div>
      </div>
    );
  }

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
                      ? formatDateTimeMoscow(action.created_at)
                      : "—"}
                  </td>
                  <td>
                    {getActionIcon(action.action)} {translateAction(action.action)}
                  </td>
                  <td>{action.admin_email}</td>
                  <td>{translateRole(action.admin_role)}</td>
                  <td>
                    {action.target_type && (
                      <>
                        {translateTargetType(action.target_type)}
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

