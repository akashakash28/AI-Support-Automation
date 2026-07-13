import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTicket";
import EditTicket from "./pages/EditTicket";
import AssignTicket from "./pages/AssignTicket";
import ResolveTicket from "./pages/ResolveTicket";
import TicketDetails from "./pages/TicketDetails";
import AIChat from "./pages/AIChat";
import KnowledgeBase from "./pages/KnowledgeBase";
import UserManagement from "./pages/UserManagement";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/ask-ai" element={<AIChat />} />
                        <Route path="/tickets" element={<Tickets />} />
                        <Route path="/create-ticket" element={<CreateTicket />} />
                        <Route path="/tickets/:id" element={<TicketDetails />} />
                        <Route path="/edit-ticket/:id" element={<EditTicket />} />
                        <Route path="/assign-ticket/:id" element={<AssignTicket />} />
                        <Route path="/resolve-ticket/:id" element={<ResolveTicket />} />
                        <Route path="/knowledge-base" element={<KnowledgeBase />} />
                        <Route path="/users" element={<UserManagement />} />
                    </Route>
                    {/* Catch-all: go to 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;