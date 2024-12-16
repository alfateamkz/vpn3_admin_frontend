import React from "react";

import "./Payments.scss";

const statuses = {
  FINISHED: "Завершено",
  PENDING: "Ожидание",
  CANCELED: "Оменено",
};
const types = { bonus: "Бонусный", money: "Реальный" };

export const PaymentsTable = ({ payments }) => {
  return (
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
        {payments.map((order) => (
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
  );
};
