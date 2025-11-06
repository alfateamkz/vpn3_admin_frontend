import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { canViewPayments, canManageAdmins, canExport, canEditUsers } from "../../shared/utils/roleUtils";

import styles from "./SidebarComponent.module.scss";

const getMenuItems = () => {
  const items = [
    { text: "Статистика", path: "/stats" },
    { text: "Серверы", path: "/servers" },
    { text: "Подписки", path: "/subs" },
    { text: "Пользователи", path: "/users" },
    { text: "Рефералы", path: "/referals" },
  ];
  
  // Платежи видят только админы и аналитики
  if (canViewPayments()) {
    items.push({ text: "Платежи", path: "/payment-logs" });
  }
  
  items.push(
    { text: "Заявки на вывод", path: "/payouts" },
    { text: "Устройства", path: "/devices" },
    { text: "Рассылка", path: "/broadcast" },
    { text: "IP Белый список", path: "/ip-whitelist" }
  );
  
  // Логи действий доступны только админам
  if (canEditUsers()) {
    items.push({ text: "Логи действий", path: "/admin-actions" });
  }
  
  items.push({ text: "Мониторинг", path: "/monitoring" });
  
  // Экспорт доступен всем, но с ограничениями внутри компонента
  if (canExport()) {
    items.push({ text: "Экспорт/Бэкап", path: "/export" });
  }
  
  // Администраторы видят только админы
  if (canManageAdmins()) {
    items.push({ text: "Администраторы", path: "/admins" });
  }
  
  items.push(
    { text: "Настройки", path: "/settings" },
    { text: "Выход", path: "/auth" }
  );
  
  return items;
};

export const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  // Устанавливаем активный пункт меню при монтировании компонента
  useEffect(() => {
    const currentPath = location.pathname;
    const menuItems = getMenuItems();
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

  const menuItems = getMenuItems();

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
