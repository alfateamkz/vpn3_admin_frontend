import React, { useState, useEffect } from "react";

import "./Users.scss";
import { PaginationControls } from "../pagination/PaginationComponent";
import { UsersTable } from "./UsersTable";
import { apiRequests } from "../../shared/api/apiRequests";
import { canViewUsers } from "../../shared/utils/roleUtils";
import { AccessDenied } from "../common/AccessDenied";

export const UsersComponent = ({ getUsers, pushBalance }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState(""); // Состояние для поиска

  // Загрузка данных при монтировании и изменении параметров
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers(currentPage, limit, search);
        setUsers(data.documents);
        setTotalCount(data.count);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [currentPage, limit, search, getUsers]);

  // Обработка изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Сбрасываем страницу на 1 при изменении поиска
  };

  const handleAddBalance = async (userId, amount) => {
    try {
      await pushBalance(userId, amount);
      // После успешного пополнения обновляем данные
      const updatedData = await getUsers(currentPage, limit, search);
      setUsers(updatedData.documents);
      setTotalCount(updatedData.count);
    } catch (error) {
      console.error("Ошибка при пополнении баланса:", error);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await apiRequests.user.block(userId);
      // Обновляем данные
      const updatedData = await getUsers(currentPage, limit, search);
      setUsers(updatedData.documents);
      setTotalCount(updatedData.count);
      alert("Пользователь заблокирован");
    } catch (error) {
      console.error("Ошибка при блокировке:", error);
      alert("Ошибка при блокировке пользователя");
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await apiRequests.user.unblock(userId);
      // Обновляем данные
      const updatedData = await getUsers(currentPage, limit, search);
      setUsers(updatedData.documents);
      setTotalCount(updatedData.count);
      alert("Пользователь разблокирован");
    } catch (error) {
      console.error("Ошибка при разблокировке:", error);
      alert("Ошибка при разблокировке пользователя");
    }
  };

  const handleRemovePremium = async (userId) => {
    try {
      await apiRequests.user.removePremium(userId);
      // Обновляем данные
      const updatedData = await getUsers(currentPage, limit, search);
      setUsers(updatedData.documents);
      setTotalCount(updatedData.count);
      alert("Премиум подписка снята");
    } catch (error) {
      console.error("Ошибка при снятии премиума:", error);
      alert("Ошибка при снятии премиум подписки");
    }
  };

  const handleRemoveBalance = async (userId, amount) => {
    try {
      await apiRequests.user.removeBalance(userId, amount);
      // Обновляем данные
      const updatedData = await getUsers(currentPage, limit, search);
      setUsers(updatedData.documents);
      setTotalCount(updatedData.count);
      alert("Баланс списан");
    } catch (error) {
      console.error("Ошибка при списании баланса:", error);
      const errorMsg = error.response?.data?.detail || "Ошибка при списании баланса";
      alert(errorMsg);
    }
  };

  return (
    <div className="users-table-container">
      <h2>Пользователи</h2>
      <p>Всего записей: {totalCount}</p>
      {/* Поле для поиска */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск по имени, фамилии или username"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

              <UsersTable 
                users={users} 
                onAddBalance={handleAddBalance}
                onBlockUser={handleBlockUser}
                onUnblockUser={handleUnblockUser}
                onRemovePremium={handleRemovePremium}
                onRemoveBalance={handleRemoveBalance}
              />

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
