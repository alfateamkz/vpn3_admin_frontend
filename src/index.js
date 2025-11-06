import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./shared/store/store";
import { loadConfig } from "./shared/config/configLoader";
import { updateAxiosBaseURL } from "./shared/api/axiosInstance";
import { setConfig } from "./shared/store/configSlice";

// Загружаем конфигурацию перед рендером приложения
loadConfig()
  .then((config) => {
    console.log("✅ Конфигурация загружена перед стартом:", config);
    
    // Обновляем baseURL в axios
    updateAxiosBaseURL();
    
    // Сохраняем конфиг в store
    store.dispatch(setConfig(config));
    
    // Рендерим приложение
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      //   <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
      //   </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("❌ Критическая ошибка загрузки конфигурации:", error);
    
    // Рендерим приложение с fallback конфигом
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    );
  });
