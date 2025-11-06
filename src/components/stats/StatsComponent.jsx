import React, { useState, useEffect } from "react";
import { canViewPayments } from "../../shared/utils/roleUtils";

import { PaginationControls } from "../pagination/PaginationComponent";
import { PaymentsTable } from "../payments/PaymentsComponent";
import { MetricsComponent } from "./MetricsComponent";

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
  const [geography, setGeography] = useState(null);
  const [loadingGeography, setLoadingGeography] = useState(false);

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

  // Загрузка географии при монтировании
  useEffect(() => {
    const fetchGeography = async () => {
      if (!getMetricsData) return;
      
      try {
        setLoadingGeography(true);
        const metricsData = await getMetricsData(30);
        console.log("📊 Данные метрик получены:", metricsData);
        if (metricsData && metricsData.geography) {
          console.log("🌍 Данные географии:", metricsData.geography);
          setGeography(metricsData.geography);
        } else {
          console.log("⚠️ География не найдена в данных метрик");
        }
      } catch (error) {
        console.error("Ошибка при загрузке географии:", error);
      } finally {
        setLoadingGeography(false);
      }
    };

    fetchGeography();
  }, [getMetricsData]);

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
      </div>

      {activeTab === "metrics" && getMetricsData && (
        <MetricsComponent getMetrics={getMetricsData} />
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
            {canViewPayments() && (
              <div className="stat-item">
                <h3>Сумма пополнений</h3>
                <p>{stats.replenishment_amount}</p>
              </div>
            )}
          </div>

          {/* География */}
          {loadingGeography ? (
            <div className="geography-loading">Загрузка географии...</div>
          ) : (
            <div className="geography-section">
              <h3>Географическое распределение</h3>
              {geography ? (
                <>
                  <div className="geography-stats-summary">
                    <div className="geography-stat-item">
                      <span className="geography-label">Всего стран:</span>
                      <span className="geography-value">
                        {geography.total_countries || 
                         (geography.users_by_country ? geography.users_by_country.length : 0) || 0}
                      </span>
                    </div>
                    <div className="geography-stat-item">
                      <span className="geography-label">Всего пользователей:</span>
                      <span className="geography-value">
                        {geography.total_users || 
                         (geography.users_by_country ? geography.users_by_country.reduce((sum, item) => sum + (item.users || 0), 0) : 0) || 0}
                      </span>
                    </div>
                  </div>
                  
                  {geography.users_by_country && geography.users_by_country.length > 0 && (
                <div className="geography-table-wrapper">
                  <h4>Распределение пользователей по странам</h4>
                  <table className="geography-table-simple">
                    <thead>
                      <tr>
                        <th>Страна</th>
                        <th>Пользователей</th>
                        <th>Доля</th>
                      </tr>
                    </thead>
                    <tbody>
                      {geography.users_by_country.slice(0, 10).map((item, index) => {
                        const totalUsers = geography.total_users || geography.users_by_country.reduce((sum, i) => sum + (i.users || 0), 0);
                        const percentage = totalUsers > 0 ? ((item.users / totalUsers) * 100).toFixed(1) : 0;
                        return (
                          <tr key={index}>
                            <td>{item.country || "Unknown"}</td>
                            <td><strong>{item.users || 0}</strong></td>
                            <td>{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {geography.users_by_country.length > 10 && (
                    <p className="geography-more">... и еще {geography.users_by_country.length - 10} стран</p>
                  )}
                </div>
              )}
              
              {geography.devices_by_country && geography.devices_by_country.length > 0 && (
                <div className="geography-table-wrapper" style={{ marginTop: "20px" }}>
                  <h4>Распределение устройств по странам</h4>
                  <table className="geography-table-simple">
                    <thead>
                      <tr>
                        <th>Страна</th>
                        <th>Устройств</th>
                        <th>Платформы</th>
                      </tr>
                    </thead>
                    <tbody>
                      {geography.devices_by_country.slice(0, 10).map((item, index) => {
                        const platforms = item.platforms || {};
                        const platformsList = Object.entries(platforms)
                          .map(([platform, count]) => `${platform}: ${count}`)
                          .join(", ") || "—";
                        return (
                          <tr key={index}>
                            <td>{item.country || "Unknown"}</td>
                            <td><strong>{item.devices || 0}</strong></td>
                            <td>{platformsList}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {geography.devices_by_country.length > 10 && (
                    <p className="geography-more">... и еще {geography.devices_by_country.length - 10} стран</p>
                  )}
                </div>
              )}
              
                  {(!geography.users_by_country || geography.users_by_country.length === 0) && 
                   (!geography.devices_by_country || geography.devices_by_country.length === 0) && (
                    <p className="geography-no-data">Нет данных о географическом распределении</p>
                  )}
                </>
              ) : (
                <p className="geography-no-data">Загрузка данных географии...</p>
              )}
            </div>
          )}

          {canViewPayments() && (
            <>
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
        </>
      )}
    </div>
  );
};
