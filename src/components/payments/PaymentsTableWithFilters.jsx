import React, { useState, useEffect } from "react";
import { PaymentsTable } from "./PaymentsComponent";
import { PaginationControls } from "../pagination/PaginationComponent";
import "./PaymentsTableWithFilters.scss";

const PaymentsTableWithFilters = ({ getPayments, userId }) => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filterType, setFilterType] = useState("all");

  // Загрузка данных при монтировании и изменении параметров
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPayments(currentPage, limit, filterType, userId); // Передаем userId
        setPayments(data.documents);
        setTotalCount(data.count);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [currentPage, limit, filterType, userId, getPayments]);

  // Обработка изменения фильтра
  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1); // Сбрасываем страницу на 1 при изменении фильтра
  };

  return (
    <div className="payments-table-with-filters">
      <div className="header-bar">
        <h3>Выплаты и пополнения</h3>
        <div className="filters">
          <button
            className={filterType === "all" ? "active" : ""}
            onClick={() => handleFilterChange("all")}
          >
            Все
          </button>
          <button
            className={filterType === "bonus" ? "active" : ""}
            onClick={() => handleFilterChange("bonus")}
          >
            Бонусы
          </button>
          <button
            className={filterType === "money" ? "active" : ""}
            onClick={() => handleFilterChange("money")}
          >
            Деньги
          </button>
        </div>
        <p>Всего записей: {totalCount}</p>
      </div>

      <PaymentsTable payments={payments} />

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

export default PaymentsTableWithFilters;
