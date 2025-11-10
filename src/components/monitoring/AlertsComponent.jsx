import React, { useState, useEffect } from "react";
import styles from "./AlertsComponent.module.scss";
import { apiRequests } from "../../shared/api/apiRequests";
import { PaginationControls } from "../pagination/PaginationComponent";
import { formatDateTimeMoscow } from "../../shared/utils/dateUtils";

const severityColors = {
  low: "#2196F3",
  medium: "#FF9800",
  high: "#F44336",
  critical: "#9C27B0",
};

const severityLabels = {
  low: "Низкая",
  medium: "Средняя",
  high: "Высокая",
  critical: "Критическая",
};

const alertTypeLabels = {
  user_churn: "Отток пользователей",
  suspicious_activity: "Подозрительная активность",
  registration_spike: "Рост регистраций",
};

const statusLabels = {
  active: "Активный",
  resolved: "Разрешен",
  dismissed: "Отклонен",
};

const AlertsComponent = () => {
  const [alerts, setAlerts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [filters, setFilters] = useState({
    status: "",
    alert_type: "",
    severity: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [currentPage, limit, filters]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.monitoring.alerts(
        currentPage,
        limit,
        filters.status || null,
        filters.alert_type || null,
        filters.severity || null
      );
      setAlerts(response.data.alerts || []);
      setTotalCount(response.data.total || 0);
    } catch (error) {
      console.error("Ошибка при загрузке алертов:", error);
      alert("Ошибка при загрузке алертов");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      await apiRequests.monitoring.resolveAlert(alertId);
      alert("Алерт разрешен");
      fetchAlerts();
    } catch (error) {
      console.error("Ошибка при разрешении алерта:", error);
      alert("Ошибка при разрешении алерта");
    }
  };

  const handleDismiss = async (alertId) => {
    try {
      await apiRequests.monitoring.dismissAlert(alertId);
      alert("Алерт отклонен");
      fetchAlerts();
    } catch (error) {
      console.error("Ошибка при отклонении алерта:", error);
      alert("Ошибка при отклонении алерта");
    }
  };

  const handleManualCheck = async () => {
    try {
      setLoading(true);
      await apiRequests.monitoring.check();
      alert("Проверка запущена. Новые алерты появятся через несколько секунд.");
      setTimeout(() => {
        fetchAlerts();
      }, 2000);
    } catch (error) {
      console.error("Ошибка при запуске проверки:", error);
      alert("Ошибка при запуске проверки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.alertsContainer}>
      <div className={styles.alertsHeader}>
        <h2>Алерты мониторинга</h2>
        <div className={styles.headerActions}>
          <button onClick={handleManualCheck} className={styles.checkButton} disabled={loading}>
            🔍 Запустить проверку
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="resolved">Разрешенные</option>
          <option value="dismissed">Отклоненные</option>
        </select>

        <select
          value={filters.alert_type}
          onChange={(e) => setFilters({ ...filters, alert_type: e.target.value })}
        >
          <option value="">Все типы</option>
          <option value="user_churn">Отток пользователей</option>
          <option value="suspicious_activity">Подозрительная активность</option>
          <option value="registration_spike">Рост регистраций</option>
        </select>

        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
        >
          <option value="">Все уровни</option>
          <option value="low">Низкая</option>
          <option value="medium">Средняя</option>
          <option value="high">Высокая</option>
          <option value="critical">Критическая</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : alerts.length === 0 ? (
        <div className={styles.emptyState}>Алерты не найдены</div>
      ) : (
        <>
          <div className={styles.alertsList}>
            {alerts.map((alert) => (
              <div
                key={alert._id || alert.id}
                className={styles.alertCard}
                style={{
                  borderLeft: `4px solid ${severityColors[alert.severity] || "#ccc"}`,
                }}
              >
                <div className={styles.alertHeader}>
                  <div className={styles.alertTitle}>
                    <span
                      className={styles.severityBadge}
                      style={{ backgroundColor: severityColors[alert.severity] || "#ccc" }}
                    >
                      {severityLabels[alert.severity] || alert.severity}
                    </span>
                    <h3>{alert.title}</h3>
                  </div>
                  <div className={styles.alertMeta}>
                    <span className={styles.alertType}>
                      {alertTypeLabels[alert.alert_type] || alert.alert_type}
                    </span>
                    <span
                      className={styles.statusBadge}
                      data-status={alert.status}
                    >
                      {statusLabels[alert.status] || alert.status}
                    </span>
                  </div>
                </div>

                <div className={styles.alertBody}>
                  <p>{alert.description}</p>

                  {alert.details && Object.keys(alert.details).length > 0 && (
                    <div className={styles.alertDetails}>
                      <strong>Детали:</strong>
                      <ul>
                        {Object.entries(alert.details).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong> {JSON.stringify(value)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {alert.affected_users && alert.affected_users.length > 0 && (
                    <div className={styles.affectedUsers}>
                      <strong>Затронуто пользователей: {alert.affected_users.length}</strong>
                    </div>
                  )}

                  {alert.created_at && (
                    <div className={styles.alertDate}>
                      Создан: {formatDateTimeMoscow(alert.created_at)}
                    </div>
                  )}
                </div>

                {alert.status === "active" && (
                  <div className={styles.alertActions}>
                    <button
                      onClick={() => handleResolve(alert._id || alert.id)}
                      className={styles.resolveButton}
                    >
                      ✓ Разрешить
                    </button>
                    <button
                      onClick={() => handleDismiss(alert._id || alert.id)}
                      className={styles.dismissButton}
                    >
                      ✕ Отклонить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <PaginationControls
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            limit={limit}
            setLimit={setLimit}
            totalCount={totalCount}
          />
        </>
      )}
    </div>
  );
};

export default AlertsComponent;
