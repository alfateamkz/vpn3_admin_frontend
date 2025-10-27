import React, { useState, useEffect } from "react";
import { PaginationControls } from "../pagination/PaginationComponent";
import { ReferalsTable } from "./ReferalsTable";
import "./ReferalsComponent.scss";

export const ReferalsComponent = ({ getReferals, getStats }) => {
  const [referals, setReferals] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [userSearch, setUserSearch] = useState("");

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReferals(currentPage, limit, userSearch);
        setReferals(data.referals);
        setTotalCount(data.count);
      } catch (error) {
        console.error("Ошибка при загрузке рефералов:", error);
      }
    };

    fetchData();
  }, [currentPage, limit, userSearch, getReferals]);

  // Загрузка статистики
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats(userSearch);
        setStats(data);
      } catch (error) {
        console.error("Ошибка при загрузке статистики:", error);
      }
    };

    fetchStats();
  }, [userSearch, getStats]);

  const handleUserSearchChange = (e) => {
    setUserSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="referals-container">
      <h2>Рефералы</h2>

      {/* Поиск по пользователю */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="ID пользователя для поиска рефералов (оставьте пустым для всех)"
          value={userSearch}
          onChange={handleUserSearchChange}
        />
      </div>

      {/* Статистика */}
      {stats && (
        <div className="referals-stats">
          <div className="stat-card">
            <h3>Общая статистика</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="label">Всего рефералов:</span>
                <span className="value">{stats.total_referals || 0}</span>
              </div>
              {stats.active_referals !== undefined && (
                <div className="stat-item">
                  <span className="label">Активных:</span>
                  <span className="value">{stats.active_referals}</span>
                </div>
              )}
              {stats.conversion_rate !== undefined && (
                <div className="stat-item">
                  <span className="label">Конверсия:</span>
                  <span className="value">{stats.conversion_rate}%</span>
                </div>
              )}
              {stats.total_bonuses !== undefined && (
                <div className="stat-item">
                  <span className="label">Всего бонусов:</span>
                  <span className="value">{stats.total_bonuses}₽</span>
                </div>
              )}
              {stats.unique_inviters !== undefined && (
                <div className="stat-item">
                  <span className="label">Уникальных приглашающих:</span>
                  <span className="value">{stats.unique_inviters}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <br />
      <p>Всего записей: {totalCount}</p>

      <ReferalsTable referals={referals} />

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
