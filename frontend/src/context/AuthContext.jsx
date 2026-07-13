import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            // Fetch user details
            api.get("/auth/me")
                .then(res => setUser(res.data))
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else {
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password });
            if (res.data.token) {
                setToken(res.data.token);
                if (res.data.refreshToken) {
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                }
                setUser({
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role
                });
                return { success: true, role: res.data.role };
            }
            return { success: false, message: res.data.message };
        } catch (err) {
            const errorData = err.response?.data;
            const message = typeof errorData === 'string' 
                ? errorData 
                : (errorData?.message || "Login failed");
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        const res = await api.post("/auth/register", userData);
        return res.data;
    };

    const logout = () => {
        setToken("");
        localStorage.removeItem("refreshToken");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
