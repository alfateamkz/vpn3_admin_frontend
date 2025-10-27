import React, { useState, useEffect } from "react";
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
                <div className="bar-label">{new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                  <div className="bar-label">{new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
