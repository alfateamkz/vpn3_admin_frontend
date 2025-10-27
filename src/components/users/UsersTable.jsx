import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Users.scss";

import { AddBalanceModal } from "../modals/AddBalanceModal";

export const UsersTable = ({ users, onAddBalance, onBlockUser, onUnblockUser }) => {
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

  const handleBlock = async (user) => {
    if (window.confirm(`Заблокировать пользователя ${user.first_name} ${user.last_name || ""}?`)) {
      await onBlockUser(user._id);
    }
  };

  const handleUnblock = async (user) => {
    if (window.confirm(`Разблокировать пользователя ${user.first_name} ${user.last_name || ""}?`)) {
      await onUnblockUser(user._id);
    }
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
            <th>Статус</th>
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
                <span className={user.blocked ? "status-blocked" : "status-active"}>
                  {user.blocked ? "🚫 Заблокирован" : "✅ Активен"}
                </span>
              </td>
              <td>
                {user.sub_end_date
                  ? new Date(user.sub_end_date).toLocaleString()
                  : "-"}
              </td>
              <td>{user.balance}</td>
              <td>{new Date(user.created_at).toLocaleString()}</td>
              <td>
                <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                  <button onClick={() => handleAddBalance(user)} title="Пополнить баланс">
                    💰
                  </button>
                  {user.blocked ? (
                    <button onClick={() => handleUnblock(user)} style={{ background: "#28a745" }} title="Разблокировать">
                      🔓
                    </button>
                  ) : (
                    <button onClick={() => handleBlock(user)} style={{ background: "#dc3545" }} title="Заблокировать">
                      🚫
                    </button>
                  )}
                </div>
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
