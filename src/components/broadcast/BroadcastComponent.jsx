import React, { useState } from "react";
import "./BroadcastComponent.scss";
import { apiRequests } from "../../shared/api/apiRequests";

export const BroadcastComponent = () => {
  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photo, setPhoto] = useState(null);
  const [activeOnly, setActiveOnly] = useState(true);
  const [inactive30Days, setInactive30Days] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendText = async () => {
    if (!text) {
      alert("Введите текст сообщения");
      return;
    }

    // Проверка взаимоисключающих фильтров
    if (activeOnly && inactive30Days) {
      alert("Нельзя одновременно выбрать 'Только активные пользователи' и 'Неактивные 30+ дней'");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequests.broadcast.send(
        text,
        photoUrl || null,
        selectedUsers.length > 0 ? selectedUsers : null,
        activeOnly,
        inactive30Days
      );

      const resultData = result.data || result;
      alert(`Рассылка завершена!\nВсего: ${resultData.total_users}\nОтправлено: ${resultData.sent}\nОшибок: ${resultData.failed}`);
      setText("");
      setPhotoUrl("");
    } catch (error) {
      console.error("Ошибка при рассылке:", error);
      const errorMsg = error.response?.data?.detail || error.message || "Ошибка при отправке рассылки";
      alert(`Ошибка: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWithPhoto = async () => {
    if (!text) {
      alert("Введите текст сообщения");
      return;
    }

    if (!photo) {
      alert("Выберите фото");
      return;
    }

    // Проверяем размер файла (максимум 5MB для безопасности)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) {
      alert(`Файл слишком большой! Максимальный размер: ${(maxSize / 1024 / 1024).toFixed(0)}MB. Пожалуйста, сожмите изображение.`);
      return;
    }

    // Проверка взаимоисключающих фильтров
    if (activeOnly && inactive30Days) {
      alert("Нельзя одновременно выбрать 'Только активные пользователи' и 'Неактивные 30+ дней'");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequests.broadcast.sendWithPhoto(
        text,
        photo,
        selectedUsers.length > 0 ? selectedUsers : null,
        activeOnly,
        inactive30Days
      );

      const resultData = result.data || result;
      alert(`Рассылка с фото завершена!\nВсего: ${resultData.total_users}\nОтправлено: ${resultData.sent}\nОшибок: ${resultData.failed}`);
      setText("");
      setPhoto(null);
    } catch (error) {
      console.error("Ошибка при рассылке с фото:", error);
      let errorMsg = error.response?.data?.detail || error.message || "Ошибка при отправке рассылки";
      
      // Специальная обработка ошибки 413
      if (error.response?.status === 413) {
        errorMsg = "Файл слишком большой! Максимальный размер на сервере: 20MB. Выберите файл меньшего размера или сожмите изображение.";
      }
      
      alert(`Ошибка: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="broadcast-container">
      <h2>📧 Массовая рассылка</h2>

      <div className="broadcast-form">
        <div className="form-section">
          <label>Текст сообщения:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст для рассылки"
            rows={6}
          />
        </div>

        <div className="form-section">
          <label>Ссылка на фото (опционально):</label>
          <input
            type="text"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div className="form-section">
          <label>
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => {
                setActiveOnly(e.target.checked);
                if (e.target.checked) setInactive30Days(false);
              }}
            />
            Только пользователи с активной подпиской
          </label>
        </div>

        <div className="form-section">
          <label>
            <input
              type="checkbox"
              checked={inactive30Days}
              onChange={(e) => {
                setInactive30Days(e.target.checked);
                if (e.target.checked) setActiveOnly(false);
              }}
            />
            Пользователи без подписки за 30+ дней
          </label>
          <p className="hint">
            Рассылка пользователям, которые зарегистрировались ≥30 дней назад и не оформили подписку
          </p>
        </div>

        <div className="form-section">
          <label>Выбрать пользователей (опционально):</label>
          <input
            type="text"
            placeholder="Введите ID пользователей через запятую (1,2,3)"
            onChange={(e) =>
              setSelectedUsers(
                e.target.value
                  .split(",")
                  .map((id) => id.trim())
                  .filter(Boolean)
              )
            }
          />
          {selectedUsers.length > 0 && (
            <p className="info">Выбрано пользователей: {selectedUsers.length}</p>
          )}
          <p className="hint">
            Оставьте пустым для рассылки всем пользователям
          </p>
        </div>

        <div className="form-actions">
          <button onClick={handleSendText} disabled={loading}>
            {loading ? "Отправка..." : "📨 Отправить текст"}
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            style={{ display: "none" }}
            id="photo-input"
          />
          <label htmlFor="photo-input" className="file-button">
            {photo ? `📎 ${photo.name}` : "📎 Выбрать фото"}
          </label>
          {photo && (
            <button onClick={handleSendWithPhoto} disabled={loading}>
              {loading ? "Отправка..." : "📸 Отправить с фото"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

