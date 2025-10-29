import React, { useState, useEffect } from "react";

import { PaginationControls } from "../pagination/PaginationComponent";
import { PaymentsTable } from "../payments/PaymentsComponent";
import { MetricsComponent } from "./MetricsComponent";
import PaymentLogsComponent from "../payments/PaymentLogsComponent";

import "./StatsComponent.scss";

export const StatsTable = ({ getData, getMetricsData }) => {
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
  const [activeTab, setActiveTab] = useState("stats");

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
      
      {/* Вкладки */}
      <div className="tabs">
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          Общая статистика
        </button>
        <button
          className={activeTab === "metrics" ? "active" : ""}
          onClick={() => setActiveTab("metrics")}
        >
          Метрики (DAU/WAU/MAU)
        </button>
        <button
          className={activeTab === "logs" ? "active" : ""}
          onClick={() => setActiveTab("logs")}
        >
          Логи платежей
        </button>
      </div>

      {activeTab === "metrics" && getMetricsData && (
        <MetricsComponent getMetrics={getMetricsData} />
      )}

      {activeTab === "logs" && (
        <PaymentLogsComponent />
      )}

      {activeTab === "stats" && (
        <>
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

      <PaymentsTable payments={stats.orders} />

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
