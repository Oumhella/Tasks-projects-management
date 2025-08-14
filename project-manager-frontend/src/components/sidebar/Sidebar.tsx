import { IconType } from "react-icons";
import { FaTachometerAlt, FaUsers, FaProjectDiagram, FaTasks, FaCalendarAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import React from "react";
import "./Sidebar.css";

interface LinkItem {
    to: string;
    label: string;
    icon: IconType;
}

const Sidebar: React.FC = () => {
    const links: LinkItem[] = [
        { to: "/", label: "Dashboard", icon: FaTachometerAlt },
        { to: "/projects", label: "Projects", icon: FaProjectDiagram },
        { to: "/tasks", label: "Tasks", icon: FaTasks },
        { to: "/users", label: "Users", icon: FaUsers },
        { to: "/calendar", label: "Calendar", icon: FaCalendarAlt },
    ];

    return (
        <div className="sidebar">
            <nav className="navbar">
                <h2 className="sidebar-title">Project Manager</h2>
            </nav>
            <ul className="nav-links">
                {links.map(({ to, label, icon }) => {
                    const IconComponent = icon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
                    return (
                        <li key={to}>
                            <NavLink to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                <IconComponent />
                                <span>{label}</span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
            
            {/* TODO: Keycloak authentication section */}
            <div className="auth-section">
                <div className="auth-placeholder">
                    <p>🔐 Authentication</p>
                    <p className="text-sm">Keycloak integration</p>
                    <p className="text-sm">coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
