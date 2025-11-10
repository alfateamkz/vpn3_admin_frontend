import React, { useState } from "react";
import { apiRequests } from "../../shared/api/apiRequests";
import "./LanguagesComponent.scss";

export const LanguagesComponent = () => {
  const [selectedOS, setSelectedOS] = useState("ios");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверяем, что это JSON файл
    if (!file.name.endsWith(".json")) {
      setMessage({ type: "error", text: "Пожалуйста, выберите JSON файл" });
      return;
    }

    setUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiRequests.languages.upload(selectedOS, formData);
      setMessage({ type: "success", text: `Файл для ${selectedOS} успешно загружен!` });
      
      // Очищаем input
      event.target.value = "";
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.detail || "Ошибка при загрузке файла"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (os) => {
    try {
      const response = await apiRequests.languages.download(os);
      // Создаем ссылку для скачивания
      const blob = new Blob([response.data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${os}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setMessage({ type: "success", text: `Файл ${os}.json успешно скачан!` });
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.detail || "Ошибка при скачивании файла"
      });
    }
  };

  const osOptions = [
    { value: "ios", label: "iOS", icon: "📱" },
    { value: "android", label: "Android", icon: "🤖" },
    { value: "windows", label: "Windows", icon: "🪟" },
  ];

  return (
    <div className="languages-container">
      <h2>Управление языками</h2>
      <p className="description">
        Загружайте и скачивайте файлы переводов для мобильных приложений и десктопа.
        Поддерживаются форматы: iOS, Android, Windows.
      </p>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="languages-content">
        <div className="upload-section">
          <h3>📤 Загрузить файл перевода</h3>
          <div className="os-selector">
            <label>Выберите платформу:</label>
            <div className="os-buttons">
              {osOptions.map((os) => (
                <button
                  key={os.value}
                  className={`os-button ${selectedOS === os.value ? "active" : ""}`}
                  onClick={() => setSelectedOS(os.value)}
                >
                  <span className="os-icon">{os.icon}</span>
                  {os.label}
                </button>
              ))}
            </div>
          </div>

          <div className="upload-area">
            <label className="file-input-label">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={uploading}
                className="file-input"
              />
              <span className="file-input-text">
                {uploading ? "Загрузка..." : "Выберите JSON файл"}
              </span>
            </label>
            <p className="file-hint">
              Выбранная платформа: <strong>{selectedOS.toUpperCase()}</strong>
            </p>
          </div>
        </div>

        <div className="download-section">
          <h3>📥 Скачать файл перевода</h3>
          <div className="download-buttons">
            {osOptions.map((os) => (
              <button
                key={os.value}
                className="download-button"
                onClick={() => handleDownload(os.value)}
              >
                <span className="os-icon">{os.icon}</span>
                Скачать {os.label}.json
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="info-section">
        <h4>ℹ️ Информация</h4>
        <ul>
          <li>Файлы должны быть в формате JSON</li>
          <li>При загрузке файл перезаписывает существующий</li>
          <li>Файлы используются мобильными приложениями для локализации</li>
        </ul>
      </div>
    </div>
  );
};

