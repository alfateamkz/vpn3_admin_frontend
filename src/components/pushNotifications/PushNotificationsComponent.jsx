import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./PushNotificationsComponent.module.scss";
import { apiRequests } from "../../shared/api/apiRequests";
import { PaginationControls } from "../pagination/PaginationComponent";
import { canEditUsers, canViewUsers } from "../../shared/utils/roleUtils";
import { formatDateTimeMoscow } from "../../shared/utils/dateUtils";

const targetTypeLabels = {
  user: "Пользователь",
  all_users: "Все пользователи",
  unknown: "Неизвестно",
};

export const PushNotificationsComponent = () => {
  const [activeTab, setActiveTab] = useState("send");

  const [firebaseStatus, setFirebaseStatus] = useState(null);
  const [firebaseStatusLoading, setFirebaseStatusLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dataJson, setDataJson] = useState("");

  const [sendMode, setSendMode] = useState("broadcast");
  const [userId, setUserId] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [sendTelegram, setSendTelegram] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);

  const [logs, setLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [logsLoading, setLogsLoading] = useState(false);
  const [filters, setFilters] = useState({
    target_type: "",
    target_id: "",
  });
  const [selectedLog, setSelectedLog] = useState(null);

  const canView = canViewUsers();
  const canSend = canEditUsers();

  const parseData = useCallback(() => {
    const trimmed = (dataJson || "").trim();
    if (!trimmed) return null;
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
      throw new Error("data должно быть JSON-объектом");
    } catch (e) {
      throw new Error(`Невалидный JSON в data: ${e.message}`);
    }
  }, [dataJson]);

  const fetchFirebaseStatus = useCallback(async () => {
    if (!canView) return;
    setFirebaseStatusLoading(true);
    try {
      const response = await apiRequests.pushNotifications.status();
      setFirebaseStatus(response.data);
    } catch (error) {
      console.error("Ошибка при получении статуса Firebase:", error);
      setFirebaseStatus(null);
    } finally {
      setFirebaseStatusLoading(false);
    }
  }, [canView]);

  const fetchLogs = useCallback(async () => {
    if (!canView) return;
    setLogsLoading(true);
    try {
      const response = await apiRequests.pushNotifications.logs(
        currentPage,
        limit,
        filters.target_type || null,
        filters.target_id || null
      );

      setLogs(response.data.logs || []);
      setTotalCount(response.data.total || 0);
    } catch (error) {
      console.error("Ошибка при загрузке логов push:", error);
      alert("Ошибка при загрузке логов push-уведомлений");
      setLogs([]);
      setTotalCount(0);
    } finally {
      setLogsLoading(false);
    }
  }, [canView, currentPage, limit, filters]);

  useEffect(() => {
    fetchFirebaseStatus();
  }, [fetchFirebaseStatus]);

  useEffect(() => {
    if (activeTab !== "logs") return;
    fetchLogs();
  }, [activeTab, fetchLogs]);

  const firebaseEnabled = useMemo(() => {
    return firebaseStatus?.firebase_enabled === true;
  }, [firebaseStatus]);

  const handleSend = async () => {
    if (!canSend) {
      alert("Недостаточно прав для отправки push-уведомлений");
      return;
    }

    if (!title.trim() || !body.trim()) {
      alert("Заполните title и body");
      return;
    }

    let data;
    try {
      data = parseData();
    } catch (e) {
      alert(e.message);
      return;
    }

    setSendLoading(true);
    try {
      if (sendMode === "user") {
        if (!userId.trim()) {
          alert("Укажите user_id");
          return;
        }

        const response = await apiRequests.pushNotifications.sendToUser({
          user_id: userId.trim(),
          title: title.trim(),
          body: body.trim(),
          data: data || undefined,
          send_telegram: !!sendTelegram,
        });

        const stats = response.data?.stats;
        const telegram = response.data?.telegram;
        const telegramText = telegram?.enabled
          ? `\nTelegram: sent=${telegram?.sent ?? 0}, failed=${telegram?.failed ?? 0}${telegram?.skipped_reason ? `, reason=${telegram.skipped_reason}` : ""}`
          : "\nTelegram: отключено";
        alert(
          `Push отправлен пользователю!\nОтправлено: ${stats?.sent ?? 0}\nОшибок: ${stats?.failed ?? 0}\nВсего: ${stats?.total ?? 0}${telegramText}`
        );
      } else {
        const response = await apiRequests.pushNotifications.broadcast({
          title: title.trim(),
          body: body.trim(),
          data: data || undefined,
          active_only: !!activeOnly,
          send_telegram: !!sendTelegram,
        });

        const stats = response.data?.stats;
        const telegram = response.data?.telegram;
        const telegramText = telegram?.enabled
          ? `\nTelegram: queued=${telegram?.queued ? "yes" : "no"}`
          : "\nTelegram: отключено";
        alert(
          `Push-рассылка завершена!\nОтправлено: ${stats?.sent ?? 0}\nОшибок: ${stats?.failed ?? 0}\nВсего: ${stats?.total ?? 0}${telegramText}`
        );
      }

      setTitle("");
      setBody("");
      setDataJson("");
      setUserId("");
      setSendTelegram(true);

      fetchFirebaseStatus();
    } catch (error) {
      console.error("Ошибка при отправке push:", error);
      const errorMsg = error.response?.data?.detail || error.message || "Ошибка при отправке push";
      alert(`Ошибка: ${errorMsg}`);
    } finally {
      setSendLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  if (!canView) {
    return (
      <div className={styles.container}>
        <h2>🔔 Push-уведомления</h2>
        <div className={styles.noAccess}>
          У вас нет доступа к просмотру push-уведомлений
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🔔 Push-уведомления</h2>
        <button
          className={styles.refreshButton}
          onClick={() => {
            fetchFirebaseStatus();
            if (activeTab === "logs") fetchLogs();
          }}
          disabled={firebaseStatusLoading || (activeTab === "logs" && logsLoading)}
        >
          Обновить
        </button>
      </div>

      <div className={styles.statusBox}>
        {firebaseStatusLoading ? (
          <div>Проверка статуса Firebase...</div>
        ) : firebaseStatus ? (
          <div>
            <div>
              <strong>Firebase:</strong> {firebaseEnabled ? "✅ настроен" : "❌ не настроен"}
            </div>
            {firebaseStatus?.settings?.project_id && (
              <div className={styles.smallText}>
                Project ID: {firebaseStatus.settings.project_id}
              </div>
            )}
            {!firebaseEnabled && (
              <div className={styles.warningText}>
                Отправка невозможна, пока Firebase не настроен на backend
              </div>
            )}
          </div>
        ) : (
          <div className={styles.warningText}>
            Не удалось получить статус Firebase
          </div>
        )}
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === "send" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("send")}
        >
          Отправка
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "logs" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("logs")}
        >
          Логи
        </button>
      </div>

      {activeTab === "send" ? (
        <div className={styles.form}>
          <div className={styles.formRow}>
            <label>Режим:</label>
            <select
              value={sendMode}
              onChange={(e) => setSendMode(e.target.value)}
              disabled={sendLoading}
            >
              <option value="broadcast">Массовая рассылка</option>
              <option value="user">Пользователю</option>
            </select>
          </div>

          {sendMode === "user" && (
            <div className={styles.formRow}>
              <label>User ID:</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="ObjectId пользователя"
                disabled={sendLoading}
              />
            </div>
          )}

          <div className={styles.formRow}>
            <label>
              <input
                type="checkbox"
                checked={sendTelegram}
                onChange={(e) => setSendTelegram(e.target.checked)}
                disabled={sendLoading}
              />
              Отправлять также в Telegram
            </label>
          </div>

          {sendMode === "broadcast" && (
            <div className={styles.formRow}>
              <label>
                <input
                  type="checkbox"
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                  disabled={sendLoading}
                />
                Только пользователи с активной подпиской
              </label>
            </div>
          )}

          <div className={styles.formRow}>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок"
              disabled={sendLoading}
            />
          </div>

          <div className={styles.formRow}>
            <label>Body:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Текст уведомления"
              rows={5}
              disabled={sendLoading}
            />
          </div>

          <div className={styles.formRow}>
            <label>Data (JSON, опционально):</label>
            <textarea
              value={dataJson}
              onChange={(e) => setDataJson(e.target.value)}
              placeholder='{"type":"promo","screen":"home"}'
              rows={5}
              disabled={sendLoading}
            />
            <div className={styles.hint}>
              Отправляется как `data` в FCM. Значения внутри будут приведены к строкам на backend.
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.primaryButton}
              onClick={handleSend}
              disabled={sendLoading || !firebaseEnabled || !canSend}
              title={!canSend ? "Нет прав users.edit" : (!firebaseEnabled ? "Firebase не настроен" : "")}
            >
              {sendLoading ? "Отправка..." : "Отправить"}
            </button>
            {!canSend && (
              <div className={styles.warningText}>
                Для отправки требуется право <strong>users.edit</strong>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.filters}>
            <select
              value={filters.target_type}
              onChange={(e) => handleFilterChange("target_type", e.target.value)}
            >
              <option value="">Все цели</option>
              <option value="user">Пользователь</option>
              <option value="all_users">Все пользователи</option>
            </select>

            <input
              type="text"
              placeholder="Target ID (user_id)"
              value={filters.target_id}
              onChange={(e) => handleFilterChange("target_id", e.target.value)}
            />
          </div>

          {logsLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : logs.length === 0 ? (
            <div className={styles.emptyState}>Логи push-уведомлений не найдены</div>
          ) : (
            <>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Время</th>
                      <th>Цель</th>
                      <th>Target ID</th>
                      <th>Title</th>
                      <th>Статистика</th>
                      <th>Admin ID</th>
                      <th>IP</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id}>
                        <td>{log.timestamp ? formatDateTimeMoscow(log.timestamp) : "—"}</td>
                        <td>{targetTypeLabels[log.target_type] || log.target_type || "—"}</td>
                        <td className={styles.smallText}>{log.target_id || "—"}</td>
                        <td>{log.title || "—"}</td>
                        <td>
                          <span className={styles.statsBadge}>
                            {`${log.sent ?? 0}/${log.total ?? 0}`} 
                            {log.failed ? ` (ошибок: ${log.failed})` : ""}
                          </span>
                        </td>
                        <td className={styles.smallText}>{log.admin_id || "—"}</td>
                        <td className={styles.smallText}>{log.ip_address || "—"}</td>
                        <td>
                          <button
                            className={styles.detailsButton}
                            onClick={() => setSelectedLog(log)}
                          >
                            Детали
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

          {selectedLog && (
            <div className={styles.modal} onClick={() => setSelectedLog(null)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h3>Детали push-лога</h3>
                  <button onClick={() => setSelectedLog(null)}>✕</button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.detailRow}>
                    <strong>Время:</strong>
                    <span>{selectedLog.timestamp ? formatDateTimeMoscow(selectedLog.timestamp) : "—"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Цель:</strong>
                    <span>{targetTypeLabels[selectedLog.target_type] || selectedLog.target_type || "—"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Target ID:</strong>
                    <span>{selectedLog.target_id || "—"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Title:</strong>
                    <span>{selectedLog.title || "—"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Body:</strong>
                    <span>{selectedLog.body || "—"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Статистика:</strong>
                    <span>{`sent=${selectedLog.sent ?? 0}, failed=${selectedLog.failed ?? 0}, total=${selectedLog.total ?? 0}`}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Admin ID:</strong>
                    <span>{selectedLog.admin_id || "—"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>IP:</strong>
                    <span>{selectedLog.ip_address || "—"}</span>
                  </div>

                  {selectedLog.data && Object.keys(selectedLog.data).length > 0 && (
                    <div className={styles.detailsSection}>
                      <strong>Data:</strong>
                      <pre>{JSON.stringify(selectedLog.data, null, 2)}</pre>
                    </div>
                  )}

                  {selectedLog.errors && (
                    <div className={styles.detailsSection}>
                      <strong>Errors:</strong>
                      <pre>{JSON.stringify(selectedLog.errors, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
