import React, { useState, useEffect } from "react";
import { apiRequests } from "../../shared/api/apiRequests";
import { canExport, canBackup, canViewPayments } from "../../shared/utils/roleUtils";
import styles from "./ExportComponent.module.scss";

export const ExportComponent = () => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [backups, setBackups] = useState([]);
  const [activeTab, setActiveTab] = useState("csv"); // csv, backup

  useEffect(() => {
    loadStatistics();
    if (canBackup()) {
      loadBackups();
    }
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await apiRequests.export.statistics();
      setStatistics(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке статистики:", error);
    }
  };

  const loadBackups = async () => {
    try {
      const response = await apiRequests.export.listBackups();
      setBackups(response.data.backups || []);
    } catch (error) {
      console.error("Ошибка при загрузке бэкапов:", error);
    }
  };

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExportUsers = async () => {
    if (!canExport()) {
      alert("Недостаточно прав для экспорта");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequests.export.usersCsv();
      downloadFile(response.data, `users_export_${new Date().toISOString().split("T")[0]}.csv`);
      alert("Экспорт пользователей завершен!");
    } catch (error) {
      console.error("Ошибка при экспорте пользователей:", error);
      alert("Ошибка при экспорте пользователей");
    } finally {
      setLoading(false);
    }
  };

  const handleExportOrders = async () => {
    if (!canExport() || !canViewPayments()) {
      alert("Недостаточно прав для экспорта финансовых данных");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequests.export.ordersCsv();
      downloadFile(response.data, `orders_export_${new Date().toISOString().split("T")[0]}.csv`);
      alert("Экспорт заказов завершен!");
    } catch (error) {
      console.error("Ошибка при экспорте заказов:", error);
      alert("Ошибка при экспорте заказов");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPaymentLogs = async () => {
    if (!canViewPayments()) {
      alert("Недостаточно прав для просмотра финансовых данных");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequests.export.paymentLogsCsv();
      downloadFile(response.data, `payment_logs_export_${new Date().toISOString().split("T")[0]}.csv`);
      alert("Экспорт логов платежей завершен!");
    } catch (error) {
      console.error("Ошибка при экспорте логов платежей:", error);
      alert("Ошибка при экспорте логов платежей");
    } finally {
      setLoading(false);
    }
  };

  const handleExportAdminLogs = async () => {
    if (!canExport()) {
      alert("Недостаточно прав для экспорта");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequests.export.adminLogsCsv();
      downloadFile(response.data, `admin_logs_export_${new Date().toISOString().split("T")[0]}.csv`);
      alert("Экспорт логов администраторов завершен!");
    } catch (error) {
      console.error("Ошибка при экспорте логов администраторов:", error);
      alert("Ошибка при экспорте логов администраторов");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!canBackup()) {
      alert("Недостаточно прав для создания бэкапа");
      return;
    }

    if (!window.confirm("Создать резервную копию базы данных? Это может занять некоторое время.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequests.export.createBackup();
      alert(`Бэкап успешно создан!\nФайл: ${response.data.filename}\nРазмер: ${response.data.size_mb} MB`);
      loadBackups();
    } catch (error) {
      console.error("Ошибка при создании бэкапа:", error);
      alert("Ошибка при создании бэкапа");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = async (backupFilename) => {
    if (!canBackup()) {
      alert("Недостаточно прав для восстановления бэкапа");
      return;
    }

    if (!window.confirm(`ВНИМАНИЕ! Восстановление из бэкапа ${backupFilename} заменит все текущие данные. Продолжить?`)) {
      return;
    }

    setLoading(true);
    try {
      await apiRequests.export.restoreBackup(backupFilename);
      alert("Бэкап успешно восстановлен!");
    } catch (error) {
      console.error("Ошибка при восстановлении бэкапа:", error);
      alert("Ошибка при восстановлении бэкапа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.exportContainer}>
      <h2>📥 Экспорт и резервное копирование</h2>

      <div className={styles.tabs}>
        <button
          className={activeTab === "csv" ? styles.active : ""}
          onClick={() => setActiveTab("csv")}
        >
          Экспорт CSV
        </button>
        {canBackup() && (
          <button
            className={activeTab === "backup" ? styles.active : ""}
            onClick={() => setActiveTab("backup")}
          >
            Резервное копирование
          </button>
        )}
      </div>

      {activeTab === "csv" && (
        <div className={styles.csvSection}>
          <h3>Экспорт данных в CSV</h3>

          {statistics && (
            <div className={styles.statistics}>
              <p>📊 Статистика:</p>
              <ul>
                <li>Пользователей: {statistics.users}</li>
                <li>Заказов: {statistics.orders}</li>
                <li>Логов платежей: {statistics.payment_logs}</li>
                <li>Логов администраторов: {statistics.admin_logs}</li>
              </ul>
            </div>
          )}

          <div className={styles.exportButtons}>
            <button
              onClick={handleExportUsers}
              disabled={loading || !canExport()}
              className={styles.exportButton}
            >
              📊 Экспорт пользователей
            </button>

            {canViewPayments() && (
              <button
                onClick={handleExportOrders}
                disabled={loading || !canExport()}
                className={styles.exportButton}
              >
                💰 Экспорт заказов
              </button>
            )}

            {canViewPayments() && (
              <button
                onClick={handleExportPaymentLogs}
                disabled={loading}
                className={styles.exportButton}
              >
                📋 Экспорт логов платежей
              </button>
            )}

            <button
              onClick={handleExportAdminLogs}
              disabled={loading || !canExport()}
              className={styles.exportButton}
            >
              👤 Экспорт логов администраторов
            </button>
          </div>
        </div>
      )}

      {activeTab === "backup" && canBackup() && (
        <div className={styles.backupSection}>
          <h3>Резервное копирование базы данных</h3>

          <div className={styles.backupActions}>
            <button
              onClick={handleCreateBackup}
              disabled={loading}
              className={styles.backupButton}
            >
              💾 Создать бэкап
            </button>
          </div>

          {backups.length > 0 && (
            <div className={styles.backupsList}>
              <h4>Доступные бэкапы:</h4>
              <table className={styles.backupsTable}>
                <thead>
                  <tr>
                    <th>Имя файла</th>
                    <th>Размер</th>
                    <th>Дата создания</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map((backup) => (
                    <tr key={backup.filename}>
                      <td>{backup.filename}</td>
                      <td>{backup.size_mb} MB</td>
                      <td>{new Date(backup.created_at).toLocaleString()}</td>
                      <td>
                        <button
                          onClick={() => handleRestoreBackup(backup.filename)}
                          disabled={loading}
                          className={styles.restoreButton}
                        >
                          Восстановить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {backups.length === 0 && (
            <p className={styles.emptyState}>Бэкапов пока нет</p>
          )}
        </div>
      )}

      {loading && (
        <div className={styles.loading}>Загрузка...</div>
      )}
    </div>
  );
};

