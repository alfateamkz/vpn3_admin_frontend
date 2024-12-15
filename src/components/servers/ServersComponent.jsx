import React, { useState, useEffect } from "react";
import styles from "./ServersComponent.module.scss";

import { CreateServerModal } from "../modals/CreateServerModal";

const statuses = {
  deactivated: "Не активный",
  actived: "Активный",
};

const ServersTable = ({ getServers, onEdit, onDelete, onSave, onCreate }) => {
  const [servers, setServers] = useState({ count: 0, documents: [] });
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // Количество записей на странице
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServers(currentPage, limit);
        setServers(data); // Обновляем состояние серверов
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [currentPage, limit, getServers]); // Зависимости useEffec

  // Обработка редактирования строки
  const handleEdit = (index, server) => {
    setEditableRow(index);
    setEditedData({ ...server });
  };

  const handleReturnEdit = () => {
    setEditableRow(null);
  };

  // Обработка сохранения изменений
  const handleSave = async (index) => {
    try {
      await onSave(editedData); // Отправляем измененные данные на бэкенд
      const data = await getServers(currentPage, limit); // Refetch данных после сохранения
      setServers(data); // Обновляем состояние серверов
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

  // Обработка создания сервера
  const handleCreateServer = async (newServer) => {
    try {
      await onCreate(newServer); // Отправляем данные на создание сервера
      const data = await getServers(currentPage, limit); // Refetch данных после сохранения
      setServers(data); // Обновляем состояние серверов
    } catch (error) {
      console.error("Ошибка при создании сервера:", error);
    }
  };

  // Пагинация
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className={styles.serversTableContainer}>
      <h2>Серверы</h2>
      <div className={styles.serversHeader}>
        <p>Всего записей: {servers.count}</p>
        <button onClick={handleOpenModal} className="blue-button">
          Добавить
        </button>
      </div>
      <table className={styles.serversTable}>
        <thead>
          <tr>
            <th>Страна</th>
            <th>Ссылка на подключение</th>
            <th>URL панели</th>
            <th>Логин</th>
            <th>Пароль</th>
            <th>Статус</th>
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
              <td>
                {editableRow === index ? (
                  <input
                    type="text"
                    value={editedData.connect_link}
                    onChange={(e) => handleChange(e, "connect_link")}
                  />
                ) : (
                  server.connect_link.slice(0, 40) + "..." // Скрытие длинной ссылки
                )}
              </td>
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
                    <option value="deactivated">Не активный</option>
                  </select>
                ) : (
                  statuses[server.status]
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
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Предыдущая
        </button>
        <span>Страница {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={servers.documents.length < limit}
        >
          Следующая
        </button>
      </div>

      <CreateServerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateServer}
      />
    </div>
  );
};

export default ServersTable;
