import React, { useState, useEffect } from "react";
import { PaginationControls } from "../pagination/PaginationComponent";
import { DevicesTable } from "./DevicesTable";
import "./DevicesComponent.scss";

export const DevicesComponent = ({ getDevices }) => {
  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [userSearch, setUserSearch] = useState("");

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDevices(userSearch, currentPage, limit);
        setDevices(data.devices);
        setTotalCount(data.count);
      } catch (error) {
        console.error("Ошибка при загрузке устройств:", error);
      }
    };

    fetchData();
  }, [currentPage, limit, userSearch, getDevices]);

  const handleUserSearchChange = (e) => {
    setUserSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="devices-container">
      <h2>Устройства пользователей</h2>

      {/* Поиск по пользователю */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="ID пользователя для фильтрации (оставьте пустым для всех)"
          value={userSearch}
          onChange={handleUserSearchChange}
        />
      </div>

      <p>Всего устройств: {totalCount}</p>

      <DevicesTable devices={devices} />

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
