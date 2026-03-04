import axiosClient, { refreshClient } from "./axiosClient";

const authService = {
    // login returns the `data` object from backend wrapper
    // backend expects { username, password }
    login: (username, password) =>
        axiosClient.post("/auth/login", { username, password }),

    register: (payload) =>
        axiosClient.post("/auth/register", payload),

    me: () => axiosClient.get("/auth/me"),

    // refresh access token using a refresh token stored on client
    refreshToken: (refreshToken) =>
        // do not use axiosClient here to avoid triggering the 401 interceptor
        refreshClient.post("/auth/refresh", { refreshToken }),
};

export default authService;