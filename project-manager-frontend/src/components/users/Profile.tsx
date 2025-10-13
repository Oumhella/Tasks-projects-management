import React, { useState, useEffect } from "react";
import apiService from "../../services/api";
import "./Profile.css";

interface User {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface UserStats {
    totalProjects: number;
    completedTasks: number;
    activeTasks: number;
    totalTasks: number;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getProfile = async () => {
        setLoading(true);
        setError("");
        try {
            const [userResponse] = await Promise.all([
                apiService.getUserProfile(),
                // apiService.getUserStats()
            ]);
            setUser(userResponse);
            // setStats(statsResponse);
        } catch (error) {
            console.error("Error getting user data", error);
            setError("Error loading profile data");
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    useEffect(() => {
        getProfile();
    }, []);

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="profile-container">
            <div className="profile-card">
                {/* Header Section */}
                <div className="profile-header">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div className="profile-details">
                            <h1 className="profile-name">{user.firstName} {user.lastName}</h1>
                            <p className="profile-email">{user.email}</p>
                            <span className={`profile-role ${user.role.toLowerCase()}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                {stats && (
                    <div className="profile-stats">
                        <div className="stat-item">
                            <div className="stat-value">{stats.totalProjects}</div>
                            <div className="stat-label">Projects</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{stats.completedTasks}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{stats.activeTasks}</div>
                            <div className="stat-label">Active</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{stats.totalTasks}</div>
                            <div className="stat-label">Total Tasks</div>
                        </div>
                    </div>
                )}

                {/* Profile Information */}
                <div className="profile-main">
                    <div className="about-section">
                        <h3 className="section-title">
                            <span className="section-icon">👤</span>
                            Profile Information
                        </h3>
                        <div className="about-text">
                            <p><strong>Username:</strong> {user.userName}</p>
                            <p><strong>First Name:</strong> {user.firstName}</p>
                            <p><strong>Last Name:</strong> {user.lastName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                        </div>
                    </div>

                    {/*<div className="skills-section">*/}
                    {/*    <h3 className="section-title">*/}
                    {/*        <span className="section-icon">⚡</span>*/}
                    {/*        Skills & Technologies*/}
                    {/*    </h3>*/}
                    {/*    <div className="skills-list">*/}
                    {/*        <span className="skill-tag">React</span>*/}
                    {/*        <span className="skill-tag">TypeScript</span>*/}
                    {/*        <span className="skill-tag">Node.js</span>*/}
                    {/*        <span className="skill-tag">Project Management</span>*/}
                    {/*        <span className="skill-tag">Team Leadership</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                {/* Action Buttons */}
                <div className="profile-actions">
                    <button className="action-btn action-btn-primary">
                        <span>✏️</span>
                        Edit Profile
                    </button>
                    <button className="action-btn action-btn-secondary">
                        <span>⚙️</span>
                        Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
