import React, { useState, useEffect } from "react";
import { PaginationControls } from "../pagination/PaginationComponent";
import { apiRequests } from "../../shared/api/apiRequests";
import styles from "./PayoutsComponent.module.scss";

const statusLabels = {
  pending: "Ожидает",
  approved: "Одобрено",
  rejected: "Отклонено",
  paid: "Выплачено",
};

const statusColors = {
  pending: "#FF9800",
  approved: "#4CAF50",
  rejected: "#F44336",
  paid: "#2196F3",
};

const PayoutsComponent = () => {
  const [payouts, setPayouts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPayouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, statusFilter]);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.referals.payouts(
        statusFilter === "all" ? "all" : statusFilter,
        currentPage,
        limit
      );
      const data = response.data;
      setPayouts(data.payouts || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("Ошибка при загрузке заявок на вывод:", error);
      alert("Ошибка при загрузке заявок на вывод");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (payoutId) => {
    if (!window.confirm("Одобрить заявку на вывод?")) {
      return;
    }

    setProcessing(true);
    try {
      await apiRequests.referals.approvePayout(payoutId);
      alert("Заявка одобрена!");
      fetchPayouts();
      setSelectedPayout(null);
    } catch (error) {
      console.error("Ошибка при одобрении заявки:", error);
      const errorMessage =
        error.response?.data?.detail || error.message || "Ошибка при одобрении заявки";
      alert(`Ошибка: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (payoutId) => {
    if (!rejectReason.trim()) {
      alert("Укажите причину отклонения");
      return;
    }

    if (!window.confirm("Отклонить заявку на вывод?")) {
      return;
    }

    setProcessing(true);
    try {
      await apiRequests.referals.rejectPayout(payoutId, rejectReason);
      alert("Заявка отклонена!");
      fetchPayouts();
      setSelectedPayout(null);
      setRejectReason("");
    } catch (error) {
      console.error("Ошибка при отклонении заявки:", error);
      const errorMessage =
        error.response?.data?.detail || error.message || "Ошибка при отклонении заявки";
      alert(`Ошибка: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("ru-RU");
  };

  return (
    <div className={styles.payoutsContainer}>
      <h2>Заявки на вывод средств</h2>

      <div className={styles.filters}>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">Все статусы</option>
          <option value="pending">Ожидают</option>
          <option value="approved">Одобрены</option>
          <option value="rejected">Отклонены</option>
          <option value="paid">Выплачены</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : payouts.length === 0 ? (
        <div className={styles.emptyState}>Заявки на вывод не найдены</div>
      ) : (
        <>
          <div className={styles.payoutsTable}>
            <table>
              <thead>
                <tr>
                  <th>Дата создания</th>
                  <th>Пользователь</th>
                  <th>Telegram ID</th>
                  <th>Сумма</th>
                  <th>Способ</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id}>
                    <td>{formatDate(payout.created_at)}</td>
                    <td>
                      {payout.user_name || payout.user_tg_id
                        ? `${payout.user_name || ""} (${payout.user_tg_id || ""})`
                        : "—"}
                    </td>
                    <td className={styles.smallText}>
                      {payout.user_tg_id || "—"}
                    </td>
                    <td className={styles.amount}>{payout.amount}₽</td>
                    <td>{payout.payment_method || "—"}</td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{
                          backgroundColor: statusColors[payout.status] || "#ccc",
                        }}
                      >
                        {statusLabels[payout.status] || payout.status}
                      </span>
                    </td>
                    <td>
                      {payout.status === "pending" && (
                        <>
                          <button
                            onClick={() => setSelectedPayout(payout)}
                            className={styles.detailsButton}
                            disabled={processing}
                          >
                            Детали
                          </button>
                          <button
                            onClick={() => handleApprove(payout.id)}
                            className={styles.approveButton}
                            disabled={processing}
                          >
                            ✅ Одобрить
                          </button>
                        </>
                      )}
                      {payout.status === "approved" && (
                        <span className={styles.processedBy}>
                          Обработал: {payout.processed_by || "—"}
                        </span>
                      )}
                      {payout.status === "rejected" && payout.rejection_reason && (
                        <span className={styles.rejectionReason} title={payout.rejection_reason}>
                          ❌ {payout.rejection_reason.substring(0, 30)}...
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedPayout && selectedPayout.status === "pending" && (
            <div className={styles.modal} onClick={() => setSelectedPayout(null)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h3>Заявка на вывод №{selectedPayout.id.substring(0, 8)}...</h3>
                  <button onClick={() => setSelectedPayout(null)}>✕</button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.detailRow}>
                    <strong>Пользователь:</strong>
                    <span>
                      {selectedPayout.user_name || ""} (ID: {selectedPayout.user_tg_id})
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Сумма:</strong>
                    <span className={styles.amount}>{selectedPayout.amount}₽</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Способ получения:</strong>
                    <span>{selectedPayout.payment_method}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Реквизиты:</strong>
                    <span className={styles.details}>{selectedPayout.details || "—"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Дата создания:</strong>
                    <span>{formatDate(selectedPayout.created_at)}</span>
                  </div>
                  {selectedPayout.source === "bot" && (
                    <div className={styles.sourceBadge}>
                      📱 Создано через бота
                    </div>
                  )}

                  <div className={styles.modalActions}>
                    <button
                      onClick={() => handleApprove(selectedPayout.id)}
                      className={styles.approveButton}
                      disabled={processing}
                    >
                      ✅ Одобрить
                    </button>
                    <div className={styles.rejectSection}>
                      <input
                        type="text"
                        placeholder="Причина отклонения"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        disabled={processing}
                        className={styles.rejectInput}
                      />
                      <button
                        onClick={() => handleReject(selectedPayout.id)}
                        className={styles.rejectButton}
                        disabled={processing || !rejectReason.trim()}
                      >
                        ❌ Отклонить
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedPayout(null)}
                      className={styles.cancelButton}
                      disabled={processing}
                    >
                      Отмена
                    </button>
                  </div>
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

export default PayoutsComponent;
