// import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance.js";

export const apiRequests = {
  auth: {
    login: async (body) => {
      return axiosInstance.post("/auth/login", body);
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
};
