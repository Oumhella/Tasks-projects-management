import React, { useEffect, useState } from "react";
import apiService from "../../services/api";
import './Activities.css';
interface Activity {
    action: string;
    details: string;
    createdAt: string;
}

const Activities = () => {
    const [notifications, setNotifications] = useState<Activity[]>([]);
    const [err, setErr] = useState("");

    const fetchNotifications = async () => {
        try {
            const acts = await apiService.getNotifications();
            setNotifications(acts);
        } catch (err) {
            console.error("Error fetching notifications", err);
            setErr("Error fetching notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="activities-container">
            <h2 className="activities-title">Activities</h2>

            {err && <div className="activities-error">{err}</div>}

            {notifications.length === 0 && !err && (
                <div className="activities-empty">No notifications available.</div>
            )}

            <ul className="activities-list">
                {notifications.map((n, index) => (
                    <li key={index} className="activities-item">
                        <p className="activities-action">{n.action}</p>
                        <p className="activities-detail">{n.details}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Activities;
