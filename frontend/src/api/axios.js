import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (refreshToken) {
                    const res = await axios.post("http://localhost:8080/auth/refresh", { refreshToken });
                    const newToken = res.data.token;
                    localStorage.setItem("token", newToken);
                    if (res.data.refreshToken) {
                        localStorage.setItem("refreshToken", res.data.refreshToken);
                    }
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (err) {
                // If refresh fails, clear everything and go to login
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }
        
        // If it was already retried or not a 401
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;