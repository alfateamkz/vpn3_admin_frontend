import React, { useState } from "react";
import "./ModalStyles.scss";

export const AddBalanceModal = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      onSubmit(Number(amount));
      setAmount("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Пополнить баланс</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Сумма</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">Пополнить</button>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
