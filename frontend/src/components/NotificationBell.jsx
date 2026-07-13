import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const [notifRes, countRes] = await Promise.all([
                api.get("/notifications"),
                api.get("/notifications/unread-count")
            ]);
            setNotifications(notifRes.data);
            setUnreadCount(countRes.data.count);
        } catch (err) {
            // Silently fail - notifications are non-critical
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) {}
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put("/notifications/read-all");
            fetchNotifications();
        } catch (err) {}
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return "Just now";
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr}h ago`;
        return `${Math.floor(diffHr / 24)}d ago`;
    };

    return (
        <div className="notification-wrapper" ref={dropdownRef}>
            <button
                className="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h6>Notifications</h6>
                        {unreadCount > 0 && (
                            <button className="mark-all-read" onClick={handleMarkAllRead}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="notification-empty">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.slice(0, 20).map((n) => (
                            <div
                                key={n.id}
                                className={`notification-item ${!n.read ? "unread" : ""}`}
                                onClick={() => !n.read && handleMarkRead(n.id)}
                            >
                                <p>{n.message}</p>
                                <div className="time">{formatTime(n.createdAt)}</div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
