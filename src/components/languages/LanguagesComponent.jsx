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

      <div className="instructions-section">
        <h4>📚 Инструкция по добавлению нового языка</h4>
        
        <div className="instruction-step">
          <h5>Шаг 1: Скачайте текущий файл</h5>
          <p>Нажмите кнопку "Скачать" для нужной платформы (iOS, Android или Windows)</p>
        </div>

        <div className="instruction-step">
          <h5>Шаг 2: Откройте файл в текстовом редакторе</h5>
          <p>Используйте любой редактор: VS Code, Notepad++, Sublime Text или даже обычный Блокнот</p>
        </div>

        <div className="instruction-step">
          <h5>Шаг 3: Добавьте новый язык</h5>
          <p>Структура файла выглядит так:</p>
          <pre className="code-example">
{`{
  "ru": {
    "Connected": "Подключен",
    "Connect": "Подключить"
  },
  "en": {
    "Connected": "Connected",
    "Connect": "Connect"
  }
}`}
          </pre>
          <p>Чтобы добавить новый язык (например, казахский "kz"), добавьте после последнего языка:</p>
          <pre className="code-example">
{`{
  "ru": { ... },
  "en": { ... },
  "kz": {
    "Connected": "Қосылған",
    "Connect": "Қосу"
  }
}`}
          </pre>
        </div>

        <div className="instruction-step">
          <h5>⚠️ ВАЖНО для всех платформ:</h5>
          <ul className="important-list">
            <li><strong>Все ключи должны быть одинаковыми</strong> во всех языках</li>
            <li><strong>Скопируйте ВСЕ ключи</strong> из существующего языка (ru или en)</li>
            <li><strong>Переведите только значения</strong>, не меняйте названия ключей</li>
            <li><strong>Не добавляйте новые ключи</strong> без обновления всех языков</li>
            <li><strong>Не удаляйте ключи</strong> из существующих языков</li>
          </ul>
        </div>

        <div className="instruction-step">
          <h5>📱 Особенности для iOS:</h5>
          <p>В iOS файле ключи используют точечную нотацию:</p>
          <pre className="code-example">
{`"unauth.title": "Вы не авторизованы",
"main.connection_status.connected": "Подключено"`}
          </pre>
          <p>iOS файл содержит больше ключей, чем Android/Windows - будьте внимательны!</p>
        </div>

        <div className="instruction-step">
          <h5>🤖 Особенности для Android:</h5>
          <p>В Android файле используются простые ключи:</p>
          <pre className="code-example">
{`"Connected": "Подключен",
"Connect": "Подключить"`}
          </pre>
        </div>

        <div className="instruction-step">
          <h5>🪟 Особенности для Windows:</h5>
          <p>Структура аналогична Android - простые ключи:</p>
          <pre className="code-example">
{`"Connected": "Подключен",
"Connect": "Подключить"`}
          </pre>
        </div>

        <div className="instruction-step">
          <h5>✅ Чек-лист перед загрузкой:</h5>
          <ul className="checklist">
            <li>✓ Все ключи скопированы из существующего языка</li>
            <li>✓ Все значения переведены на новый язык</li>
            <li>✓ JSON синтаксис корректен (проверьте на jsonlint.com)</li>
            <li>✓ Нет лишних запятых в конце</li>
            <li>✓ Все кавычки закрыты</li>
            <li>✓ Код языка правильный (ru, en, kz, de, fr, и т.д.)</li>
          </ul>
        </div>

        <div className="instruction-step">
          <h5>🐛 Частые ошибки:</h5>
          <div className="error-examples">
            <div className="error-item">
              <strong>❌ Лишняя запятая:</strong>
              <pre className="code-example error">
{`{
  "ru": { ... },
  "en": { ... },  // ← лишняя запятая!
}`}
              </pre>
            </div>
            <div className="error-item">
              <strong>❌ Отсутствующий ключ:</strong>
              <pre className="code-example error">
{`"ru": {
  "Connected": "Подключен",
  "Connect": "Подключить"
},
"kz": {
  "Connected": "Қосылған"
  // ← отсутствует "Connect"!
}`}
              </pre>
            </div>
          </div>
        </div>

        <div className="instruction-step">
          <h5>💡 Советы:</h5>
          <ul>
            <li>Используйте JSON валидатор перед загрузкой: <a href="https://jsonlint.com" target="_blank" rel="noopener noreferrer">jsonlint.com</a></li>
            <li>Делайте резервные копии файлов перед редактированием</li>
            <li>Проверяйте переводы с носителями языка</li>
            <li>Тестируйте после загрузки в приложении</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

