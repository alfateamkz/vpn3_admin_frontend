/**
 * Утилиты для работы с ролями администраторов
 */
import Cookies from "js-cookie";

// Проверка прав доступа на основе роли
export const checkPermission = (userRole, permission) => {
  const permissions = {
    admin: [
      "users.view", "users.edit", "users.delete", "users.balance",
      "servers.view", "servers.edit", "servers.delete", "servers.create",
      "subscriptions.view", "subscriptions.edit", "subscriptions.delete", "subscriptions.create",
      "payments.view", "payments.edit", "payments.delete",
      "stats.view", "stats.export",
      "settings.view", "settings.edit",
      "admins.view", "admins.edit", "admins.delete", "admins.create",
      "logs.view", "logs.export",
      "export.csv", "export.backup", "export.import",
      "broadcast.send"
    ],
    support: [
      "users.view", "users.edit", "users.balance",
      "servers.view",
      "subscriptions.view", "subscriptions.edit", "subscriptions.create",
      "stats.view",
      "logs.view",
      "export.csv",
      "broadcast.send"
    ],
    analyst: [
      "users.view",
      "servers.view",
      "subscriptions.view",
      "stats.view", "stats.export",
      "logs.view", "logs.export",
      "export.csv"
    ]
  };
  
  const rolePermissions = permissions[userRole] || [];
  return rolePermissions.includes(permission);
};

// Получить роль пользователя из токена или хранилища
export const getUserRole = () => {
  try {
    // Получаем токен из cookies (как в axiosInstance)
    let token = Cookies.get("accessToken");
    
    // Если в cookies нет, проверяем localStorage
    if (!token) {
      token = localStorage.getItem("accessToken");
    }
    
    if (token) {
      // Декодируем JWT токен (без проверки подписи, только для получения роли на клиенте)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || "support"; // По умолчанию support
    }
  } catch (e) {
    console.error("Ошибка при получении роли:", e);
  }
  
  return "support"; // По умолчанию
};

// Проверка если пользователь - админ
export const isAdmin = () => {
  return getUserRole() === "admin";
};

// Проверка если пользователь - саппорт
export const isSupport = () => {
  return getUserRole() === "support";
};

// Проверка если пользователь - аналитик
export const isAnalyst = () => {
  return getUserRole() === "analyst";
};

// Проверка доступа к финансовым данным
export const canViewPayments = () => {
  return checkPermission(getUserRole(), "payments.view");
};

// Проверка доступа к экспорту
export const canExport = () => {
  return checkPermission(getUserRole(), "export.csv");
};

// Проверка доступа к бэкапам
export const canBackup = () => {
  return checkPermission(getUserRole(), "export.backup");
};

// Проверка доступа к управлению админами
export const canManageAdmins = () => {
  return checkPermission(getUserRole(), "admins.create");
};

// Проверка доступа к просмотру пользователей
export const canViewUsers = () => {
  return checkPermission(getUserRole(), "users.view");
};

// Проверка доступа к редактированию пользователей
export const canEditUsers = () => {
  return checkPermission(getUserRole(), "users.edit");
};

// Проверка доступа к управлению балансом пользователей
export const canManageBalance = () => {
  return checkPermission(getUserRole(), "users.balance");
};

