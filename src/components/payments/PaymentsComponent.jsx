import React, { useState } from "react";
import { apiRequests } from "../../shared/api/apiRequests";
import "./Payments.scss";

const statuses = {
  FINISHED: "Завершено",
  PENDING: "Ожидание",
  CANCELED: "Оменено",
};
const types = { bonus: "Бонусный", money: "Реальный", crypto: "Криптовалюта" };

export const PaymentsTable = ({ payments }) => {
  const [refundModal, setRefundModal] = useState(null);
  const [paymentId, setPaymentId] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRefund = async () => {
    if (!refundModal) return;
    
    if (!paymentId.trim()) {
      alert("Введите Payment ID от YooKassa");
      return;
    }

    setLoading(true);
    try {
      const amount = refundAmount ? parseFloat(refundAmount) : null;
      const response = await apiRequests.payments.refund(
        refundModal._id,
        paymentId.trim(),
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
    // Можно рефандить только завершенные платежи типа "money", которые еще не были рефаннуты
    return (
      order.status === "FINISHED" &&
      order.type === "money" &&
      order.refund_status !== "refunded"
    );
  };

  return (
    <>
      <table className="payments-table">
        <thead>
          <tr>
            <th>Статус</th>
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
          {payments.map((order) => (
            <tr key={order._id}>
              <td>{statuses[order.status] || order.status}</td>
              <td>{order.testing ? "Да" : "Нет"}</td>
              <td>{types[order.type] || order.type}</td>
              <td>{order.amount} ₽</td>
              <td>{order.description}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                {order.refund_status === "refunded" ? (
                  <span style={{ color: "#4CAF50" }}>✅ Возвращен</span>
                ) : (
                  "—"
                )}
              </td>
              <td>
                {canRefund(order) ? (
                  <button
                    onClick={() => setRefundModal(order)}
                    className="refund-button"
                  >
                    Вернуть
                  </button>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
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
                  Payment ID от YooKassa <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder="Например: 21740069-000f-50be-b000-0486ffbf45b0"
                  disabled={loading}
                />
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
                  disabled={loading || !paymentId.trim()}
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
