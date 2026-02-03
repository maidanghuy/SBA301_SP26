import axiosClient from "./axiosClient";

export const accountService = {
    search({ q, includeDeleted } = {}) {
        const params = {};
        if (q) params.q = q;
        if (includeDeleted !== undefined) params.includeDeleted = includeDeleted;

        return axiosClient.get("/api/v1/accounts", { params });
    },

    create(data) {
        return axiosClient.post("/api/v1/accounts", data);
    },

    update(id, data) {
        return axiosClient.put(`/api/v1/accounts/${id}`, data);
    },

    softDelete(id) {
        return axiosClient.patch(`/api/v1/accounts/${id}/delete-flag`, {
            deleteFlag: true,
        });
    },

    recover(id) {
        return axiosClient.patch(`/api/v1/accounts/${id}/delete-flag`, {
            deleteFlag: false,
        });
    },
};
