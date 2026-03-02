import axiosClient from "./axiosClient";

const bookingService = {
    // CUSTOMER
    create: (payload) => axiosClient.post("/bookings", payload),

    getById: (id) => axiosClient.get(`/bookings/${id}`),

    cancel: (id) => axiosClient.post(`/bookings/${id}/cancel`),

    // optional (nếu chưa có endpoint thì bỏ)
    myHistory: () => axiosClient.get("/bookings/me"),

    // STAFF
    listAll: (params) => axiosClient.get("/admin/bookings", { params }),
};

export default bookingService;