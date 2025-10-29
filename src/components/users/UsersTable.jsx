import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Users.scss";
import { canEditUsers, canManageBalance } from "../../shared/utils/roleUtils";

import { AddBalanceModal } from "../modals/AddBalanceModal";

export const UsersTable = ({ users, onAddBalance, onBlockUser, onUnblockUser, onRemovePremium, onRemoveBalance }) => {
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

  const handleRemovePremium = async (user) => {
    if (window.confirm(`Снять премиум подписку у ${user.first_name} ${user.last_name || ""}?`)) {
      await onRemovePremium(user._id);
    }
  };

  const handleRemoveBalance = async (user) => {
    const amount = prompt(`Введите сумму для списания с баланса пользователя ${user.first_name}:`);
    if (amount && !isNaN(amount) && amount > 0) {
      if (window.confirm(`Списать ${amount} рублей с баланса ${user.first_name}?`)) {
        await onRemoveBalance(user._id, parseInt(amount));
      }
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
                  {canManageBalance() && (
                    <>
                      <button onClick={() => handleAddBalance(user)} title="Пополнить баланс">
                        💰
                      </button>
                      <button onClick={() => handleRemoveBalance(user)} style={{ background: "#ffc107" }} title="Списать баланс">
                        ➖
                      </button>
                    </>
                  )}
                  {canEditUsers() && (
                    <>
                      {user.is_premium && (
                        <button onClick={() => handleRemovePremium(user)} style={{ background: "#ff9800" }} title="Снять премиум">
                          ⭐
                        </button>
                      )}
                      {user.blocked ? (
                        <button onClick={() => handleUnblock(user)} style={{ background: "#28a745" }} title="Разблокировать">
                          🔓
                        </button>
                      ) : (
                        <button onClick={() => handleBlock(user)} style={{ background: "#dc3545" }} title="Заблокировать">
                          🚫
                        </button>
                      )}
                    </>
                  )}
                  {!canEditUsers() && !canManageBalance() && (
                    <span style={{ color: "#999", fontSize: "11px" }}>Нет доступа</span>
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
