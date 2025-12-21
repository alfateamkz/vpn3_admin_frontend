import React, { useState } from "react";
import { apiRequests } from "../../shared/api/apiRequests";
import { canViewPayments } from "../../shared/utils/roleUtils";
import { formatDateTimeMoscow } from "../../shared/utils/dateUtils";
import Cookies from "js-cookie";
import "./Payments.scss";

const statuses = {
  FINISHED: "Завершено",
  PENDING: "Ожидание",
  CANCELED: "Оменено",
};

const statusDescriptions = {
  FINISHED: "Платеж успешно завершен, средства получены, подписка активирована",
  PENDING: "Платеж ожидает обработки или подтверждения от платежной системы",
  CANCELED: "Платеж отменен пользователем или платежной системой",
};

const types = { bonus: "Бонусный", money: "Реальный", crypto: "Криптовалюта" };

export const PaymentsTable = ({ payments }) => {
  const [refundModal, setRefundModal] = useState(null);
  const [paymentId, setPaymentId] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Проверяем права доступа
  const hasPaymentAccess = canViewPayments();
  
  // Для рефанда нужны права на редактирование платежей (только админ)
  const canEditPayments = () => {
    // Проверяем роль из токена
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

  const handleRefund = async () => {
    if (!refundModal) return;
    
    // Если payment_id не указан, но есть сохраненный telegram_payment_id, используем его
    const finalPaymentId = paymentId.trim() || refundModal.telegram_payment_id || null;
    
    if (!finalPaymentId) {
      alert("Введите Payment ID от YooKassa или убедитесь, что он сохранен в заказе");
      return;
    }

    setLoading(true);
    try {
      const amount = refundAmount ? parseFloat(refundAmount) : null;
      await apiRequests.payments.refund(
        refundModal._id,
        finalPaymentId || null, // Передаем null если пусто, бэкенд использует сохраненный
        amount
      );
      
      alert("Рефанд успешно создан!");
      setRefundModal(null);
      setPaymentId("");
      setRefundAmount("");
      
      // Перезагружаем страницу для обновления данных
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при создании рефанда:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Ошибка при создании рефанда";
      alert(`Ошибка: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const canRefund = (order) => {
    // Можно рефандить только завершенные платежи типа "money" (из бота) или "yookassa" (с сайта)
    // которые еще не были рефаннуты и имеют payment_id или telegram_payment_id
    // И только если есть права на редактирование платежей (только админ)
    if (!canEditPayments()) {
      console.log("[REFUND] Нет прав на редактирование платежей");
      return false;
    }
    
    // Проверяем статус и что платеж еще не был рефаннут
    if (order.status !== "FINISHED") {
      console.log(`[REFUND] Платеж не завершен: status=${order.status}`);
      return false;
    }
    
    if (order.refund_status === "refunded") {
      console.log(`[REFUND] Платеж уже возвращен: refund_status=${order.refund_status}`);
      return false;
    }
    
    // Проверяем тип платежа - можно рефандить только YooKassa платежи
    const isYooKassaPayment = order.type === "money" || order.type === "yookassa";
    if (!isYooKassaPayment) {
      console.log(`[REFUND] Не YooKassa платеж: type=${order.type}`);
      return false;
    }
    
    // Проверяем наличие payment_id или telegram_payment_id для создания рефанда
    const hasPaymentId = order.payment_id || order.telegram_payment_id;
    if (!hasPaymentId) {
      console.log(`[REFUND] Нет payment_id: payment_id=${order.payment_id}, telegram_payment_id=${order.telegram_payment_id}`);
      return false;
    }
    
    console.log(`[REFUND] ✅ Можно вернуть: order_id=${order._id}, type=${order.type}, payment_id=${order.payment_id || order.telegram_payment_id}`);
    return true;
  };
  
  // Если нет доступа к финансовым данным, скрываем таблицу
  if (!hasPaymentAccess) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        <h3>У вас нет доступа к финансовым данным</h3>
        <p>Для просмотра платежей требуется роль администратора</p>
      </div>
    );
  }

  return (
    <>
      <table className="payments-table">
        <thead>
          <tr>
            <th>
              Статус
              <span 
                title="FINISHED - платеж завершен, подписка активирована\nPENDING - платеж ожидает обработки\nCANCELED - платеж отменен"
                style={{ 
                  cursor: "help", 
                  marginLeft: "5px", 
                  color: "#666",
                  fontSize: "14px"
                }}
              >
                ❓
              </span>
            </th>
            <th>Тестовый</th>
            <th>Тип</th>
            <th>Сумма</th>
            <th>Описание</th>
            <th>Дата создания</th>
            <th>Рефанд</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((order) => {
            const canRefundOrder = canRefund(order);
            return (
              <tr key={order._id}>
                <td>
                  <span title={statusDescriptions[order.status] || "Статус платежа"}>
                    {statuses[order.status] || order.status}
                  </span>
                </td>
                <td>{order.testing ? "Да" : "Нет"}</td>
                <td>{types[order.type] || order.type}</td>
                <td>{order.amount} ₽</td>
                <td>{order.description}</td>
                <td>{formatDateTimeMoscow(order.created_at)}</td>
                <td>
                  {order.refund_status === "refunded" ? (
                    <span style={{ color: "#4CAF50" }}>✅ Возвращен</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td style={{ minWidth: "120px" }}>
                  {canRefundOrder ? (
                    <button
                      onClick={() => {
                        console.log("[REFUND] Открываем модальное окно для заказа:", order);
                        setRefundModal(order);
                        // Устанавливаем payment_id по умолчанию, если есть
                        if (order.payment_id) {
                          setPaymentId(order.payment_id);
                        } else if (order.telegram_payment_id) {
                          setPaymentId(order.telegram_payment_id);
                        }
                      }}
                      className="refund-button"
                      style={{ 
                        padding: "6px 12px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "inline-block",
                        fontWeight: "500"
                      }}
                    >
                      🔄 Вернуть
                    </button>
                  ) : (
                    <span style={{ color: "#999", fontSize: "11px", display: "inline-block" }}>
                      {!canEditPayments() ? "Нет прав" :
                       order.status !== "FINISHED" ? "Не завершен" : 
                       order.refund_status === "refunded" ? "Возвращен" :
                       (order.type !== "money" && order.type !== "yookassa") ? `Тип: ${order.type}` :
                       !(order.payment_id || order.telegram_payment_id) ? "Нет ID" : "—"}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {refundModal && (
        <div className="modal-overlay" onClick={() => setRefundModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Создать рефанд платежа</h3>
              <button onClick={() => setRefundModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p><strong>Заказ ID:</strong> {refundModal._id}</p>
              <p><strong>Сумма:</strong> {refundModal.amount} ₽</p>
              <p><strong>Пользователь:</strong> {refundModal.user_id}</p>
              
              <div className="form-group">
                <label>
                  Payment ID от YooKassa
                  {refundModal.telegram_payment_id && (
                    <span style={{ color: "#4CAF50", fontSize: "12px", marginLeft: "8px" }}>
                      (будет использован сохраненный: {refundModal.telegram_payment_id.substring(0, 20)}...)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder={
                    refundModal.telegram_payment_id
                      ? `Оставьте пустым для использования автоматически (${refundModal.telegram_payment_id.substring(0, 20)}...)`
                      : "Например: 21740069-000f-50be-b000-0486ffbf45b0"
                  }
                  disabled={loading}
                />
                <small>
                  {refundModal.telegram_payment_id
                    ? "Если оставить пустым, будет использован сохраненный Payment ID из заказа. Иначе укажите Payment ID вручную."
                    : "Введите Payment ID от YooKassa или убедитесь, что он сохранен в заказе."}
                </small>
              </div>
              
              <div className="form-group">
                <label>
                  Сумма рефанда (оставьте пустым для полного возврата)
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder={`Максимум: ${refundModal.amount} ₽`}
                  max={refundModal.amount}
                  disabled={loading}
                />
                <small>Если не указано, будет возвращена полная сумма</small>
              </div>
              
              <div className="modal-actions">
                <button
                  onClick={handleRefund}
                  disabled={loading || (!paymentId.trim() && !refundModal.telegram_payment_id)}
                  className="submit-button"
                >
                  {loading ? "Обработка..." : "Создать рефанд"}
                </button>
                <button
                  onClick={() => setRefundModal(null)}
                  disabled={loading}
                  className="cancel-button"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
