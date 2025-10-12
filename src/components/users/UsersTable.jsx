import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Users.scss";

import { AddBalanceModal } from "../modals/AddBalanceModal";

export const UsersTable = ({ users, onAddBalance }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddBalance = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmitBalance = (amount) => {
    onAddBalance(selectedUser._id, amount);
    setIsModalOpen(false);
  };

  return (
    <div>
      <table className="users-table">
        <thead>
          <tr>
            <th>TG ID</th>
            <th>TG username</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Премиум</th>
            <th>Окончание подписки</th>
            <th>Баланс</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <Link to={`/users/${user._id}`}>{user.tg_id}</Link>
              </td>
              <td>{user.username}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name || "—"}</td>
              <td>{user.is_premium ? "Да" : "Нет"}</td>
              <td>
                {user.sub_end_date
                  ? new Date(user.sub_end_date).toLocaleString()
                  : "-"}
              </td>
              <td>{user.balance}</td>
              <td>{new Date(user.created_at).toLocaleString()}</td>
              <td>
                <button onClick={() => handleAddBalance(user)}>
                  Пополнить баланс
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Модальное окно для пополнения баланса */}
      <AddBalanceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitBalance}
      />
    </div>
  );
};
