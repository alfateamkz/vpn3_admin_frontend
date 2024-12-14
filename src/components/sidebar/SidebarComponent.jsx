import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import styles from "./SidebarComponent.module.scss";

const menuItems = [
  "Серверы",
  "Статистика",
  "Пользователи",
  "Платежи",
  "Настройки",
  "Выход",
];

export const SideBar = () => {
  const [activeItem, setActiveItem] = useState("Серверы"); // Активный пункт меню

  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item === "Серверы") {
      navigate("/servers");
    }
    if (item === "Статистика") {
      navigate("/");
    }
    if (item === "Выход") {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      navigate("/auth");
    }
    setActiveItem(item);
  };

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item}
            className={
              styles.menuItem + ` ${activeItem === item ? "active" : ""}`
            }
            onClick={() => handleItemClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
