import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, loading, user } = useContext(AuthContext);

    if (loading) {
        return <div className="container mt-5 text-center"><h4>Loading...</h4></div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <div className="container mt-5"><h3>Access Denied</h3></div>;
    }

    const isAdminRoute = user?.role === "ADMIN" || user?.role === "MANAGER" || user?.role === "SUPPORT_AGENT";

    return isAdminRoute ? <AdminLayout /> : <EmployeeLayout />;
}

export default ProtectedRoute;
