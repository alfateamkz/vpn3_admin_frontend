import React, { useState } from "react";
import "./ModalStyles.scss";

export const CreateSubModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    duration_months: 0,
    price: 0,
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
    if (!formData.duration_months)
      newErrors.duration_months = "Укажите длительность";
    if (!formData.price) newErrors.price = "Укажите цену";
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
        <h2>Создать подписку</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Длительность в месяцах *</label>
            <input
              type="number"
              name="duration_months"
              value={formData.duration_months}
              onChange={handleChange}
            />
            {errors.duration_months && (
              <span className="error">{errors.duration_months}</span>
            )}
          </div>
          <div className="form-group">
            <label>Цена *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.connect_link && (
              <span className="error">{errors.price}</span>
            )}
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
