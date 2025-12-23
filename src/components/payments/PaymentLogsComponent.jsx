import React, { useState, useEffect, useCallback } from "react";
import styles from "./PaymentLogsComponent.module.scss";
import { apiRequests } from "../../shared/api/apiRequests";
import { PaginationControls } from "../pagination/PaginationComponent";
import { canViewPayments, canExport } from "../../shared/utils/roleUtils";
import { formatDateTimeMoscow } from "../../shared/utils/dateUtils";
import { PaymentsTable } from "./PaymentsComponent";
import PaymentsTableWithFilters from "./PaymentsTableWithFilters";
import Cookies from "js-cookie";

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
  const [activeTab, setActiveTab] = useState("logs"); // "logs" или "payments"
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
  const [orderData, setOrderData] = useState(null);
  const [refundModal, setRefundModal] = useState(null);
  const [paymentId, setPaymentId] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
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
  }, [currentPage, limit, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatAmount = (amount, currency) => {
    if (amount === null || amount === undefined) return "—";
    const currencySymbol = currency === "USD" ? "$" : "₽";
    return `${amount} ${currencySymbol}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return formatDateTimeMoscow(dateString);
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

  const handleExportLogs = async () => {
    if (!canExport()) {
      alert("Недостаточно прав для экспорта");
      return;
    }

    try {
      const params = {};
      if (filters.log_type) params.log_type = filters.log_type;
      
      const response = await apiRequests.export.paymentLogsCsv(params);
      // Создаем ссылку для скачивания
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const timestamp = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `payment_logs_export_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      alert("Экспорт логов платежей завершен!");
    } catch (error) {
      console.error("Ошибка при экспорте логов платежей:", error);
      alert("Ошибка при экспорте логов платежей");
    }
  };

  // Функция для получения платежей
  const getPayments = async (page, limit, type, user_id = null) => {
    try {
      const response = await apiRequests.payments.all(page, limit, type, user_id);
      return response.data;
    } catch (error) {
      console.error("Ошибка при загрузке платежей:", error);
      throw error;
    }
  };

  // Функция для проверки прав на редактирование платежей
  const canEditPayments = () => {
    try {
      const token = Cookies.get("accessToken") || localStorage.getItem("accessToken");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role === "admin";
      }
    } catch (e) {
      // Игнорируем ошибки
    }
    return false;
  };

  // Функция для проверки возможности возврата
  const canRefund = (order) => {
    if (!canEditPayments()) {
      return false;
    }
    
    if (order.status !== "FINISHED") {
      return false;
    }
    
    if (order.refund_status === "refunded") {
      return false;
    }
    
    const isYooKassaPayment = order.type === "money" || order.type === "yookassa";
    if (!isYooKassaPayment) {
      return false;
    }
    
    const hasPaymentId = order.payment_id || order.telegram_payment_id;
    if (!hasPaymentId) {
      return false;
    }
    
    return true;
  };

  // Функция для получения заказа по order_id
  const fetchOrderData = useCallback(async (orderId) => {
    if (!orderId) {
      setOrderData(null);
      return;
    }
    
    try {
      // Получаем список платежей и ищем нужный заказ по _id
      // Пробуем найти в первых 100 записях
      const response = await apiRequests.payments.all(1, 100, "all", null);
      let order = response.data.documents.find(o => o._id === orderId);
      
      // Если не нашли, пробуем поиск по строковому представлению
      if (!order) {
        order = response.data.documents.find(o => String(o._id) === String(orderId));
      }
      
      setOrderData(order || null);
      
      if (!order) {
        console.warn(`Заказ с ID ${orderId} не найден в первых 100 записях`);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных заказа:", error);
      setOrderData(null);
    }
  }, []);

  // Обработчик открытия деталей лога
  const handleLogDetails = (log) => {
    setSelectedLog(log);
    // Если есть order_id, загружаем данные заказа
    if (log.order_id) {
      fetchOrderData(log.order_id);
    } else {
      setOrderData(null);
    }
  };

  // Обработчик возврата средств
  const handleRefund = async () => {
    if (!orderData) return;
    
    const finalPaymentId = paymentId.trim() || orderData.payment_id || orderData.telegram_payment_id || null;
    
    if (!finalPaymentId) {
      alert("Введите Payment ID от YooKassa или убедитесь, что он сохранен в заказе");
      return;
    }

    setRefundLoading(true);
    try {
      const amount = refundAmount ? parseFloat(refundAmount) : null;
      await apiRequests.payments.refund(
        orderData._id,
        finalPaymentId,
        amount
      );
      
      alert("Рефанд успешно создан!");
      setRefundModal(null);
      setPaymentId("");
      setRefundAmount("");
      setOrderData(null);
      setSelectedLog(null);
      
      // Перезагружаем данные
      fetchLogs();
      if (selectedLog?.order_id) {
        fetchOrderData(selectedLog.order_id);
      }
    } catch (error) {
      console.error("Ошибка при создании рефанда:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Ошибка при создании рефанда";
      alert(`Ошибка: ${errorMessage}`);
    } finally {
      setRefundLoading(false);
    }
  };

  return (
    <div className={styles.paymentLogsContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Платежи</h2>
        {canExport() && activeTab === "logs" && (
          <button
            onClick={handleExportLogs}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
            title="Выгрузить логи платежей в Excel (CSV)"
          >
            📥 Выгрузить в Excel
          </button>
        )}
      </div>

      {/* Вкладки для переключения между логами и платежами */}
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        marginBottom: "20px",
        borderBottom: "2px solid #e0e0e0"
      }}>
        <button
          onClick={() => setActiveTab("logs")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "logs" ? "#6db1f3" : "transparent",
            color: activeTab === "logs" ? "white" : "#666",
            border: "none",
            borderBottom: activeTab === "logs" ? "3px solid #6db1f3" : "3px solid transparent",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: activeTab === "logs" ? "600" : "400",
            transition: "all 0.3s"
          }}
        >
          📋 Логи платежей
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "payments" ? "#6db1f3" : "transparent",
            color: activeTab === "payments" ? "white" : "#666",
            border: "none",
            borderBottom: activeTab === "payments" ? "3px solid #6db1f3" : "3px solid transparent",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: activeTab === "payments" ? "600" : "400",
            transition: "all 0.3s"
          }}
        >
          💳 Платежи (с возвратом)
        </button>
      </div>

      {activeTab === "payments" ? (
        <PaymentsTableWithFilters 
          getPayments={getPayments} 
          userId={null}
        />
      ) : (
        <>

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
                        onClick={() => handleLogDetails(log)}
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
            <div className={styles.modal} onClick={() => {
              setSelectedLog(null);
              setOrderData(null);
              setPaymentId("");
              setRefundAmount("");
            }}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h3>Детали лога платежа</h3>
                  <button onClick={() => {
                    setSelectedLog(null);
                    setOrderData(null);
                    setPaymentId("");
                    setRefundAmount("");
                  }}>✕</button>
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

                  {/* Блок возврата средств */}
                  {orderData && (
                    <div className={styles.detailsSection} style={{ marginTop: "20px", paddingTop: "20px", borderTop: "2px solid #e0e0e0" }}>
                      <h4 style={{ marginTop: 0, marginBottom: "15px" }}>Возврат средств</h4>
                      {canRefund(orderData) ? (
                        <>
                          <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                            <div style={{ marginBottom: "8px" }}>
                              <strong>Статус заказа:</strong> {orderData.status}
                            </div>
                            <div style={{ marginBottom: "8px" }}>
                              <strong>Тип платежа:</strong> {orderData.type}
                            </div>
                            <div style={{ marginBottom: "8px" }}>
                              <strong>Сумма:</strong> {orderData.amount} ₽
                            </div>
                            {orderData.refund_status === "refunded" && (
                              <div style={{ color: "#4CAF50", fontWeight: "bold" }}>
                                ✅ Платеж уже был возвращен
                              </div>
                            )}
                          </div>
                          {orderData.refund_status !== "refunded" && (
                            <div>
                              <div style={{ marginBottom: "10px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                  Payment ID (если не указан, будет использован сохраненный):
                                </label>
                                <input
                                  type="text"
                                  value={paymentId}
                                  onChange={(e) => setPaymentId(e.target.value)}
                                  placeholder={orderData.payment_id || orderData.telegram_payment_id || "Введите Payment ID"}
                                  style={{
                                    width: "100%",
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px"
                                  }}
                                />
                              </div>
                              <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                  Сумма возврата (оставьте пустым для полного возврата):
                                </label>
                                <input
                                  type="number"
                                  value={refundAmount}
                                  onChange={(e) => setRefundAmount(e.target.value)}
                                  placeholder={`Максимум: ${orderData.amount} ₽`}
                                  max={orderData.amount}
                                  min="0"
                                  step="0.01"
                                  style={{
                                    width: "100%",
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "14px"
                                  }}
                                />
                              </div>
                              <button
                                onClick={handleRefund}
                                disabled={refundLoading}
                                style={{
                                  width: "100%",
                                  padding: "12px",
                                  backgroundColor: refundLoading ? "#ccc" : "#f44336",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  cursor: refundLoading ? "not-allowed" : "pointer",
                                  transition: "background-color 0.3s"
                                }}
                              >
                                {refundLoading ? "Обработка..." : "🔄 Вернуть средства"}
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{ padding: "10px", backgroundColor: "#fff3cd", borderRadius: "4px", color: "#856404" }}>
                          {!canEditPayments() ? (
                            <div>❌ У вас нет прав для возврата средств</div>
                          ) : orderData.status !== "FINISHED" ? (
                            <div>⚠️ Можно вернуть только завершенные платежи (текущий статус: {orderData.status})</div>
                          ) : (orderData.type !== "money" && orderData.type !== "yookassa") ? (
                            <div>⚠️ Возврат возможен только для платежей YooKassa (текущий тип: {orderData.type})</div>
                          ) : !(orderData.payment_id || orderData.telegram_payment_id) ? (
                            <div>⚠️ Не найден Payment ID для возврата</div>
                          ) : (
                            <div>⚠️ Возврат недоступен</div>
                          )}
                        </div>
                      )}
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
        </>
      )}
    </div>
  );
};

export default PaymentLogsComponent;
