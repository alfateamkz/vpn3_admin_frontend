import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import styles from "./SidebarComponent.module.scss";

const menuItems = [
  { text: "Статистика", path: "/stats" },
  { text: "Серверы", path: "/servers" },
  { text: "Подписки", path: "/subs" },
  { text: "Пользователи", path: "/users" },
  { text: "Рефералы", path: "/referals" },
  { text: "Устройства", path: "/devices" },
  { text: "Рассылка", path: "/broadcast" },
  { text: "IP Белый список", path: "/ip-whitelist" },
  { text: "Логи действий", path: "/admin-actions" },
  { text: "Настройки", path: "/settings" },
  { text: "Выход", path: "/auth" },
];

export const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  // Устанавливаем активный пункт меню при монтировании компонента
  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenuItem = menuItems.find((item) => item.path === currentPath);
    if (activeMenuItem) {
      setActiveItem(activeMenuItem.text);
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    if (item.text === "Выход") {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    }
    setActiveItem(item.text);
    navigate(item.path);
  };

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item.text}
            className={`${styles.menuItem} ${
              activeItem === item.text ? styles.active : ""
            }`}
            onClick={() => handleItemClick(item)}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};
