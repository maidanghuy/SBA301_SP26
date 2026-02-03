import axiosClient from "./axiosClient";

export const authService = {
    login(username, password) {
        return axiosClient.post("/api/v1/auth/login", { username, password });
    },
};
