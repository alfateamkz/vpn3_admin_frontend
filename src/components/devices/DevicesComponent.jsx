import React, { useState, useEffect } from "react";
import { PaginationControls } from "../pagination/PaginationComponent";
import { DevicesTable } from "./DevicesTable";
import { apiRequests } from "../../shared/api/apiRequests";
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

  const handleDeleteDevice = async (deviceId) => {
    if (!window.confirm("Вы уверены, что хотите удалить это устройство?")) {
      return;
    }

    try {
      await apiRequests.devices.delete(deviceId);
      // Обновляем список устройств после удаления
      const data = await getDevices(userSearch, currentPage, limit);
      setDevices(data.devices);
      setTotalCount(data.count);
      alert("Устройство успешно удалено");
    } catch (error) {
      console.error("Ошибка при удалении устройства:", error);
      alert(error.response?.data?.detail || "Ошибка при удалении устройства");
    }
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

      <DevicesTable devices={devices} onDelete={handleDeleteDevice} />

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
