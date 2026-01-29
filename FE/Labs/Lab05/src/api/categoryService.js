import axiosClient from "./axiosClient";

export const categoryService = {
    getAll: () => axiosClient.get("api/v1/categories"),
};
