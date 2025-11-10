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
  const [usernameSearch, setUsernameSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDevices(usernameSearch, activeOnly, currentPage, limit);
        setDevices(data.devices);
        setTotalCount(data.count);
      } catch (error) {
        console.error("Ошибка при загрузке устройств:", error);
      }
    };

    fetchData();
  }, [currentPage, limit, usernameSearch, activeOnly, getDevices]);

  const handleUsernameSearchChange = (e) => {
    setUsernameSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteDevice = async (deviceId) => {
    if (!window.confirm("Вы уверены, что хотите удалить это устройство?")) {
      return;
    }

    try {
      await apiRequests.devices.delete(deviceId);
      // Обновляем список устройств после удаления
      const data = await getDevices(usernameSearch, activeOnly, currentPage, limit);
      setDevices(data.devices);
      setTotalCount(data.count);
      alert("Устройство успешно отвязано. Токен удален, сессия сброшена.");
    } catch (error) {
      console.error("Ошибка при удалении устройства:", error);
      alert(error.response?.data?.detail || "Ошибка при удалении устройства");
    }
  };

  return (
    <div className="devices-container">
      <h2>Устройства пользователей</h2>

      {/* Фильтры */}
      <div className="search-bar" style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Поиск по username пользователя (оставьте пустым для всех)"
          value={usernameSearch}
          onChange={handleUsernameSearchChange}
          style={{ flex: 1 }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => {
              setActiveOnly(e.target.checked);
              setCurrentPage(1);
            }}
          />
          <span>Только активные устройства</span>
        </label>
      </div>

      <p className="devices-count">Всего устройств: <strong>{totalCount}</strong></p>

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
