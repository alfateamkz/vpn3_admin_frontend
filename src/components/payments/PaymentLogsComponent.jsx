import React, { useState, useEffect } from "react";
import styles from "./PaymentLogsComponent.module.scss";
import { apiRequests } from "../../shared/api/apiRequests";
import { PaginationControls } from "../pagination/PaginationComponent";
import { canViewPayments } from "../../shared/utils/roleUtils";

const logTypeLabels = {
  telegram_payment_created: "Создание Telegram платежа",
  telegram_payment_success: "Успешный Telegram платеж",
  telegram_payment_failed: "Ошибка Telegram платежа",
  nowpayments_invoice_created: "Создание NOWPayments инвойса",
  nowpayments_callback_received: "NOWPayments callback получен",
  nowpayments_payment_confirmed: "NOWPayments платеж подтвержден",
  nowpayments_payment_failed: "NOWPayments платеж неуспешен",
  payment_error: "Ошибка платежа",
};

const statusLabels = {
  pending: "Ожидает",
  waiting: "Ожидает",
  success: "Успешно",
  confirmed: "Подтвержден",
  failed: "Ошибка",
  error: "Ошибка",
};

const statusColors = {
  pending: "#FF9800",
  waiting: "#FF9800",
  success: "#4CAF50",
  confirmed: "#4CAF50",
  failed: "#F44336",
  error: "#F44336",
};

const PaymentLogsComponent = () => {
  const [logs, setLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [filters, setFilters] = useState({
    log_type: "",
    payment_method: "",
    status: "",
    user_id: "",
    order_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, limit, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.payments.logs(
        currentPage,
        limit,
        filters.log_type || null,
        filters.payment_method || null,
        filters.status || null,
        filters.user_id || null,
        filters.order_id || null
      );
      setLogs(response.data.logs || []);
      setTotalCount(response.data.total || 0);
    } catch (error) {
      console.error("Ошибка при загрузке логов платежей:", error);
      alert("Ошибка при загрузке логов платежей");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount, currency) => {
    if (amount === null || amount === undefined) return "—";
    const currencySymbol = currency === "USD" ? "$" : "₽";
    return `${amount} ${currencySymbol}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return `${new Date(dateString).toLocaleString("ru-RU")} UTC`;
  };

  // Проверяем права доступа
  if (!canViewPayments()) {
    return (
      <div className={styles.paymentLogsContainer}>
        <h2>Логи платежей</h2>
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          <h3>У вас нет доступа к финансовым данным</h3>
          <p>Для просмотра логов платежей требуется роль администратора или аналитика</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paymentLogsContainer}>
      <h2>Логи платежей</h2>

      <div className={styles.filters}>
        <select
          value={filters.log_type}
          onChange={(e) => setFilters({ ...filters, log_type: e.target.value })}
        >
          <option value="">Все типы</option>
          <option value="telegram_payment_created">Создание Telegram платежа</option>
          <option value="telegram_payment_success">Успешный Telegram платеж</option>
          <option value="telegram_payment_failed">Ошибка Telegram платежа</option>
          <option value="nowpayments_invoice_created">Создание NOWPayments инвойса</option>
          <option value="nowpayments_callback_received">NOWPayments callback</option>
          <option value="nowpayments_payment_confirmed">NOWPayments подтвержден</option>
          <option value="nowpayments_payment_failed">NOWPayments неуспешен</option>
          <option value="payment_error">Ошибка платежа</option>
        </select>

        <select
          value={filters.payment_method}
          onChange={(e) => setFilters({ ...filters, payment_method: e.target.value })}
        >
          <option value="">Все методы</option>
          <option value="telegram">Telegram</option>
          <option value="crypto">Криптовалюта</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Все статусы</option>
          <option value="pending">Ожидает</option>
          <option value="waiting">Ожидает</option>
          <option value="success">Успешно</option>
          <option value="confirmed">Подтвержден</option>
          <option value="failed">Ошибка</option>
          <option value="error">Ошибка</option>
        </select>

        <input
          type="text"
          placeholder="User ID"
          value={filters.user_id}
          onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
        />

        <input
          type="text"
          placeholder="Order ID"
          value={filters.order_id}
          onChange={(e) => setFilters({ ...filters, order_id: e.target.value })}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : logs.length === 0 ? (
        <div className={styles.emptyState}>Логи платежей не найдены</div>
      ) : (
        <>
          <div className={styles.logsTable}>
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Тип</th>
                  <th>Метод</th>
                  <th>Статус</th>
                  <th>Сумма</th>
                  <th>User ID</th>
                  <th>Order ID</th>
                  <th>Payment ID</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id || log.id}>
                    <td>{formatDate(log.timestamp)}</td>
                    <td>{logTypeLabels[log.log_type] || log.log_type}</td>
                    <td>{log.payment_method || "—"}</td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{
                          backgroundColor: statusColors[log.status] || "#ccc",
                        }}
                      >
                        {statusLabels[log.status] || log.status || "—"}
                      </span>
                    </td>
                    <td>{formatAmount(log.amount, log.currency)}</td>
                    <td className={styles.smallText}>
                      {log.user_id ? log.user_id.substring(0, 8) + "..." : "—"}
                    </td>
                    <td className={styles.smallText}>
                      {log.order_id || "—"}
                    </td>
                    <td className={styles.smallText}>
                      {log.payment_id ? String(log.payment_id).substring(0, 10) + "..." : "—"}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className={styles.detailsButton}
                      >
                        Детали
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedLog && (
            <div className={styles.modal} onClick={() => setSelectedLog(null)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h3>Детали лога платежа</h3>
                  <button onClick={() => setSelectedLog(null)}>✕</button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.detailRow}>
                    <strong>Тип:</strong>
                    <span>{logTypeLabels[selectedLog.log_type] || selectedLog.log_type}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Дата:</strong>
                    <span>{formatDate(selectedLog.timestamp)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Метод оплаты:</strong>
                    <span>{selectedLog.payment_method || "—"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Статус:</strong>
                    <span
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: statusColors[selectedLog.status] || "#ccc",
                      }}
                    >
                      {statusLabels[selectedLog.status] || selectedLog.status || "—"}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Сумма:</strong>
                    <span>{formatAmount(selectedLog.amount, selectedLog.currency)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>User ID:</strong>
                    <span>{selectedLog.user_id || "—"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Order ID:</strong>
                    <span>{selectedLog.order_id || "—"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Payment ID:</strong>
                    <span>{selectedLog.payment_id || "—"}</span>
                  </div>
                  {selectedLog.error && (
                    <div className={styles.detailRow}>
                      <strong>Ошибка:</strong>
                      <span className={styles.errorText}>{selectedLog.error}</span>
                    </div>
                  )}
                  {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                    <div className={styles.detailsSection}>
                      <strong>Детали:</strong>
                      <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                    </div>
                  )}
                  {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                    <div className={styles.detailsSection}>
                      <strong>Метаданные:</strong>
                      <pre>{JSON.stringify(selectedLog.metadata, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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

export default PaymentLogsComponent;
