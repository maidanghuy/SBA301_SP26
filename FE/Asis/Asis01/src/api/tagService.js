import axiosClient from "./axiosClient";

export const tagService = {
  getAll(params = {}) {
    return axiosClient.get("/api/v1/tags", { params });
  },
};
