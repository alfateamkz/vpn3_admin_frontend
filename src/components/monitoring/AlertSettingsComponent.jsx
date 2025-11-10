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

  const handleToggleAdmin = (tgId) => {
    const currentIds = settings?.notification_admin_ids || [];
    const newIds = currentIds.includes(tgId)
      ? currentIds.filter((id) => id !== tgId)
      : [...currentIds, tgId];
    handleChange("notification_admin_ids", newIds);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Подготавливаем данные для отправки - только поля из схемы AlertSettingsUpdate
      const updateData = {
        churn_enabled: settings.churn_enabled,
        churn_threshold_percent: settings.churn_threshold_percent,
        churn_threshold_count: settings.churn_threshold_count,
        churn_threshold_ratio: settings.churn_threshold_ratio,
        churn_non_renewal_days: settings.churn_non_renewal_days,
        suspicious_enabled: settings.suspicious_enabled,
        suspicious_device_limit: settings.suspicious_device_limit,
        suspicious_auth_attempts: settings.suspicious_auth_attempts,
        suspicious_ip_countries: settings.suspicious_ip_countries,
        suspicious_payment_accounts: settings.suspicious_payment_accounts,
        suspicious_download_gb: settings.suspicious_download_gb,
        suspicious_api_requests: settings.suspicious_api_requests,
        suspicious_events_threshold: settings.suspicious_events_threshold,
        registration_enabled: settings.registration_enabled,
        registration_spike_hours: settings.registration_spike_hours,
        registration_spike_ratio: settings.registration_spike_ratio,
        registration_per_minute: settings.registration_per_minute,
        registration_per_hour: settings.registration_per_hour,
        registration_per_day: settings.registration_per_day,
        registration_anomaly_ip_percent: settings.registration_anomaly_ip_percent,
        registration_anomaly_country_percent: settings.registration_anomaly_country_percent,
        telegram_notifications_enabled: settings.telegram_notifications_enabled,
        notification_admin_ids: settings.notification_admin_ids || [],
      };
      
      await apiRequests.monitoring.updateSettings(updateData);
      alert("Настройки успешно сохранены!");
      // Обновляем настройки после сохранения
      await fetchSettings();
    } catch (error) {
      console.error("Ошибка при сохранении настроек:", error);
      const errorMsg = error.response?.data?.detail || error.message || "Ошибка при сохранении настроек";
      alert(`Ошибка при сохранении настроек: ${errorMsg}`);
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
                value={settings.registration_spike_ratio || ""}
                onChange={(e) =>
                  handleChange("registration_spike_ratio", e.target.value ? parseFloat(e.target.value) || 0 : 0)
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
                value={settings.registration_per_minute || ""}
                onChange={(e) =>
                  handleChange("registration_per_minute", e.target.value ? parseInt(e.target.value) || 0 : 0)
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
                value={settings.registration_per_hour || ""}
                onChange={(e) =>
                  handleChange("registration_per_hour", e.target.value ? parseInt(e.target.value) || 0 : 0)
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
                value={settings.registration_per_day || ""}
                onChange={(e) =>
                  handleChange("registration_per_day", e.target.value ? parseInt(e.target.value) || 0 : 0)
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
            <label>Администраторы для получения уведомлений (Telegram ID):</label>
            
            {/* Список администраторов из БД с Telegram ID */}
            {admins.filter((admin) => admin.tg_id).length > 0 && (
              <div className={styles.adminCheckboxes}>
                {admins
                  .filter((admin) => admin.tg_id)
                  .map((admin) => {
                    const tgId = String(admin.tg_id);
                    return (
                      <label key={tgId} className={styles.adminCheckbox}>
                        <input
                          type="checkbox"
                          checked={
                            settings.notification_admin_ids?.includes(tgId) || false
                          }
                          onChange={() => handleToggleAdmin(tgId)}
                          disabled={!settings.telegram_notifications_enabled}
                        />
                        <span>
                          {admin.full_name || admin.email || `Admin ${admin._id || admin.id}`}
                          <span className={styles.tgId}> (TG ID: {tgId})</span>
                        </span>
                      </label>
                    );
                  })}
              </div>
            )}
            
            {/* Показываем Telegram ID, которые были добавлены вручную, но нет в списке администраторов */}
            {settings.notification_admin_ids && settings.notification_admin_ids.length > 0 && (
              <div className={styles.selectedIds}>
                {settings.notification_admin_ids
                  .filter((tgId) => {
                    // Проверяем, есть ли этот Telegram ID среди администраторов
                    return !admins.some((admin) => String(admin.tg_id) === String(tgId));
                  })
                  .map((tgId) => (
                    <div key={tgId} className={styles.selectedIdItem}>
                      <span className={styles.tgId}>TG ID: {tgId}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleAdmin(tgId)}
                        className={styles.removeButton}
                        disabled={!settings.telegram_notifications_enabled}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            )}
            
            {admins.filter((admin) => admin.tg_id).length === 0 && 
             (!settings.notification_admin_ids || settings.notification_admin_ids.length === 0) && (
              <p className={styles.noAdmins}>
                Нет администраторов с Telegram ID. Добавьте Telegram ID в профиль администратора или введите вручную ниже.
              </p>
            )}
            {/* Поле для ручного ввода Telegram ID */}
            <div className={styles.manualInput}>
              <label>
                Добавить Telegram ID вручную:
                <input
                  type="text"
                  placeholder="Например: 123456789"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.target.value) {
                      const tgId = e.target.value.trim();
                      const currentIds = settings?.notification_admin_ids || [];
                      if (!currentIds.includes(tgId) && /^\d+$/.test(tgId)) {
                        handleChange("notification_admin_ids", [...currentIds, tgId]);
                        e.target.value = "";
                      }
                    }
                  }}
                  disabled={!settings.telegram_notifications_enabled}
                />
              </label>
              <small>Введите Telegram ID и нажмите Enter для добавления</small>
            </div>
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
