import React, { useState, useEffect } from "react";
import styles from "./SubsComponent.module.scss";

import { CreateSubModal } from "../modals/CreateSubModal";

const statuses = {
  deactivated: "Не активный",
  actived: "Активный",
};

const SubsTable = ({ getData, onEdit, onDelete, onSave, onCreate }) => {
  const [items, setItems] = useState({ count: 0, documents: [] });
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // Количество записей на странице
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(currentPage, limit);
        setItems(data); // Обновляем состояние серверов
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [currentPage, limit, getData]); // Зависимости useEffec

  // Обработка редактирования строки
  const handleEdit = (index, item) => {
    setEditableRow(index);
    setEditedData({ ...item });
  };

  const handleReturnEdit = () => {
    setEditableRow(null);
  };

  // Обработка сохранения изменений
  const handleSave = async (index) => {
    try {
      await onSave(editedData); // Отправляем измененные данные на бэкенд
      const data = await getData(currentPage, limit); // Refetch данных после сохранения
      setItems(data); // Обновляем состояние серверов
      setEditableRow(null);
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
    }
  };

  // Обработка удаления строки
  const handleDelete = async (item_id) => {
    try {
      await onDelete(item_id); // Отправляем запрос на удаление
      const data = await getData(currentPage, limit); // Refetch данных после сохранения
      setItems(data); // Обновляем состояние серверов
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
  const handleCreateSub = async (newData) => {
    try {
      await onCreate(newData); // Отправляем данные на создание сервера
      const data = await getData(currentPage, limit); // Refetch данных после сохранения
      setItems(data); // Обновляем состояние серверов
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
      <h2>Подписки</h2>
      <div className={styles.serversHeader}>
        <p>Всего записей: {items.count}</p>
        <button onClick={handleOpenModal} className="blue-button">
          Добавить
        </button>
      </div>
      <table className={styles.serversTable}>
        <thead>
          <tr>
            <th>Длительность в месяцах</th>
            <th>Цена подписки</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.documents.map((item, index) => (
            <tr key={index}>
              <td>
                {editableRow === index ? (
                  <input
                    type="number"
                    value={editedData.duration_months}
                    onChange={(e) => handleChange(e, "duration_months")}
                  />
                ) : (
                  item.duration_months
                )}
              </td>
              <td>
                {editableRow === index ? (
                  <input
                    type="number"
                    value={editedData.price}
                    onChange={(e) => handleChange(e, "price")}
                  />
                ) : (
                  item.price
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
                  statuses[item.status]
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
                    <button onClick={() => handleEdit(index, item)}>
                      Редактировать
                    </button>
                    <button onClick={() => handleDelete(item._id)}>
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
          disabled={items.documents.length < limit}
        >
          Следующая
        </button>
      </div>

      <CreateSubModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateSub}
      />
    </div>
  );
};

export default SubsTable;
