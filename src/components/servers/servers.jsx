import React, { useState, useEffect } from "react";
import styles from "./servers.module.scss";

const statuses = {
  deactivated: "Не активный",
  actived: "Активный",
};

const ServersTable = ({ getServers, onEdit, onDelete, onSave }) => {
  const [servers, setServers] = useState({ count: 0, documents: [] });
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // Количество записей на странице

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
  const handleSave = (index) => {
    onSave(editedData);
    setEditableRow(null);
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

  // Пагинация
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className={styles.serversTableContainer}>
      <h2>Список серверов</h2>
      <p>Всего записей: {servers.count}</p>
      <p>Записей на странице: {servers.documents.length}</p>
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
                  server.connect_link.slice(0, 20) + "..." // Скрытие длинной ссылки
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
                  server.board_url
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
                    <button onClick={() => onDelete(server._id)}>
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
    </div>
  );
};

export default ServersTable;
