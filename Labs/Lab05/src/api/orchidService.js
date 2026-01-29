import axiosClient from "./axiosClient";

export const orchidService = {
    // ===== READ =====
    getAll() {
        return axiosClient.get("/orchids");
    },

    getById(id) {
        return axiosClient.get(`/orchids/${id}`);
    },

    // ===== SEARCH + FILTER + SORT =====
    search({ category, sortBy, q }) {
        const params = {};

        // SEARCH
        if (q) {
            params.orchidName_like = q;
        }

        // FILTER
        if (category && category !== "All") {
            params.categoryId = category;
        }

        // SORT
        switch (sortBy) {
            case "name-asc":
                params._sort = "orchidName";
                params._order = "asc";
                break;

            case "name-desc":
                params._sort = "orchidName";
                params._order = "desc";
                break;

            case "special":
                params._sort = "isSpecial";
                params._order = "desc";
                break;

            case "category":
                params._sort = "categoryId";
                params._order = "asc";
                break;

            default:
                break;
        }

        return axiosClient.get("/orchids", { params });
    },

    // ===== CREATE =====
    create(data) {
        return axiosClient.post("/orchids", data);
    },

    // ===== UPDATE =====
    update(id, data) {
        return axiosClient.put(`/orchids/${id}`, data);
    },

    // ===== DELETE =====
    delete(id) {
        return axiosClient.delete(`/orchids/${id}`);
    },
};
