import React, { useState, useEffect } from "react";
import styles from "./SubsComponent.module.scss";

import { CreateSubModal } from "../modals/CreateSubModal";
import { PaginationControls } from "../pagination/PaginationComponent";

const statuses = {
  deactivated: "Не активный",
  actived: "Активный",
};

const statusDescriptions = {
  actived: "Подписка активна и доступна для покупки пользователями",
  deactivated: "Подписка неактивна и не отображается пользователям для покупки",
};

const SubsTable = ({ getData, onEdit, onDelete, onSave, onCreate }) => {
  const [items, setItems] = useState({ count: 0, documents: [] });
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // Количество записей на странице
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tooltipStatus, setTooltipStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(currentPage, limit);
        setItems(data); // Обновляем состояние подписок
        setTotalCount(data.count || data.documents?.length || 0);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [currentPage, limit, getData]); // Зависимости useEffect

  // Обработка редактирования строки
  const handleEdit = (index, item) => {
    setEditableRow(index);
    setEditedData({ ...item });
  };

  const handleReturnEdit = () => {
    setEditableRow(null);
  };

  // Обработка создания сервера
  const handleCreateSub = async (newData) => {
    try {
      await onCreate(newData); // Отправляем данные на создание сервера
      const data = await getData(currentPage, limit); // Refetch данных после сохранения
      setTotalCount(data.count_orders);
      setItems(data); // Обновляем состояние серверов
    } catch (error) {
      console.error("Ошибка при создании сервера:", error);
    }
  };

  // Обработка сохранения изменений
  const handleSave = async (index) => {
    try {
      await onSave(editedData); // Отправляем измененные данные на бэкенд
      const data = await getData(currentPage, limit); // Refetch данных после сохранения
      setItems(data); // Обновляем состояние серверов
      setTotalCount(data.count_orders);
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
      setTotalCount(data.count_orders);
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
            <th>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", position: "relative" }}>
                Статус
                <span 
                  onMouseEnter={() => setTooltipStatus("status-header")}
                  onMouseLeave={() => setTooltipStatus(null)}
                  style={{ 
                    cursor: "help", 
                    color: "#666",
                    fontSize: "14px",
                    display: "inline-block",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#e0e0e0",
                    textAlign: "center",
                    lineHeight: "18px",
                    flexShrink: 0,
                  }}
                >
                  ❓
                </span>
                {tooltipStatus === "status-header" && (
                  <div
                    style={{
                      position: "absolute",
                      backgroundColor: "#333",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      maxWidth: "300px",
                      zIndex: 1000,
                      top: "100%",
                      left: "0",
                      marginTop: "5px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    }}
                  >
                    <div>actived - подписка активна и доступна для покупки</div>
                    <div>deactivated - подписка неактивна и скрыта от пользователей</div>
                  </div>
                )}
              </div>
            </th>
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
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", position: "relative" }}>
                    <span>
                      {statuses[item.status]}
                    </span>
                    {statusDescriptions[item.status] && (
                      <>
                        <span
                          onMouseEnter={() => setTooltipStatus(`status-${item._id}`)}
                          onMouseLeave={() => setTooltipStatus(null)}
                          style={{
                            cursor: "help",
                            color: "#666",
                            fontSize: "12px",
                            display: "inline-block",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: "#e0e0e0",
                            textAlign: "center",
                            lineHeight: "16px",
                            flexShrink: 0,
                          }}
                        >
                          ?
                        </span>
                        {tooltipStatus === `status-${item._id}` && (
                          <div
                            style={{
                              position: "absolute",
                              backgroundColor: "#333",
                              color: "#fff",
                              padding: "8px 12px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              maxWidth: "250px",
                              zIndex: 1000,
                              top: "100%",
                              left: "0",
                              marginTop: "5px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                            }}
                          >
                            {statusDescriptions[item.status]}
                          </div>
                        )}
                      </>
                    )}
                  </div>
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
      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
        totalCount={totalCount}
      />

      <CreateSubModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateSub}
      />
    </div>
  );
};

export default SubsTable;
