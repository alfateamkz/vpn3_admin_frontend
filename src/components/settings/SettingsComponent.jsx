import React, { useState, useEffect, useCallback } from "react";
import "./Settings.scss";

const settingKeys = {
  referal_amount: "Выплата за приглашение реферала",
  referal_lifesplan: "Время жизни реферала",
  payout_percentage: "Процент выплаты рефералу",
  trial_period: "Длительность пробного периода",
  moderate_mode: "Режим модерации",
  allow: "Разрешённые версии",
  support_username: "Аккаунт техподдержки",
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
  const [alerts, setAlerts] = useState({
    "Падение сервера": false,
    "Превышение нагрузки": false,
    "Резкий отток пользователей": false,
    "Новый платёж": false,
    "Cбой API": false,
  });

  const handleCheckboxChange = (alertName) => {
    setAlerts((prev) => ({
      ...prev,
      [alertName]: !prev[alertName],
    }));
  };

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      setSettings(data);
      // Инициализируем editedSettings с текущими значениями настроек
      const initialEditedSettings = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
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
      await editSettings({ key, value: editedSettings[key] });
      fetchSettings(); // Обновляем настройки после сохранения
      alert("Успешно сохранено!"); // Добавляем уведомление
    } catch (e) {
      console.error("Не удалось сохранить настройку", e);
      alert("Ошибка при сохранении!" + e);
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
      const currentValues = Array.isArray(editedSettings[setting.key])
        ? editedSettings[setting.key]
        : [];

      return (
        <div>
          <div style={{ marginBottom: "10px" }}>
            {currentValues.map((item) => (
              <div
                key={item}
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span>{item}</span>
                <button onClick={() => handleRemoveListItem(setting.key, item)}>
                  ×
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <input
              type="text"
              value={newListItem}
              onChange={(e) => setNewListItem(e.target.value)}
              placeholder="Новое значение"
            />
            <button onClick={() => handleAddListItem(setting.key)}>
              + Добавить
            </button>
          </div>
        </div>
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
            <th>Значение</th>
            <th>Единица измерения</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((setting) => (
            <tr key={setting._id}>
              <td>{settingKeys[setting.key]}</td>
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

      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h3 style={{ marginBottom: "20px", color: "#333" }}>Алерты телеграм</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Object.keys(alerts).map((alert) => (
            <label
              key={alert}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                padding: "2px 0",
              }}
            >
              <input
                type="checkbox"
                checked={alerts[alert]}
                onChange={() => handleCheckboxChange(alert)}
                style={{ width: "16px", height: "16px" }}
              />
              <span>{alert}</span>
            </label>
          ))}
        </div>
      </div>

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
