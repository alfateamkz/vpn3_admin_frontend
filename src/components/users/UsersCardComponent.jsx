import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Users.scss";
import { PaginationControls } from "../pagination/PaginationComponent";
import { LogsTable } from "./LogsTable";
import { UsersTable } from "./UsersTable";
import PaymentsTableWithFilters from "../payments/PaymentsTableWithFilters"; // Импорт компонента таблицы платежей

export const UserCardComponent = ({
  getUser,
  getLogs,
  getPayments,
  getUsers,
  pushBalance,
}) => {
  const { userId } = useParams(); // Получаем userId из URL
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [referrals, setReferrals] = useState([]);
  const [search, setSearch] = useState(""); // Состояние для поиска
  const [currentRefPage, setCurrentRefPage] = useState(1);
  const [limitRefPage, setLimitRef] = useState(10);
  const [totalCountRef, setTotalCountRef] = useState(0);

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser(userId);
        setUser(data);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      }
    };

    const fetchLogs = async () => {
      try {
        const data = await getLogs(currentPage, limit, userId);
        setLogs(data.documents);
        setTotalCount(data.count_documents);
      } catch (error) {
        console.error("Ошибка при загрузке логов:", error);
      }
    };

    const fetchReferrals = async () => {
      try {
        const data = await getUsers(
          currentRefPage,
          limitRefPage,
          search,
          userId
        ); // Передаем referal_id
        setReferrals(data.documents);
        setTotalCountRef(data.count);
      } catch (error) {
        console.error("Ошибка при загрузке рефералов:", error);
      }
    };

    fetchUser();
    fetchLogs();
    fetchReferrals();
  }, [
    userId,
    getUser,
    getUsers,
    getLogs,
    currentPage,
    limit,
    search,
    currentRefPage,
    limitRefPage,
  ]);

  const handleAddBalance = async (referalId, amount) => {
    try {
      await pushBalance(referalId, amount);
      // После успешного пополнения обновляем данные
      const updatedData = await getUsers(
        currentRefPage,
        limitRefPage,
        search,
        userId
      );
      setReferrals(updatedData.documents);
    } catch (error) {
      console.error("Ошибка при пополнении баланса:", error);
    }
  };

  // Обработка изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentRefPage(1); // Сбрасываем страницу на 1 при изменении поиска
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="user-card-page">
      <h2>Карточка пользователя</h2>
      <div className="user-info">
        <div className="info-item">
          <strong>TG ID:</strong> {user.tg_id}
        </div>
        <div className="info-item">
          <strong>Имя:</strong> {user.first_name}
        </div>
        <div className="info-item">
          <strong>Фамилия:</strong> {user.last_name || "—"}
        </div>
        <div className="info-item">
          <strong>Username:</strong> {user.username}
        </div>
        <div className="info-item">
          <strong>Процент выплат:</strong> {user.payout_percentage}%
        </div>
        <div className="info-item">
          <strong>Баланс:</strong> {user.balance}
        </div>
        <div className="info-item">
          <strong>Дата создания:</strong>{" "}
          {new Date(user.created_at).toLocaleString()}
        </div>
        <div className="info-item">
          <strong>Дата обновления:</strong>{" "}
          {new Date(user.updated_at).toLocaleString()}
        </div>
        <div className="info-item">
          <strong>Окончание подписки:</strong>{" "}
          {new Date(user.sub_end_date).toLocaleString()}
        </div>
        <div className="info-item">
          <strong>Премиум:</strong> {user.is_premium ? "Да" : "Нет"}
        </div>
      </div>

      <div className="users-table-container">
        <div className="header-bar">
          <h3>Логи подключений</h3>
          <p>Всего записей: {totalCount}</p>
        </div>
        <LogsTable logs={logs} />
      </div>

      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
        totalCount={totalCount}
      />

      {/* Таблица платежей */}
      {/* <div className="payments-table-container">
        <h3>Выплаты и пополнения</h3> */}
      <PaymentsTableWithFilters getPayments={getPayments} userId={userId} />
      {/* </div> */}

      <div className="users-table-container">
        <div className="header-bar">
          <h3>Рефералы</h3>
          <p>Всего записей: {totalCountRef}</p>
        </div>
        {/* Поле для поиска */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Поиск по имени, фамилии или username"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <UsersTable users={referrals} onAddBalance={handleAddBalance} />
      </div>

      <PaginationControls
        currentPage={currentRefPage}
        setCurrentPage={setCurrentRefPage}
        limit={limitRefPage}
        setLimit={setLimitRef}
        totalCount={totalCountRef}
      />
    </div>
  );
};
