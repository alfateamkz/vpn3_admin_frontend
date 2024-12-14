import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.scss";

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
    setActiveItem(item);
  };

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        {["Серверы", "Статистика", "Пользователи", "Платежи", "Настройки"].map(
          (item) => (
            <li
              key={item}
              className={
                styles.menuItem + ` ${activeItem === item ? "active" : ""}`
              }
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          )
        )}
      </ul>
    </div>
  );
};
