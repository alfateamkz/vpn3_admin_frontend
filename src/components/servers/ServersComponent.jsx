import React, { useState, useEffect } from "react";
import styles from "./ServersComponent.module.scss";
import { formatBytes } from "../../shared/utils/formatBytes";
import { apiRequests } from "../../shared/api/apiRequests";

import { CreateServerModal } from "../modals/CreateServerModal";
import { PaginationControls } from "../pagination/PaginationComponent";

const statuses = {
  inactived: "Не активный",
  actived: "Активный",
  error: "Ошибка",
};

const ServersTable = ({ getServers, onEdit, onDelete, onSave, onCreate }) => {
  const [servers, setServers] = useState({ count: 0, documents: [] });
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // Количество записей на странице
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshingStats, setRefreshingStats] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServers(currentPage, limit);
        setServers(data); // Обновляем состояние серверов
        setTotalCount(data.count);
        
        // Автоматически запускаем обновление статистики в фоне
        refreshStatsInBackground(data.documents);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit]); // Зависимости useEffec

  // Обновление статистики в фоне
  const refreshStatsInBackground = async (serversList) => {
    // Обновляем статистику только для серверов без кэша или с устаревшими данными
    const serversToUpdate = serversList.filter(
      (server) =>
        server.status === "actived" &&
        (!server.inbound || server.stats_stale)
    );

    if (serversToUpdate.length > 0) {
      try {
        // Запускаем обновление в фоне (не ждем ответа)
        apiRequests.servers.refreshStats(null, false).catch((err) => {
          console.error("Ошибка обновления статистики:", err);
        });
      } catch (error) {
        console.error("Ошибка запуска обновления статистики:", error);
      }
    }
  };

  // Ручное обновление статистики
  const handleRefreshStats = async () => {
    setRefreshingStats(true);
    try {
      await apiRequests.servers.refreshStats(null, true);
      // Обновляем данные через небольшую задержку
      setTimeout(async () => {
        const data = await getServers(currentPage, limit);
        setServers(data);
        setRefreshingStats(false);
      }, 2000);
    } catch (error) {
      console.error("Ошибка обновления статистики:", error);
      setRefreshingStats(false);
    }
  };

  // Обработка редактирования строки
  const handleEdit = (index, server) => {
    setEditableRow(index);
    setEditedData({ ...server });
  };

  const handleReturnEdit = () => {
    setEditableRow(null);
  };

  // Обработка создания сервера
  const handleCreateServer = async (newServer) => {
    try {
      await onCreate(newServer); // Отправляем данные на создание сервера
      const data = await getServers(currentPage, limit); // Refetch данных после сохранения
      setTotalCount(data.count);
      setServers(data); // Обновляем состояние серверов
    } catch (error) {
      console.error("Ошибка при создании сервера:", error);
    }
  };

  // Обработка сохранения изменений
  const handleSave = async (index) => {
    try {
      await onSave(editedData); // Отправляем измененные данные на бэкенд
      const data = await getServers(currentPage, limit); // Refetch данных после сохранения
      setServers(data); // Обновляем состояние серверов
      setTotalCount(data.count);
      setEditableRow(null);
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
    }
  };

  // Обработка удаления строки
  const handleDelete = async (server_id) => {
    try {
      await onDelete(server_id); // Отправляем запрос на удаление
      const data = await getServers(currentPage, limit); // Refetch данных после сохранения
      setTotalCount(data.count);
      setServers(data); // Обновляем состояние серверов
    } catch (error) {
      console.error("Ошибка при удалении данных:", error);
    }
  };

  // Обработка изменения полей
  const handleChange = (e, key) => {
    setEditedData({
      ...editedData,
      [key]: e.target.value,
    });
  };

  // Обработка изменения статуса
  const handleStatusChange = (e) => {
    setEditedData({
      ...editedData,
      status: e.target.value,
    });
  };

  // Обработка открытия модального окна
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Обработка закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.serversTableContainer}>
      <h2>Серверы</h2>
      <div className={styles.serversHeader}>
        <p>Всего записей: {totalCount}</p>
        <div className={styles.headerButtons}>
          <button
            onClick={handleRefreshStats}
            disabled={refreshingStats}
          >
            {refreshingStats ? "Обновление..." : "🔄 Обновить статистику"}
          </button>
          <button onClick={handleOpenModal}>
            Добавить
          </button>
        </div>
      </div>
      <table className={styles.serversTable}>
        <thead>
          <tr>
            <th>Страна</th>
            {/* <th>Ссылка на подключение</th> */}
            <th>URL панели</th>
            <th>Логин</th>
            <th>Пароль</th>
            <th>Статус</th>
            <th>Выгружено</th>
            <th>Загружено</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {servers.documents.map((server, index) => (
            <tr key={index}>
              <td>
                {editableRow === index ? (
                  <input
                    type="text"
                    value={editedData.country}
                    onChange={(e) => handleChange(e, "country")}
                  />
                ) : (
                  server.country
                )}
              </td>
              {/* <td>
                {editableRow === index ? (
                  <input
                    type="text"
                    value={editedData.connect_link}
                    onChange={(e) => handleChange(e, "connect_link")}
                  />
                ) : (
                  server.connect_link.slice(0, 40) + "..." // Скрытие длинной ссылки
                )}
              </td> */}
              <td>
                {editableRow === index ? (
                  <input
                    type="text"
                    value={editedData.board_url}
                    onChange={(e) => handleChange(e, "board_url")}
                  />
                ) : (
                  <a
                    href={server.board_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {server.board_url}
                  </a>
                )}
              </td>
              <td>
                {editableRow === index ? (
                  <input
                    type="text"
                    value={editedData.board_login}
                    onChange={(e) => handleChange(e, "board_login")}
                  />
                ) : (
                  server.board_login
                )}
              </td>
              <td>
                {editableRow === index ? (
                  <input
                    type="text"
                    value={editedData.board_password}
                    onChange={(e) => handleChange(e, "board_password")}
                  />
                ) : (
                  server.board_password
                )}
              </td>
              <td>
                {editableRow === index ? (
                  <select
                    value={editedData.status}
                    onChange={handleStatusChange}
                  >
                    <option value="actived">Активный</option>
                    <option value="inactived">Не активный</option>
                  </select>
                ) : (
                  statuses[server.status]
                )}
              </td>
              <td>
                {server.inbound?.up ? (
                  <span
                    title={
                      server.stats_stale
                        ? "Данные могут быть устаревшими"
                        : ""
                    }
                    style={{
                      opacity: server.stats_stale ? 0.6 : 1,
                    }}
                  >
                    {formatBytes(server.inbound.up)}
                    {server.stats_stale && " ⚠️"}
                  </span>
                ) : (
                  <span style={{ color: "#999" }}>—</span>
                )}
              </td>
              <td>
                {server.inbound?.down ? (
                  <span
                    title={
                      server.stats_stale
                        ? "Данные могут быть устаревшими"
                        : ""
                    }
                    style={{
                      opacity: server.stats_stale ? 0.6 : 1,
                    }}
                  >
                    {formatBytes(server.inbound.down)}
                    {server.stats_stale && " ⚠️"}
                  </span>
                ) : (
                  <span style={{ color: "#999" }}>—</span>
                )}
              </td>
              <td>
                {editableRow === index ? (
                  <>
                    <button onClick={() => handleSave(index)}>Сохранить</button>
                    <button onClick={() => handleReturnEdit(index)}>
                      Отменить
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(index, server)}>
                      Редактировать
                    </button>
                    <button onClick={() => handleDelete(server._id)}>
                      Удалить
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагинация */}
      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
        totalCount={totalCount}
      />

      <CreateServerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateServer}
      />
    </div>
  );
};

export default ServersTable;
