import React, { useState } from "react";
import styles from "./MonitoringComponent.module.scss";
import AlertsComponent from "./AlertsComponent";
import AlertSettingsComponent from "./AlertSettingsComponent";

const MonitoringComponent = () => {
  const [activeTab, setActiveTab] = useState("alerts");

  return (
    <div className={styles.monitoringContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "alerts" ? styles.active : ""}`}
          onClick={() => setActiveTab("alerts")}
        >
          📊 Алерты
        </button>
        <button
          className={`${styles.tab} ${activeTab === "settings" ? styles.active : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Настройки
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "alerts" && <AlertsComponent />}
        {activeTab === "settings" && <AlertSettingsComponent />}
      </div>
    </div>
  );
};

export default MonitoringComponent;
