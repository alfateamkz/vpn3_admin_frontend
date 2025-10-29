import React, { useState, useEffect } from "react";
import styles from "./AlertSettingsComponent.module.scss";
import { apiRequests } from "../../shared/api/apiRequests";

const AlertSettingsComponent = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchSettings();
    fetchAdmins();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.monitoring.settings();
      setSettings(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке настроек:", error);
      alert("Ошибка при загрузке настроек");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      // Получаем список всех администраторов для выбора
      const response = await apiRequests.admins.list();
      // API возвращает массив или объект с admins
      const adminsList = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.admins || []);
      setAdmins(adminsList);
    } catch (error) {
      console.error("Ошибка при загрузке администраторов:", error);
    }
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleToggleAdmin = (adminId) => {
    const currentIds = settings?.notification_admin_ids || [];
    const newIds = currentIds.includes(adminId)
      ? currentIds.filter((id) => id !== adminId)
      : [...currentIds, adminId];
    handleChange("notification_admin_ids", newIds);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequests.monitoring.updateSettings(settings);
      alert("Настройки сохранены");
    } catch (error) {
      console.error("Ошибка при сохранении настроек:", error);
      alert("Ошибка при сохранении настроек");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className={styles.loading}>Загрузка настроек...</div>;
  }

  return (
    <div className={styles.settingsContainer}>
      <h2>Настройки алертов</h2>

      <div className={styles.settingsForm}>
        {/* Настройки оттока пользователей */}
        <div className={styles.section}>
          <h3>Отток пользователей</h3>
          <div className={styles.toggleGroup}>
            <label>
              <input
                type="checkbox"
                checked={settings.churn_enabled}
                onChange={(e) => handleChange("churn_enabled", e.target.checked)}
              />
              Включить мониторинг оттока
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Порог оттока (% от активных подписок):
              <input
                type="number"
                step="0.1"
                value={settings.churn_threshold_percent}
                onChange={(e) =>
                  handleChange("churn_threshold_percent", parseFloat(e.target.value))
                }
                disabled={!settings.churn_enabled}
              />
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Порог оттока (количество за сутки):
              <input
                type="number"
                value={settings.churn_threshold_count}
                onChange={(e) =>
                  handleChange("churn_threshold_count", parseInt(e.target.value))
                }
                disabled={!settings.churn_enabled}
              />
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Коэффициент роста оттока:
              <input
                type="number"
                step="0.1"
                value={settings.churn_threshold_ratio}
                onChange={(e) =>
                  handleChange("churn_threshold_ratio", parseFloat(e.target.value))
                }
                disabled={!settings.churn_enabled}
              />
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Дни не продления после окончания:
              <input
                type="number"
                value={settings.churn_non_renewal_days}
                onChange={(e) =>
                  handleChange("churn_non_renewal_days", parseInt(e.target.value))
                }
                disabled={!settings.churn_enabled}
              />
            </label>
          </div>
        </div>

        {/* Настройки подозрительной активности */}
        <div className={styles.section}>
          <h3>Подозрительная активность</h3>
          <div className={styles.toggleGroup}>
            <label>
              <input
                type="checkbox"
                checked={settings.suspicious_enabled}
                onChange={(e) => handleChange("suspicious_enabled", e.target.checked)}
              />
              Включить мониторинг подозрительной активности
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Максимум устройств под токеном:
              <input
                type="number"
                value={settings.suspicious_device_limit}
                onChange={(e) =>
                  handleChange("suspicious_device_limit", parseInt(e.target.value))
                }
                disabled={!settings.suspicious_enabled}
              />
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Попыток авторизации за 5 минут:
              <input
                type="number"
                value={settings.suspicious_auth_attempts}
                onChange={(e) =>
                  handleChange("suspicious_auth_attempts", parseInt(e.target.value))
                }
                disabled={!settings.suspicious_enabled}
              />
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Событий за сутки для пометки как подозрительный:
              <input
                type="number"
                value={settings.suspicious_events_threshold}
                onChange={(e) =>
                  handleChange("suspicious_events_threshold", parseInt(e.target.value))
                }
                disabled={!settings.suspicious_enabled}
              />
            </label>
          </div>
        </div>

        {/* Настройки роста регистраций */}
        <div className={styles.section}>
          <h3>Рост регистраций</h3>
          <div className={styles.toggleGroup}>
            <label>
              <input
                type="checkbox"
                checked={settings.registration_enabled}
                onChange={(e) => handleChange("registration_enabled", e.target.checked)}
              />
              Включить мониторинг роста регистраций
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Коэффициент роста регистраций:
              <input
                type="number"
                step="0.1"
                value={settings.registration_spike_ratio}
                onChange={(e) =>
                  handleChange("registration_spike_ratio", parseFloat(e.target.value))
                }
                disabled={!settings.registration_enabled}
              />
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Регистраций в минуту (порог):
              <input
                type="number"
                value={settings.registration_per_minute}
                onChange={(e) =>
                  handleChange("registration_per_minute", parseInt(e.target.value))
                }
                disabled={!settings.registration_enabled}
              />
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Регистраций за час (порог):
              <input
                type="number"
                value={settings.registration_per_hour}
                onChange={(e) =>
                  handleChange("registration_per_hour", parseInt(e.target.value))
                }
                disabled={!settings.registration_enabled}
              />
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Регистраций за сутки (порог):
              <input
                type="number"
                value={settings.registration_per_day}
                onChange={(e) =>
                  handleChange("registration_per_day", parseInt(e.target.value))
                }
                disabled={!settings.registration_enabled}
              />
            </label>
          </div>
        </div>

        {/* Настройки уведомлений */}
        <div className={styles.section}>
          <h3>Уведомления в Telegram</h3>
          <div className={styles.toggleGroup}>
            <label>
              <input
                type="checkbox"
                checked={settings.telegram_notifications_enabled}
                onChange={(e) =>
                  handleChange("telegram_notifications_enabled", e.target.checked)
                }
              />
              Включить отправку уведомлений в Telegram
            </label>
          </div>

          <div className={styles.adminList}>
            <label>Администраторы для получения уведомлений:</label>
            <div className={styles.adminCheckboxes}>
              {admins.map((admin) => {
                const adminId = admin._id ? String(admin._id) : admin.id;
                return (
                  <label key={adminId} className={styles.adminCheckbox}>
                    <input
                      type="checkbox"
                      checked={
                        settings.notification_admin_ids?.includes(adminId) || false
                      }
                      onChange={() => handleToggleAdmin(adminId)}
                      disabled={!settings.telegram_notifications_enabled}
                    />
                    <span>
                      {admin.full_name || admin.email || adminId}
                      {admin.tg_id && ` (TG: ${admin.tg_id})`}
                    </span>
                  </label>
                );
              })}
            </div>
            {admins.length === 0 && (
              <p className={styles.noAdmins}>Администраторы не найдены</p>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleSave} className={styles.saveButton} disabled={saving}>
            {saving ? "Сохранение..." : "💾 Сохранить настройки"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertSettingsComponent;
