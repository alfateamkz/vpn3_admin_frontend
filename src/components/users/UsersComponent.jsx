import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Для навигации
import "./UsersTable.scss";
import { PaginationControls } from "../pagination/PaginationComponent";

export const UsersTable = ({ getUsers }) => {
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
              <td>{new Date(user.sub_end_date).toLocaleString()}</td>
              <td>{user.balance}</td>
              <td>{new Date(user.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
