import React from "react";
import "./AccessDenied.scss";

export const AccessDenied = ({ message = "У вас нет доступа к этому разделу" }) => {
  return (
    <div className="access-denied">
      <div className="access-denied-content">
        <div className="access-denied-icon">🚫</div>
        <h2>Доступ запрещен</h2>
        <p>{message}</p>
        <p className="access-denied-note">
          Обратитесь к администратору для получения необходимых прав доступа.
        </p>
      </div>
    </div>
  );
};

