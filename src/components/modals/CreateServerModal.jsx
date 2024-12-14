import React, { useState } from "react";
import "./ModalStyles.scss";

export const CreateServerModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    country: "",
    connect_link: "",
    board_url: "",
    board_login: "",
    board_password: "",
    status: "actived", // По умолчанию actived
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = "Страна обязательна";
    if (!formData.connect_link) newErrors.connect_link = "Ссылка обязательна";
    if (!formData.status) newErrors.status = "Статус обязателен";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      onCreate(formData); // Отправляем данные на создание сервера
      onClose(); // Закрываем модальное окно
    } else {
      setErrors(validationErrors);
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
            <label>Ссылка на подключение *</label>
            <input
              type="text"
              name="connect_link"
              value={formData.connect_link}
              onChange={handleChange}
            />
            {errors.connect_link && (
              <span className="error">{errors.connect_link}</span>
            )}
          </div>
          <div className="form-group">
            <label>URL панели</label>
            <input
              type="text"
              name="board_url"
              value={formData.board_url}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              name="board_login"
              value={formData.board_login}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="text"
              name="board_password"
              value={formData.board_password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Статус *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="actived">Активный</option>
              <option value="deactivated">Не активный</option>
            </select>
            {errors.status && <span className="error">{errors.status}</span>}
          </div>
          <div className="modal-buttons">
            <button type="submit">Создать</button>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
