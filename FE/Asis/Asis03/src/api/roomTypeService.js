import http from "./axiosClient";

const roomTypeService = {
    getAllAdmin(params) {
        return http.get("/admin/room-types", { params });
    },

    getById(id) {
        return http.get(`/admin/room-types/${id}`);
    },

    create(payload) {
        return http.post("/admin/room-types", payload);
    },

    update(id, payload) {
        return http.put(`/admin/room-types/${id}`, payload);
    },

    remove(id) {
        return http.delete(`/admin/room-types/${id}`);
    },
};

export default roomTypeService;