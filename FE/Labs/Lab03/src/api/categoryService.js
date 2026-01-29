import axiosClient from "./axiosClient";

export const categoryService = {
    getAll: () => axiosClient.get("/categories"),
};
