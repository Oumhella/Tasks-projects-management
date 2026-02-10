// import { IconType } from "react-icons";
// import { FaSearch, FaBell, FaQuestionCircle, FaPlus } from "react-icons/fa";
// import React, {useEffect, useState} from "react";
// import "./TopBar.css";
// import { Link } from "react-router-dom";
// // import User from "../users/User";
// import apiService from "../../services/api";
//
// interface User {
//     // name: string;
//     // email: string;
//     // password: string;
//     // confirmPassword: string;
//     firstName: string;
//     lastName: string;
//     // role: string;
// }
// const TopBar: React.FC = () => {
//     const [user,setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//
//     const getUserName = async ()=>{
//         setLoading(true);
//         setError('');
//         try {
//             const response = await apiService.getUserProfile();
//             setUser(response);
//         }catch (error){
//             console.error("error fetching user", error);
//             setError("error fetching user");
//         }finally {
//             setLoading(false);
//         }
//
//     };
//     useEffect(() => {
//         getUserName();
//     },[]);
//
//     return (
//         <div className="topbar">
//             {/* Logo */}
//             <div className="logo">
//                 <img src="AURAFLOW.png" alt="logo" />
//             </div>
//
//             {/* Search Bar */}
//             <div className="search-container">
//                 <FaSearch className="search-icon" />
//                 <input
//                     type="text"
//                     className="search-input"
//                     placeholder="Search projects, tasks, or users..."
//                 />
//             </div>
//
//             {/* Top Bar Actions */}
//             <div className="topbar-actions">
//                 <Link to="/notifications" className="action-btn">
//                     <FaBell />
//                     <span className="notification-badge">3</span>
//                 </Link>
//                 <Link to="/profile" className="user-menu">
//                     <div className="user-avatar"></div>
//                     <span>{user?.firstName} {user?.lastName}</span>
//                 </Link>
//             </div>
//         </div>
//     );
// };
//
// export default TopBar;
import { 
    FaBell, 
    FaUserCircle, 
    FaChevronDown, 
    FaCog, 
    FaSignOutAlt,
    FaTachometerAlt,
    FaProjectDiagram,
    FaTasks
} from "react-icons/fa";
import React, { useEffect, useState } from "react";
import "./TopBar.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import apiService from "../../services/api";
import LogoutButton from "../users/LogoutButton";
import {FaMessage} from "react-icons/fa6";

interface User {
    firstName: string;
    lastName: string;
    email?: string;
    role?: string;
}

const TopBar: React.FC = () => {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Fetch logged user
    const getUserProfile = async () => {
        try {
            setLoading(true);
            const response = await apiService.getUserProfile();
            if (response) {
                setUser(response);
            }
        } catch (error) {
            // Silently handle error - user might not be logged in yet
            console.warn("User profile not available:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName && !lastName) return "U";
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    return (
        <div className="topbar">
            {/* Logo and Brand */}
            <div className="topbar-brand">
                <img
                    src="/AURAFLOW.png"
                    alt="AuraFlow"
                    className="brand-logo"
                    onError={(e) => {

                        e.currentTarget.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'brand-logo-fallback';
                        fallback.innerHTML = 'AF';
                        e.currentTarget.parentNode?.appendChild(fallback);
                    }}
                />
                {/*<div className="brand-info">*/}
                {/*    <h1 className="brand-title">PROJECT-MANGER</h1>*/}
                {/*    /!*<span className="brand-subtitle">Project Management</span>*!/*/}
                {/*</div>*/}
            </div>

            {/* Main Navigation */}
            <nav className="topbar-nav">
                <NavLink 
                    to="/dashboard" 
                    className={() => {
                        const isDashboardActive = location.pathname === '/dashboard' || location.pathname === '/';
                        return `nav-link ${isDashboardActive ? 'active' : ''}`;
                    }}
                >
                    <FaTachometerAlt />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink 
                    to="/projects" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    <FaProjectDiagram />
                    <span>Projects</span>
                </NavLink>
                <NavLink 
                    to="/tasks" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    <FaTasks />
                    <span>Tasks</span>
                </NavLink>
                <NavLink
                    to="/chat"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    <FaMessage />
                    <span>chat</span>
                </NavLink>
            </nav>

            {/* Right Actions */}
            <div className="topbar-actions">
                {/* Quick Actions */}
                <div className="quick-actions">
                    <Link to="/projects/new" className="quick-action-btn primary">
                        + New Project
                    </Link>
                    <Link to="/tasks/new" className="quick-action-btn secondary">
                        + Task
                    </Link>
                </div>

                {/* Notifications */}
                <div className="notification-container">
                    <Link to="/activities" className="notification-btn">
                        <FaBell />
                        <span className="notification-badge">!</span>
                    </Link>
                </div>

                {/* User Menu */}
                <div className="user-menu-container">
                    <button
                        className="user-menu-trigger"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className="user-avatar">
                            {user ? getInitials(user.firstName, user.lastName) : <FaUserCircle />}
                        </div>
                        <div className="user-info">
                            <span className="user-name">
                                {loading ? "Loading..." :
                                    user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User" :
                                        "Guest"}
                            </span>
                            <span className="user-role">{user?.role || "Member"}</span>
                        </div>
                        <FaChevronDown className={`dropdown-arrow ${showUserMenu ? 'open' : ''}`} />
                    </button>

                    {showUserMenu && (
                        <div className="user-dropdown">
                            <Link to="/profile" className="dropdown-item">
                                <FaUserCircle /> Profile
                            </Link>
                            <Link to="/settings" className="dropdown-item">
                                <FaCog /> Settings
                            </Link>
                            <div className="dropdown-divider"></div>
                            <LogoutButton>
                                <FaSignOutAlt /> Logout
                            </LogoutButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;