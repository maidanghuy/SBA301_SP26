import axiosClient from "./axiosClient";

export const categoryService = {
    // ===== READ =====
    getAll(params = {}) {
        return axiosClient.get("/api/v1/categories", { params });
    },

    getById(categoryId) {
        return axiosClient.get(`/api/v1/categories/${categoryId}`);
    },

    // ===== SEARCH + FILTER + SORT =====
    search({ q, isActive, sortBy }) {
        const params = {};

        // SEARCH
        if (q) {
            params.q = q;
        }

        // FILTER
        if (isActive !== undefined) {
            params.isActive = isActive;
        }

        // SORT
        switch (sortBy) {
            case "name-asc":
                params._sort = "categoryName";
                params._order = "asc";
                break;

            case "name-desc":
                params._sort = "categoryName";
                params._order = "desc";
                break;

            default:
                break;
        }

        return axiosClient.get("/api/v1/categories", { params });
    },

    // ===== CREATE =====
    create(data) {
        return axiosClient.post("/api/v1/categories", data);
    },

    // ===== UPDATE =====
    update(categoryId, data) {
        return axiosClient.put(`/api/v1/categories/${categoryId}`, data);
    },

    // ===== DELETE =====
    softDelete(id) {
        return axiosClient.patch(`/api/v1/categories/${id}/delete-flag`, {
            deleteFlag: true
        });
    },

    // ===== RECOVER =====
    recover(id) {
        return axiosClient.patch(`/api/v1/categories/${id}/delete-flag`, {
            deleteFlag: false
        });
    },
};
