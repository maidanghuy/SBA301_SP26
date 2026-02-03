import axiosClient from "./axiosClient";

export const orchidService = {
    // ===== READ =====
    getAll(params = {}) {
        return axiosClient.get("/api/v1/orchids", { params });
    },

    getById(id) {
        return axiosClient.get(`/api/v1/orchids/${id}`);
    },

    // ===== SEARCH + FILTER + SORT (API thật) =====
    search({ category, sortBy, q }) {
        const params = {};

        // SEARCH
        if (q) {
            params.q = q;
        }

        // FILTER
        if (category && category !== "All") {
            params.category = category;
        }

        // SORT
        switch (sortBy) {
            case "name-asc":
                params.sort = "orchidName,asc";
                break;

            case "name-desc":
                params.sort = "orchidName,desc";
                break;

            case "special":
                params.sort = "isSpecial,desc";
                break;

            default:
                break;
        }

        return axiosClient.get("/api/v1/orchids", { params });
    },

    // ===== CREATE =====
    create(data) {
        return axiosClient.post("/api/v1/orchids", data);
    },

    // ===== UPDATE =====
    update(id, data) {
        return axiosClient.put(`/api/v1/orchids/${id}`, data);
    },

    // ===== DELETE =====
    delete(id) {
        return axiosClient.delete(`/api/v1/orchids/${id}`);
    },
};
