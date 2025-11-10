import React, { useState } from "react";
import { formatDateMoscow } from "../../shared/utils/dateUtils";

export const ReferalsTable = ({ referals }) => {
  const [tooltipStatus, setTooltipStatus] = useState(null);

  if (!referals || referals.length === 0) {
    return <div className="no-data">Нет рефералов</div>;
  }

  const statusDescriptions = {
    converted: "Конвертирован - реферал оформил подписку и принес доход приглашающему",
    active: "Активен - реферал имеет активную подписку",
    inactive: "Неактивен - реферал зарегистрирован, но не оформил подписку или подписка истекла",
  };

  const getStatusBadge = (referal) => {
    let statusType = "";
    let statusText = "";
    let description = "";

    if (referal.converted) {
      statusType = "success";
      statusText = "Конвертирован";
      description = statusDescriptions.converted;
    } else if (referal.has_active_sub) {
      statusType = "active";
      statusText = "Активен";
      description = statusDescriptions.active;
    } else {
      statusType = "inactive";
      statusText = "Неактивен";
      description = statusDescriptions.inactive;
    }

    const tooltipId = `${referal.user_id}-${statusType}`;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "5px", position: "relative" }}>
        <span className={`badge ${statusType}`}>{statusText}</span>
        <span
          className="status-help"
          onMouseEnter={() => setTooltipStatus(tooltipId)}
          onMouseLeave={() => setTooltipStatus(null)}
          style={{
            cursor: "help",
            color: "#666",
            fontSize: "14px",
            fontWeight: "bold",
            display: "inline-block",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
            textAlign: "center",
            lineHeight: "18px",
            flexShrink: 0,
          }}
          title={description}
        >
          ?
        </span>
        {tooltipStatus === tooltipId && (
          <div
            className="status-tooltip"
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
            {description}
          </div>
        )}
      </div>
    );
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
              <td>{formatDateMoscow(referal.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
