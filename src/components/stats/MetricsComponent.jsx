import React, { useState, useEffect } from "react";
import { formatDateForChart } from "../../shared/utils/dateUtils";
import "./MetricsComponent.scss";

export const MetricsComponent = ({ getMetrics }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getMetrics(30);
        setMetrics(data);
      } catch (error) {
        console.error("Ошибка при загрузке метрик:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [getMetrics]);

  if (loading) {
    return <div className="loading">Загрузка метрик...</div>;
  }

  if (!metrics) {
    return <div className="no-data">Нет данных</div>;
  }

  return (
    <div className="metrics-container">
      <h2>Детальные метрики</h2>

      {/* Активные пользователи */}
      <div className="metrics-section">
        <h3>Активные пользователи</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">DAU</div>
            <div className="metric-value">{metrics.active_users.dau.unique_users}</div>
            <div className="metric-subtitle">Уникальных пользователей за день</div>
            <div className="metric-connections">Подключений: {metrics.active_users.dau.connections}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">WAU</div>
            <div className="metric-value">{metrics.active_users.wau.unique_users}</div>
            <div className="metric-subtitle">Уникальных пользователей за неделю</div>
            <div className="metric-connections">Подключений: {metrics.active_users.wau.connections}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">MAU</div>
            <div className="metric-value">{metrics.active_users.mau.unique_users}</div>
            <div className="metric-subtitle">Уникальных пользователей за месяц</div>
            <div className="metric-connections">Подключений: {metrics.active_users.mau.connections}</div>
          </div>
        </div>
      </div>

      {/* Вовлеченность */}
      <div className="metrics-section">
        <h3>Вовлеченность</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Churn Rate</div>
            <div className={`metric-value ${metrics.engagement.churn_rate > 20 ? 'high' : metrics.engagement.churn_rate > 10 ? 'medium' : 'low'}`}>
              {metrics.engagement.churn_rate}%
            </div>
            <div className="metric-subtitle">
              Ушедших пользователей: {metrics.engagement.churned_users} из {metrics.engagement.total_users}
            </div>
          </div>
        </div>
      </div>

      {/* LTV */}
      <div className="metrics-section">
        <h3>Lifetime Value</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">LTV</div>
            <div className="metric-value">{metrics.ltv.value}₽</div>
            <div className="metric-subtitle">
              Средняя выручка с платящего пользователя
            </div>
            <div className="metric-details">
              Общая выручка: {metrics.ltv.total_revenue}₽ / Платящих пользователей: {metrics.ltv.paying_users}
            </div>
          </div>
        </div>
      </div>

      {/* Выручка */}
      <div className="metrics-section">
        <h3>Выручка</h3>
        <div className="metric-card">
          <div className="metric-label">Общая выручка</div>
          <div className="metric-value">{metrics.revenue.total}₽</div>
        </div>
        <div className="revenue-chart">
          <h4>Выручка по дням (последние 7 дней)</h4>
          <div className="chart-bars">
            {metrics.revenue.daily.slice(0, 7).reverse().map((day, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-value" style={{ height: `${(day.revenue / Math.max(...metrics.revenue.daily.map(d => d.revenue))) * 100}%` }}>
                  {day.revenue}₽
                </div>
                <div className="bar-label">{formatDateForChart(day.date)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* География */}
      {metrics.geography && (
        <div className="metrics-section">
          <h3>Географическое распределение</h3>
          <div className="geography-container">
            <div className="geography-stats">
              <div className="metric-card">
                <div className="metric-label">Всего стран</div>
                <div className="metric-value">
                  {metrics.geography.total_countries || 
                   (metrics.geography.users_by_country ? metrics.geography.users_by_country.length : 0) || 0}
                </div>
                <div className="metric-subtitle">Страны с активными пользователями</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Всего пользователей</div>
                <div className="metric-value">
                  {metrics.geography.total_users || 
                   (metrics.geography.users_by_country ? metrics.geography.users_by_country.reduce((sum, item) => sum + (item.users || 0), 0) : 0) || 0}
                </div>
                <div className="metric-subtitle">Активных пользователей по странам</div>
              </div>
            </div>
            
            {/* Распределение пользователей по странам */}
            <div className="geography-table-container">
              <h4>Распределение пользователей по странам</h4>
              {metrics.geography.users_by_country && metrics.geography.users_by_country.length > 0 ? (
                <table className="geography-table">
                  <thead>
                    <tr>
                      <th>Страна</th>
                      <th>Пользователей</th>
                      <th>Доля</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.geography.users_by_country.map((item, index) => {
                      const totalUsers = metrics.geography.total_users || metrics.geography.users_by_country.reduce((sum, i) => sum + (i.users || 0), 0);
                      const percentage = totalUsers > 0 ? ((item.users / totalUsers) * 100).toFixed(1) : 0;
                      return (
                        <tr key={index}>
                          <td>
                            <span className="country-name">{item.country || "Unknown"}</span>
                          </td>
                          <td>
                            <strong>{item.users || 0}</strong>
                          </td>
                          <td>
                            <div className="percentage-bar">
                              <div 
                                className="percentage-fill" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                              <span className="percentage-text">{percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">Нет данных о распределении пользователей по странам</p>
              )}
            </div>
            
            {/* Распределение устройств по странам */}
            <div className="geography-table-container" style={{ marginTop: "20px" }}>
              <h4>Распределение устройств по странам</h4>
              {metrics.geography.devices_by_country && metrics.geography.devices_by_country.length > 0 ? (
                <table className="geography-table">
                  <thead>
                    <tr>
                      <th>Страна</th>
                      <th>Устройств</th>
                      <th>Платформы</th>
                      <th>Доля</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.geography.devices_by_country.map((item, index) => {
                      const totalDevices = metrics.geography.devices_by_country.reduce((sum, i) => sum + (i.devices || 0), 0);
                      const percentage = totalDevices > 0 ? ((item.devices / totalDevices) * 100).toFixed(1) : 0;
                      const platforms = item.platforms || {};
                      const platformsList = Object.entries(platforms)
                        .map(([platform, count]) => `${platform}: ${count}`)
                        .join(", ") || "—";
                      
                      return (
                        <tr key={index}>
                          <td>
                            <span className="country-name">{item.country || "Unknown"}</span>
                          </td>
                          <td>
                            <strong>{item.devices || 0}</strong>
                          </td>
                          <td>
                            <span className="platforms-list">{platformsList}</span>
                          </td>
                          <td>
                            <div className="percentage-bar">
                              <div 
                                className="percentage-fill" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                              <span className="percentage-text">{percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">Нет данных о распределении устройств по странам</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ошибки */}
      <div className="metrics-section">
        <h3>Ошибки подключения</h3>
        <div className="metric-card">
          <div className="metric-label">Всего ошибок</div>
          <div className="metric-value error">{metrics.errors.total_errors}</div>
          <div className="metric-subtitle">За последние 7 дней</div>
        </div>
        {metrics.errors.last_7_days.length > 0 && (
          <div className="errors-chart">
            <h4>Ошибки по дням</h4>
            <div className="chart-bars">
              {metrics.errors.last_7_days.map((day, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar-value error" style={{ height: `${(day.errors / Math.max(...metrics.errors.last_7_days.map(d => d.errors))) * 100}%` }}>
                    {day.errors}
                  </div>
                  <div className="bar-label">{formatDateForChart(day.date)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
