import React, { useState, useEffect, useCallback } from "react";
import "./Settings.scss";

const settingKeys = {
  referal_amount: "Выплата за приглашение реферала",
  referal_lifesplan: "Время жизни реферала",
  payout_percentage: "Процент выплаты рефералу",
  trial_period: "Длительность пробного периода",
};

const unitNames = {
  rubles: "Рубли",
  months: "Месяцы",
  percentage: "Проценты",
  days: "Дни",
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

  const handleSaveSetting = async (key) => {
    try {
      await editSettings({ key, value: editedSettings[key] });
      fetchSettings(); // Обновляем настройки после сохранения
    } catch (e) {
      console.error("Не удалось сохранить настройку", e);
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
              <td>
                <input
                  type="text"
                  value={editedSettings[setting.key] || ""}
                  onChange={(e) =>
                    handleSettingChange(setting.key, e.target.value)
                  }
                />
              </td>
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
