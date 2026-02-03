import axiosClient from "./axiosClient";

export const newsService = {
    getAll(params = {}) {
        return axiosClient.get("/api/v1/news", { params });
    },

    getById(id) {
        return axiosClient.get(`/api/v1/news/${id}`);
    },

    search({ q, status } = {}) {
        const params = {};
        if (q) params.q = q;
        if (status) params.status = status;
        return axiosClient.get("/api/v1/news", { params });
    },

    create(data) {
        return axiosClient.post("/api/v1/news", data);
    },

    update(id, data) {
        return axiosClient.put(`/api/v1/news/${id}`, data);
    },

    softDelete(id) {
        return axiosClient.patch(`/api/v1/news/${id}/delete-flag`, {
            deleteFlag: true,
        });
    },

    recover(id) {
        return axiosClient.patch(`/api/v1/news/${id}/delete-flag`, {
            deleteFlag: false,
        });
    },
};
