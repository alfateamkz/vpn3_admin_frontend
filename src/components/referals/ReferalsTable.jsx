import React from "react";

export const ReferalsTable = ({ referals }) => {
  if (!referals || referals.length === 0) {
    return <div className="no-data">Нет рефералов</div>;
  }

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("ru-RU");
  };

  const getStatusBadge = (referal) => {
    if (referal.converted) return <span className="badge success">Конвертирован</span>;
    if (referal.has_active_sub) return <span className="badge active">Активен</span>;
    return <span className="badge inactive">Неактивен</span>;
  };

  return (
    <div className="referals-table-container">
      <table className="referals-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Username</th>
            <th>ID</th>
            <th>Баланс</th>
            <th>Бонусы</th>
            <th>Подписка</th>
            <th>Статус</th>
            <th>Создан</th>
          </tr>
        </thead>
        <tbody>
          {referals.map((referal) => (
            <tr key={referal.user_id}>
              <td>
                <div className="user-info">
                  <strong>
                    {referal.first_name || "—"} {referal.last_name || ""}
                  </strong>
                </div>
              </td>
              <td>{referal.username || "—"}</td>
              <td className="tg-id">{referal.tg_id || "—"}</td>
              <td>{referal.balance || 0}₽</td>
              <td>{referal.referal_bonuses || 0}₽</td>
              <td>
                {referal.has_active_sub ? (
                  <span className="text-success">Активна</span>
                ) : (
                  <span className="text-muted">Нет</span>
                )}
              </td>
              <td>{getStatusBadge(referal)}</td>
              <td>{formatDate(referal.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
