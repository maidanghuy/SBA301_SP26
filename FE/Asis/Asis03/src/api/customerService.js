import axiosClient from "./axiosClient";

const customerService = {
    // CUSTOMER
    myProfile: () => axiosClient.get("/customers/me"),

    updateMyProfile: (payload) =>
        axiosClient.patch("/customers/me", payload),

    // STAFF
    list: (params) =>
        axiosClient.get("/admin/customers", { params }),

    update: (id, payload) =>
        axiosClient.put(`/admin/customers/${id}`, payload),

    remove: (id) =>
        axiosClient.delete(`/admin/customers/${id}`),
};

export default customerService;