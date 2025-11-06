import React, { useState } from "react";
import "./ModalStyles.scss";

export const CreateServerModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    country: "",
    board_url: "",
    board_login: "",
    board_password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.country || formData.country.trim() === "") {
      newErrors.country = "Страна обязательна";
    }
    // Проверяем, что указаны либо все данные панели, либо ничего
    const hasBoardUrl = formData.board_url && formData.board_url.trim() !== "";
    const hasBoardLogin = formData.board_login && formData.board_login.trim() !== "";
    const hasBoardPassword = formData.board_password && formData.board_password.trim() !== "";
    
    if (hasBoardUrl || hasBoardLogin || hasBoardPassword) {
      // Если указано хотя бы одно поле панели, все должны быть указаны
      if (!hasBoardUrl) newErrors.board_url = "URL панели обязателен, если указаны данные панели";
      if (!hasBoardLogin) newErrors.board_login = "Логин обязателен, если указаны данные панели";
      if (!hasBoardPassword) newErrors.board_password = "Пароль обязателен, если указаны данные панели";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Отправляем только те поля, которые нужны бэкенду
      const serverData = {
        country: formData.country.trim(),
      };
      
      // Добавляем поля панели только если они заполнены
      const boardUrl = formData.board_url && formData.board_url.trim() !== "" ? formData.board_url.trim() : null;
      const boardLogin = formData.board_login && formData.board_login.trim() !== "" ? formData.board_login.trim() : null;
      const boardPassword = formData.board_password && formData.board_password.trim() !== "" ? formData.board_password.trim() : null;
      
      // Если указаны данные панели, добавляем их
      if (boardUrl || boardLogin || boardPassword) {
        serverData.board_url = boardUrl;
        serverData.board_login = boardLogin;
        serverData.board_password = boardPassword;
      }
      
      console.log("📤 Отправка данных сервера:", serverData);
      
      await onCreate(serverData);
      onClose();
      // Сбрасываем форму
      setFormData({
        country: "",
        board_url: "",
        board_login: "",
        board_password: "",
      });
    } catch (error) {
      console.error("Ошибка при создании сервера:", error);
      const errorMessage = error.response?.data?.detail || "Ошибка при создании сервера";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Создать сервер</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Страна *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            {errors.country && <span className="error">{errors.country}</span>}
          </div>
          <div className="form-group">
            <label>URL панели управления</label>
            <input
              type="text"
              name="board_url"
              value={formData.board_url}
              onChange={handleChange}
              placeholder="https://example.com:8222"
            />
            {errors.board_url && (
              <span className="error">{errors.board_url}</span>
            )}
            <small>URL панели управления VPN сервером (опционально, если не указан - сервер создается без автоматической настройки)</small>
          </div>
          <div className="form-group">
            <label>Логин панели</label>
            <input
              type="text"
              name="board_login"
              value={formData.board_login}
              onChange={handleChange}
              placeholder="admin"
            />
            {errors.board_login && (
              <span className="error">{errors.board_login}</span>
            )}
          </div>
          <div className="form-group">
            <label>Пароль панели</label>
            <input
              type="password"
              name="board_password"
              value={formData.board_password}
              onChange={handleChange}
              placeholder="password"
            />
            {errors.board_password && (
              <span className="error">{errors.board_password}</span>
            )}
            <small>Если указаны данные панели, сервер будет автоматически настроен через API</small>
          </div>
          {errors.submit && (
            <div className="form-group">
              <span className="error">{errors.submit}</span>
            </div>
          )}
          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Создание..." : "Создать"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
