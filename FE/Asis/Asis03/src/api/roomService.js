import axiosClient from "./axiosClient";

const roomService = {
    // Public
    getAll: (params) => axiosClient.get("/rooms", { params }),
    getById: (id) => axiosClient.get(`/rooms/${id}`),

    // STAFF (Admin)
    getAllAdmin: () => axiosClient.get("/admin/rooms"),
    create: (payload) => axiosClient.post("/admin/rooms", payload),
    update: (id, payload) => axiosClient.put(`/admin/rooms/${id}`, payload),
    remove: (id) => axiosClient.delete(`/admin/rooms/${id}`),
};

export default roomService;