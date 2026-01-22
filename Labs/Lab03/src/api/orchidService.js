import axiosClient from "./axiosClient";

export const orchidService = {
    getAll: () => axiosClient.get("/orchids"),
    getById: (id) => axiosClient.get(`/orchids/${id}`),
    search: ({ category, sortBy, q }) => {
        const params = {};

        if (category && category !== "All") {
            params.categoryId = category;
        }

        if (q) {
            params.orchidName_like = q;
        }

        if (sortBy) {
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
                default:
                    break;
            }
        }

        return axiosClient.get("/orchids", { params });
    },
};
