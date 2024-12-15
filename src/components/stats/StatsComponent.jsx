import React, { useState, useEffect } from "react";

import { PaginationControls } from "../pagination/PaginationComponent";

import "./StatsComponent.scss";

const statuses = {
  FINISHED: "Завершено",
  PENDING: "Ожидание",
  CANCELED: "Оменено",
};
const types = { bonus: "Бонусный", money: "Реальный" };

export const StatsTable = ({ getData }) => {
  const [stats, setStats] = useState({
    count_users: 0,
    active_subs: 0,
    count_orders: 0,
    orders: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filterType, setFilterType] = useState("all");

  // Загрузка данных при монтировании и изменении параметров
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(currentPage, limit, filterType);
        setStats(data);
        setTotalCount(data.count_orders);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [currentPage, limit, filterType, getData]);

  // Обработка изменения фильтра
  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1); // Сбрасываем страницу на 1 при изменении фильтра
  };

  return (
    <div className="payments-stats-container">
      <h2>Статистика</h2>
      <div className="stats-summary">
        <div className="stat-item">
          <h3>Количество пользователей</h3>
          <p>{stats.count_users}</p>
        </div>
        <div className="stat-item">
          <h3>Активные подписки</h3>
          <p>{stats.active_subs}</p>
        </div>
        <div className="stat-item">
          <h3>Сумма пополнений</h3>
          <p>{stats.replenishment_amount}</p>
        </div>
      </div>

      <br />
      <h2>Платежи</h2>

      <div className="filters">
        <button
          className={filterType === "all" ? "active" : ""}
          onClick={() => handleFilterChange("all")}
        >
          Все
        </button>
        <button
          className={filterType === "bonus" ? "active" : ""}
          onClick={() => handleFilterChange("bonus")}
        >
          Бонусы
        </button>
        <button
          className={filterType === "money" ? "active" : ""}
          onClick={() => handleFilterChange("money")}
        >
          Деньги
        </button>
      </div>

      <p>Всего записей: {totalCount} </p>

      <table className="payments-table">
        <thead>
          <tr>
            <th>Статус</th>
            <th>Тестовый</th>
            <th>Тип</th>
            <th>Сумма</th>
            <th>Описание</th>
            <th>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {stats.orders.map((order) => (
            <tr key={order._id}>
              <td>{statuses[order.status]}</td>
              <td>{order.testing ? "Да" : "Нет"}</td>
              <td>{types[order.type]}</td>
              <td>{order.amount} ₽</td>
              <td>{order.description}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
        totalCount={totalCount}
      />
    </div>
  );
};
