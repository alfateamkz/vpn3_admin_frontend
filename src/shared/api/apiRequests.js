// import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance.js";

export const apiRequests = {
  auth: {
    login: async (body) => {
      return axiosInstance.post("/auth/login", body);
    },
  },
  admins: {
    list: async () => {
      return axiosInstance.get("/auth/admins");
    },
  },
  stats: {
    orders: async (page, limit, type) => {
      return axiosInstance.get("/stats/orders", {
        params: {
          page,
          limit,
          type,
        },
      });
    },
    metrics: async (days = 30) => {
      return axiosInstance.get("/stats/metrics", {
        params: {
          days,
        },
      });
    },
    installations: async (days = 30) => {
      return axiosInstance.get("/stats/installations", {
        params: {
          days,
        },
      });
    },
  },
  servers: {
    all: async (page, limit) => {
      return axiosInstance.get("/servers/all", {
        params: {
          page,
          limit,
        },
      });
    },
    add: async (body) => {
      return axiosInstance.post("/servers/add", body);
    },
    edit: async (body) => {
      return axiosInstance.put(`/servers/update/${body._id}`, body);
    },
    delete: async (server_id) => {
      return axiosInstance.delete(`/servers/delete/${server_id}`);
    },
    getStats: async (server_id) => {
      return axiosInstance.get(`/servers/stats/${server_id}`);
    },
    refreshStats: async (server_id = null, force = false) => {
      return axiosInstance.post("/servers/stats/refresh", null, {
        params: {
          server_id: server_id || undefined,
          force: force,
        },
      });
    },
  },
  subs: {
    all: async (page, limit) => {
      return axiosInstance.get("/subs/all", {
        params: {
          page,
          limit,
        },
      });
    },
    add: async (body) => {
      return axiosInstance.post("/subs/add", body);
    },
    edit: async (body) => {
      return axiosInstance.put(`/subs/update/${body._id}`, body);
    },
    delete: async (server_id) => {
      return axiosInstance.delete(`/subs/delete/${server_id}`);
    },
  },
  user: {
    all: async (page, limit, search, referal_id = null) => {
      const params = {
        page,
        limit,
        search,
      };

      // Добавляем referal_id только если он указан
      if (referal_id !== null) {
        params.referal_id = referal_id;
      }

      return axiosInstance.get("/users/all", {
        params,
      });
    },
    one: async (user_id) => {
      return axiosInstance.get(`/users/one/${user_id}`);
    },
    edit: async (body) => {
      return axiosInstance.put(`/users/one/${body._id}`, body);
    },
    pushBalance: async (_id, body) => {
      return axiosInstance.post(`/users/push-balance/${_id}`, body);
    },
    logs: async (page, limit, user_id) => {
      const params = {
        page,
        limit,
        user_id,
      };

      return axiosInstance.get("/users/connect-logs", {
        params,
      });
    },
    block: async (user_id) => {
      return axiosInstance.put(`/users/block/${user_id}`);
    },
    unblock: async (user_id) => {
      return axiosInstance.put(`/users/unblock/${user_id}`);
    },
    removePremium: async (user_id) => {
      return axiosInstance.put(`/users/remove-premium/${user_id}`);
    },
    removeBalance: async (user_id, amount) => {
      return axiosInstance.put(`/users/remove-balance/${user_id}`, null, {
        params: { amount }
      });
    },
  },
  payments: {
    all: async (page, limit, type, user_id = null) => {
      const params = {
        page,
        limit,
        type,
      };

      // Добавляем user_id только если он указан
      if (user_id !== null) {
        params.user_id = user_id;
      }

      return axiosInstance.get("/payments/all", {
        params,
      });
    },
    logs: async (page = 1, limit = 50, logType = null, paymentMethod = null, status = null, userId = null, orderId = null) => {
      const params = { page, limit };
      if (logType) params.log_type = logType;
      if (paymentMethod) params.payment_method = paymentMethod;
      if (status) params.status = status;
      if (userId) params.user_id = userId;
      if (orderId) params.order_id = orderId;
      return axiosInstance.get("/payments/logs", { params });
    },
    log: async (logId) => {
      return axiosInstance.get(`/payments/logs/${logId}`);
    },
    refund: async (orderId, paymentId = null, amount = null) => {
      const payload = {
        order_id: orderId,
        amount: amount,
      };
      // Добавляем payment_id только если он указан
      if (paymentId) {
        payload.payment_id = paymentId;
      }
      return axiosInstance.post("/payments/refund", payload);
    },
  },
  settings: {
    all: async () => {
      return axiosInstance.get("/settings/all");
    },
    edit: async (body) => {
      return axiosInstance.put("/settings/update", body);
    },
    editPassword: async (body) => {
      return axiosInstance.put("/settings/edit-password", body);
    },
  },
  referals: {
    list: async (page = 1, limit = 10, user_id = null) => {
      const params = {
        page,
        limit,
      };
      if (user_id !== null) {
        params.user_id = user_id;
      }
      return axiosInstance.get("/referals/referals", { params });
    },
    stats: async (user_id = null) => {
      const params = user_id ? { user_id } : {};
      return axiosInstance.get("/referals/referals/stats", { params });
    },
    details: async (referal_id) => {
      return axiosInstance.get(`/referals/referals/${referal_id}/details`);
    },
  },
  devices: {
    list: async (user_id = null, page = 1, limit = 50) => {
      const params = { page, limit };
      if (user_id !== null) {
        params.user_id = user_id;
      }
      return axiosInstance.get("/devices/admin/list", { params });
    },
    listByUser: async (userId) => {
      return axiosInstance.get(`/devices/list`);
    },
    delete: async (device_id) => {
      return axiosInstance.delete(`/devices/${device_id}`);
    },
  },
  adminActions: {
    list: async (page = 1, limit = 50, filters = {}) => {
      const params = { page, limit, ...filters };
      return axiosInstance.get("/auth/actions", { params });
    },
  },
  broadcast: {
    send: async (text, photoUrl, userIds, activeOnly) => {
      return axiosInstance.post("/broadcast/send", {
        text,
        photo_url: photoUrl,
        user_ids: userIds,
        active_only: activeOnly,
      });
    },
    sendWithPhoto: async (text, photo, userIds, activeOnly) => {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("photo", photo);
      if (userIds) {
        userIds.forEach((id) => formData.append("user_ids", id));
      }
      formData.append("active_only", activeOnly);
      return axiosInstance.post("/broadcast/send-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  },
  ipWhitelist: {
    add: async (ipAddress, description) => {
      const formData = new FormData();
      formData.append("ip_address", ipAddress);
      if (description) {
        formData.append("description", description);
      }
      return axiosInstance.post("/ip-whitelist/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    remove: async (ipAddress) => {
      return axiosInstance.delete(`/ip-whitelist/remove/${ipAddress}`);
    },
    list: async (page = 1, limit = 50) => {
      return axiosInstance.get("/ip-whitelist/list", {
        params: { page, limit },
      });
    },
    publicList: async () => {
      return axiosInstance.get("/ip-whitelist/public/list");
    },
    toggle: async (ipAddress, isActive) => {
      const formData = new FormData();
      formData.append("is_active", isActive);
      return axiosInstance.put(`/ip-whitelist/toggle/${ipAddress}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    check: async (ipAddress) => {
      return axiosInstance.get(`/ip-whitelist/check/${ipAddress}`);
    },
  },
  monitoring: {
    alerts: async (page = 1, limit = 50, status = null, alertType = null, severity = null) => {
      const params = { page, limit };
      if (status) params.status = status;
      if (alertType) params.alert_type = alertType;
      if (severity) params.severity = severity;
      return axiosInstance.get("/monitoring/alerts", { params });
    },
    alert: async (alertId) => {
      return axiosInstance.get(`/monitoring/alerts/${alertId}`);
    },
    resolveAlert: async (alertId) => {
      return axiosInstance.post(`/monitoring/alerts/${alertId}/resolve`);
    },
    dismissAlert: async (alertId) => {
      return axiosInstance.post(`/monitoring/alerts/${alertId}/dismiss`);
    },
    settings: async () => {
      return axiosInstance.get("/monitoring/settings");
    },
    updateSettings: async (settings) => {
      return axiosInstance.put("/monitoring/settings", settings);
    },
    check: async () => {
      return axiosInstance.post("/monitoring/check");
    },
  },
};
