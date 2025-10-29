import React, { useState, useEffect } from "react";
import { apiRequests } from "../../shared/api/apiRequests";
import { canManageAdmins } from "../../shared/utils/roleUtils";
import styles from "./AdminsComponent.module.scss";

export const AdminsComponent = () => {
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "support",
    is_active: true,
  });

  useEffect(() => {
    loadAdmins();
    loadRoles();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const response = await apiRequests.admins.list();
      const adminsList = Array.isArray(response.data)
        ? response.data
        : response.data?.admins || [];
      setAdmins(adminsList);
    } catch (error) {
      console.error("Ошибка при загрузке администраторов:", error);
      alert("Ошибка при загрузке администраторов");
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await apiRequests.admins.roles();
      setRoles(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке ролей:", error);
    }
  };

  const handleCreate = async () => {
    if (!formData.email || !formData.password) {
      alert("Заполните email и пароль");
      return;
    }

    setLoading(true);
    try {
      await apiRequests.admins.create(formData);
      alert("Администратор успешно создан!");
      setShowCreateModal(false);
      setFormData({
        email: "",
        password: "",
        full_name: "",
        role: "support",
        is_active: true,
      });
      loadAdmins();
    } catch (error) {
      console.error("Ошибка при создании администратора:", error);
      const errorMsg = error.response?.data?.detail || "Ошибка при создании администратора";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedAdmin) return;

    setLoading(true);
    try {
      const updateData = { ...formData };
      // Если пароль не указан, не отправляем его
      if (!updateData.password) {
        delete updateData.password;
      }

      await apiRequests.admins.update(selectedAdmin.id || selectedAdmin._id, updateData);
      alert("Администратор успешно обновлен!");
      setShowEditModal(false);
      setSelectedAdmin(null);
      loadAdmins();
    } catch (error) {
      console.error("Ошибка при обновлении администратора:", error);
      const errorMsg = error.response?.data?.detail || "Ошибка при обновлении администратора";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого администратора?")) {
      return;
    }

    setLoading(true);
    try {
      await apiRequests.admins.delete(adminId);
      alert("Администратор успешно удален!");
      loadAdmins();
    } catch (error) {
      console.error("Ошибка при удалении администратора:", error);
      const errorMsg = error.response?.data?.detail || "Ошибка при удалении администратора";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      email: admin.email || "",
      password: "",
      full_name: admin.full_name || "",
      role: admin.role || "support",
      is_active: admin.is_active !== undefined ? admin.is_active : true,
    });
    setShowEditModal(true);
  };

  const getRoleLabel = (role) => {
    const roleObj = roles.find((r) => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  if (!canManageAdmins()) {
    return (
      <div className={styles.container}>
        <h2>Управление администраторами</h2>
        <p>У вас нет прав для управления администраторами</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>👥 Управление администраторами</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className={styles.createButton}
        >
          + Создать администратора
        </button>
      </div>

      {loading && !admins.length && (
        <div className={styles.loading}>Загрузка...</div>
      )}

      {admins.length > 0 && (
        <table className={styles.adminsTable}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Имя</th>
              <th>Роль</th>
              <th>Активен</th>
              <th>Последний вход</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id || admin._id}>
                <td>{admin.email}</td>
                <td>{admin.full_name || "—"}</td>
                <td>
                  <span className={styles.roleBadge}>
                    {getRoleLabel(admin.role)}
                  </span>
                </td>
                <td>
                  {admin.is_active ? (
                    <span className={styles.activeBadge}>Активен</span>
                  ) : (
                    <span className={styles.inactiveBadge}>Неактивен</span>
                  )}
                </td>
                <td>
                  {admin.last_login
                    ? new Date(admin.last_login).toLocaleString()
                    : "—"}
                </td>
                <td>
                  <button
                    onClick={() => openEditModal(admin)}
                    className={styles.editButton}
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id || admin._id)}
                    className={styles.deleteButton}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Модальное окно создания */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Создать администратора</h3>
            <div className={styles.form}>
              <label>
                Email *
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Пароль *
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Полное имя
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                />
              </label>
              <label>
                Роль *
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <small>{roles.find((r) => r.value === formData.role)?.description}</small>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
                Активен
              </label>
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleCreate} disabled={loading} className={styles.saveButton}>
                Создать
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {showEditModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Редактировать администратора</h3>
            <div className={styles.form}>
              <label>
                Email *
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Новый пароль (оставьте пустым, чтобы не менять)
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </label>
              <label>
                Полное имя
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                />
              </label>
              <label>
                Роль *
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <small>{roles.find((r) => r.value === formData.role)?.description}</small>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
                Активен
              </label>
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleEdit} disabled={loading} className={styles.saveButton}>
                Сохранить
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

