import React, { useState, useEffect, useCallback } from "react";
import "./Settings.scss";

const settingKeys = {
  referal_amount: "Выплата за приглашение реферала",
  referal_lifesplan: "Время жизни реферала",
  payout_percentage: "Процент выплаты рефералу",
  trial_period: "Длительность пробного периода",
  moderate_mode: "Режим модерации",
  allow: "Режим модерации в AppStore",
  support_username: "Аккаунт техподдержки",
  environment: "Окружение",
};

const settingDescriptions = {
  referal_amount: "Сумма в рублях, которая начисляется пользователю за приглашение реферала",
  referal_lifesplan: "Время жизни реферала в месяцах (сколько месяцев действует реферальная связь)",
  payout_percentage: "Процент от суммы пополнения, который начисляется рефералу (например, 20 = 20%)",
  trial_period: "Длительность пробного периода в днях (сколько дней пользователь может использовать VPN бесплатно)",
  moderate_mode: "Включить/выключить режим модерации (требует одобрения новых пользователей)",
  allow: "Список разрешенных версий приложения для AppStore. Версии, которые могут быть установлены через AppStore (через запятую).",
  support_username: "Telegram username аккаунта техподдержки (без @, например: MirNetVpn)",
  environment: "Окружение приложения (dev, staging, production)",
};

const unitNames = {
  rubles: "Рубли",
  months: "Месяцы",
  percentage: "Проценты",
  days: "Дни",
  bool: "Да/Нет",
  list: "Список значений",
  username: "Telegram-username",
};

export const SettingsComponent = ({
  getSettings,
  editSettings,
  editPassword,
}) => {
  const [settings, setSettings] = useState([]);
  const [editedSettings, setEditedSettings] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [newListItem, setNewListItem] = useState(""); // Для добавления новых элементов в список
  // Удаляем состояние alerts, так как оно не используется и не сохраняется

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      setSettings(data);
      // Инициализируем editedSettings с текущими значениями настроек
      const initialEditedSettings = data.reduce((acc, setting) => {
        // Для полей типа "list" убеждаемся, что значение - массив
        if (setting.unit === "list") {
          if (Array.isArray(setting.value)) {
            acc[setting.key] = setting.value;
          } else if (typeof setting.value === "string" && setting.value.trim()) {
            // Если значение - строка, разбиваем по запятой
            acc[setting.key] = setting.value.split(",").map(item => item.trim()).filter(item => item);
          } else {
            acc[setting.key] = [];
          }
        } else {
          acc[setting.key] = setting.value;
        }
        return acc;
      }, {});
      setEditedSettings(initialEditedSettings);
    } catch (e) {
      console.error("Не удалось загрузить настройки", e);
    }
  }, [getSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSettingChange = (key, value) => {
    setEditedSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddListItem = (key) => {
    const currentValues = Array.isArray(editedSettings[key])
      ? editedSettings[key]
      : [];

    if (newListItem.trim() && !currentValues.includes(newListItem.trim())) {
      handleSettingChange(key, [...currentValues, newListItem.trim()]);
      setNewListItem("");
    }
  };

  const handleRemoveListItem = (key, itemToRemove) => {
    const currentValues = Array.isArray(editedSettings[key])
      ? editedSettings[key]
      : [];

    handleSettingChange(
      key,
      currentValues.filter((item) => item !== itemToRemove)
    );
  };

  const handleSaveSetting = async (key) => {
    try {
      // Получаем настройку для определения типа
      const setting = settings.find(s => s.key === key);
      let valueToSave = editedSettings[key];
      
      // Для полей типа "list" убеждаемся, что отправляем массив
      if (setting && setting.unit === "list") {
        if (!Array.isArray(valueToSave)) {
          // Если значение не массив, преобразуем в массив
          if (typeof valueToSave === "string" && valueToSave.trim()) {
            valueToSave = valueToSave.split(",").map(item => item.trim()).filter(item => item);
          } else {
            valueToSave = [];
          }
        }
      }
      
      await editSettings({ key, value: valueToSave });
      fetchSettings(); // Обновляем настройки после сохранения
      alert("Успешно сохранено!"); // Добавляем уведомление
    } catch (e) {
      console.error("Не удалось сохранить настройку", e);
      const errorMessage = e.response?.data?.detail || e.message || "Неизвестная ошибка";
      alert("Ошибка при сохранении: " + errorMessage);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("Новые пароли не совпадают");
      return;
    }
    if (newPassword.length < 8) {
      setError("Новый пароль должен быть не менее 8 символов");
      return;
    }
    try {
      await editPassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    } catch (e) {
      console.error("Не удалось изменить пароль", e);
    }
  };

  const renderInputField = (setting) => {
    if (setting.unit === "bool") {
      const currentValue = Boolean(
        editedSettings[setting.key] === true ||
          editedSettings[setting.key] === "true" ||
          editedSettings[setting.key] === 1 ||
          editedSettings[setting.key] === "1"
      );

      return (
        <select
          value={currentValue.toString()}
          onChange={(e) => {
            const newValue = e.target.value === "true";
            handleSettingChange(setting.key, newValue);
          }}
        >
          <option value="true">Да</option>
          <option value="false">Нет</option>
        </select>
      );
    }

    if (setting.unit === "list") {
      // Получаем текущие значения, убеждаясь что это массив
      let currentValues = [];
      if (Array.isArray(editedSettings[setting.key])) {
        currentValues = editedSettings[setting.key];
      } else if (editedSettings[setting.key] !== undefined && editedSettings[setting.key] !== null) {
        // Если значение не массив, пытаемся преобразовать
        if (typeof editedSettings[setting.key] === "string" && editedSettings[setting.key].trim()) {
          currentValues = editedSettings[setting.key].split(",").map(item => item.trim()).filter(item => item);
        }
      }

      return (
        <div style={{ minWidth: "300px" }}>
          <div style={{ marginBottom: "10px" }}>
            {currentValues.length > 0 ? (
              currentValues.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}
                >
                  <span style={{ flex: 1 }}>{item}</span>
                  <button 
                    onClick={() => handleRemoveListItem(setting.key, item)}
                    style={{ 
                      padding: "2px 8px",
                      cursor: "pointer",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "3px"
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div style={{ color: "#999", fontSize: "12px", fontStyle: "italic" }}>
                Список пуст. Добавьте значения.
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <input
              type="text"
              value={newListItem}
              onChange={(e) => setNewListItem(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddListItem(setting.key);
                }
              }}
              placeholder="Новое значение"
              style={{ flex: 1, padding: "5px" }}
            />
            <button 
              onClick={() => handleAddListItem(setting.key)}
              style={{
                padding: "5px 10px",
                cursor: "pointer",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "3px"
              }}
            >
              + Добавить
            </button>
          </div>
        </div>
      );
    }

    // Для username типа (support_username) используем специальное поле
    if (setting.unit === "username") {
      return (
        <input
          type="text"
          value={editedSettings[setting.key] || ""}
          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          placeholder="Введите username без @"
        />
      );
    }

    return (
      <input
        type="text"
        value={editedSettings[setting.key] || ""}
        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
      />
    );
  };

  return (
    <div className="contentSettings">
      <h2>Настройки</h2>
      <table>
        <thead>
          <tr>
            <th>Настройка</th>
            <th>Описание</th>
            <th>Значение</th>
            <th>Единица измерения</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {settings
            .filter((setting) => {
              // Скрываем служебные настройки, которые не должны редактироваться через UI
              const hiddenSettings = ["admin_migration_completed", "environment"];
              return !hiddenSettings.includes(setting.key);
            })
            .map((setting) => (
              <tr key={setting._id}>
                <td>{settingKeys[setting.key] || setting.key}</td>
                <td style={{ fontSize: "12px", color: "#666", maxWidth: "300px" }}>
                  {settingDescriptions[setting.key] || "—"}
                </td>
                <td>{renderInputField(setting)}</td>
                <td>{unitNames[setting.unit]}</td>
                <td>
                  <button onClick={() => handleSaveSetting(setting.key)}>
                    Сохранить
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <h2>Смена пароля</h2>
      <div className="password-form">
        <div>
          <label>Старый пароль:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Новый пароль:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Подтвердите новый пароль:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button onClick={handlePasswordChange}>Сменить пароль</button>
      </div>
    </div>
  );
};
