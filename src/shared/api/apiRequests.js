import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance.js";

export const apiRequests = {
  user: {
    login: async (body) => {
      return axiosInstance.post("/auth/login", body);
    },
    editData: async (body) => {
      return axiosInstance.put("/user/profile-edit", body);
    },
    updatePicture: async (data) => {
      return axiosInstance.postForm("/files/upload?document_type=avatar", data);
    },
    updatePassword: async (body) => {
      return axiosInstance.patch("/user/password-edit", body);
    },
    getPicture: async (avatarId) => {
      return axiosInstance.get(`/files/avatar/${avatarId}`, {
        responseType: "blob",
      });
    },
    trips: async () => {
      return axiosInstance.get(
        `/trips/get-trips?categories=roller_skates&categories=skateboard&categories=bike&categories=electric_scooters&categories=scooters&categories=unicycle`,
        {
          limit: 100,
        }
      );
    },
  },
};
