import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance.js";

export const apiRequests = {
  auth: {
    login: async (body) => {
      return axiosInstance.post("/auth/login", body);
    },
  },
  stats: {
    orders: async (page, limit, type) => {
      return axiosInstance.get(
        `/stats/orders?page=${page}&limit=${limit}&type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
    },
  },
  servers: {
    all: async (page, limit) => {
      return axiosInstance.get(`/servers/all?page=${page}&limit=${limit}`);
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
      return axiosInstance.get(`/subs/all?page=${page}&limit=${limit}`);
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
};
