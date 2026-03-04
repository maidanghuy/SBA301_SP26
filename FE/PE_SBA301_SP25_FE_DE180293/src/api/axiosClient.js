import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8081/api",
    headers: { "Content-Type": "application/json" },
});

// attach access token to every request
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// helper for subscribers waiting during token refresh
let isRefreshing = false;
let refreshSubscribers = [];
const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};
const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
};

// create a plain axios instance for refresh requests (no interceptors)
export const refreshClient = axios.create({
    baseURL: axiosClient.defaults.baseURL,
    headers: { "Content-Type": "application/json" },
});

// simple response interceptor to unwrap payloads like { status,message,data:... }
// after this interceptor, the promise resolves with either the inner data or the raw body
axiosClient.interceptors.response.use(
    (res) => res.data.data,
    async (err) => {
        const config = err.config;
        const originalRequest = config;
        const status = err?.response?.status;

        // normalize message
        const message =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err.message ||
            "Request failed";

        // if unauthorized and we haven't retried yet
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const response = await refreshClient.post(
                            "/auth/refresh",
                            { refreshToken }
                        );
                        const data = response.data?.data || {};
                        const newAccess = data.accessToken;
                        const newRefresh = data.refreshToken || refreshToken;
                        if (newAccess) {
                            localStorage.setItem("access_token", newAccess);
                            axiosClient.defaults.headers.Authorization =
                                `Bearer ${newAccess}`;
                            onRefreshed(newAccess);
                        }
                        if (newRefresh) {
                            localStorage.setItem("refresh_token", newRefresh);
                        }
                    } catch (refreshError) {
                        // failed to refresh, clear storage
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");
                        // notify app to logout as well
                        window.dispatchEvent(new Event("logout"));
                        // navigate to login page
                        window.location.href = "/login";
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }

                // queue up the request until token is refreshed
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken) => {
                        originalRequest.headers.Authorization =
                            `Bearer ${newToken}`;
                        resolve(axiosClient(originalRequest));
                    });
                });
            }
        }

        return Promise.reject({ ...err, message });
    }
);


export default axiosClient;