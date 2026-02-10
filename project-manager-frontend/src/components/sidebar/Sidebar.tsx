// import { IconType } from "react-icons";
// import {
//     FaTachometerAlt,
//     FaUsers,
//     FaProjectDiagram,
//     FaTasks,
//     FaChartLine,
//     FaFileAlt,
//     FaCog,
//     FaSignOutAlt
// } from "react-icons/fa";
// import { NavLink } from "react-router-dom";
// import React from "react";
// import "./Sidebar.css";
// import LogoutButton from "../users/LogoutButton";
//
// interface LinkItem {
//     to: string;
//     label: string;
//     icon: IconType;
//     isLogout?: boolean;
// }
//
// const Sidebar: React.FC = () => {
//     const mainLinks: LinkItem[] = [
//         { to: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
//         { to: "/projects", label: "Projects", icon: FaProjectDiagram },
//         { to: "/tasks", label: "Tasks", icon: FaTasks },
//         // { to: "/users", label: "Users", icon: FaUsers },
//     ];
//
//     const reportLinks: LinkItem[] = [
//         { to: "/analytics", label: "Analytics", icon: FaChartLine },
//         { to: "/reports", label: "Reports", icon: FaFileAlt },
//     ];
//
//     const settingLinks: LinkItem[] = [
//         { to: "/settings", label: "Settings", icon: FaCog },
//         { to: "#", label: "Logout", icon: FaSignOutAlt, isLogout: true }, // 👈 mark as logout
//     ];
//
//     return (
//         <div className="sidebar">
//             <ul className="sidebar-menu">
//                 {mainLinks.map(({ to, label, icon }) => {
//                     const IconComponent = icon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
//                     return (
//                         <li key={to} className="sidebar-item">
//                             <NavLink
//                                 to={to}
//                                 className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
//                             >
//                                 <IconComponent className="sidebar-icon" />
//                                 <span>{label}</span>
//                             </NavLink>
//                         </li>
//                     );
//                 })}
//
//                 <li className="sidebar-divider"></li>
//
//                 {/*<li className="sidebar-title">Reports</li>*/}
//                 {/*{reportLinks.map(({ to, label, icon }) => {*/}
//                 {/*    const IconComponent = icon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;*/}
//                 {/*    return (*/}
//                 {/*        <li key={to} className="sidebar-item">*/}
//                 {/*            <NavLink*/}
//                 {/*                to={to}*/}
//                 {/*                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}*/}
//                 {/*            >*/}
//                 {/*                <IconComponent className="sidebar-icon" />*/}
//                 {/*                <span>{label}</span>*/}
//                 {/*            </NavLink>*/}
//                 {/*        </li>*/}
//                 {/*    );*/}
//                 {/*})}*/}
//
//                 <li className="sidebar-divider"></li>
//
//                 <li className="sidebar-title">Settings</li>
//                 {settingLinks.map(({ to, label, icon, isLogout }) => {
//                     const IconComponent = icon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
//                     return (
//                         <li key={label} className="sidebar-item">
//                             {isLogout ? (
//                                 <LogoutButton>
//                                     <IconComponent className="sidebar-icon" />
//                                     <span>{label}</span>
//                                 </LogoutButton>
//                             ) : (
//                                 <NavLink
//                                     to={to}
//                                     className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
//                                 >
//                                     <IconComponent className="sidebar-icon" />
//                                     <span>{label}</span>
//                                 </NavLink>
//                             )}
//                         </li>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// };
//
// export default Sidebar;
import { IconType } from "react-icons";
import {
    FaTachometerAlt,
    FaUsers,
    FaProjectDiagram,
    FaTasks,
    FaChartLine,
    FaFileAlt,
    FaCog,
    FaSignOutAlt,
    FaCalendarAlt,
    FaComments,
    FaBookmark,
    FaBell,
    FaRobot
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import LogoutButton from "../users/LogoutButton";

interface LinkItem {
    to: string;
    label: string;
    icon: IconType;
    isLogout?: boolean;
    badge?: number;
    description?: string;
}

const Sidebar: React.FC = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const mainLinks: LinkItem[] = [
        {
            to: "/dashboard",
            label: "Dashboard",
            icon: FaTachometerAlt,
            description: "Overview & metrics"
        },
        {
            to: "/projects",
            label: "Projects",
            icon: FaProjectDiagram,
            description: "Manage projects"
        },
        {
            to: "/tasks",
            label: "Tasks",
            icon: FaTasks,
            badge: 5,
            description: "Your assignments"
        },
        {
            to: "/calendar",
            label: "Calendar",
            icon: FaCalendarAlt,
            description: "Schedule & deadlines"
        },
    ];

    const collaborationLinks: LinkItem[] = [
        {
            to: "/team",
            label: "Team",
            icon: FaUsers,
            description: "Team members"
        },
        {
            to: "/messages",
            label: "Messages",
            icon: FaComments,
            badge: 2,
            description: "Team communication"
        },
        {
            to: "/chat",
            label: "AI Assistant",
            icon: FaRobot,
            description: "Chat with AI"
        },
    ];

    const insightsLinks: LinkItem[] = [
        {
            to: "/analytics",
            label: "Analytics",
            icon: FaChartLine,
            description: "Performance insights"
        },
        {
            to: "/reports",
            label: "Reports",
            icon: FaFileAlt,
            description: "Generate reports"
        },
    ];

    const settingLinks: LinkItem[] = [
        {
            to: "/notifications",
            label: "Notifications",
            icon: FaBell,
            badge: 3,
            description: "Alerts & updates"
        },
        {
            to: "/settings",
            label: "Settings",
            icon: FaCog,
            description: "Preferences"
        },
        {
            to: "#",
            label: "Logout",
            icon: FaSignOutAlt,
            isLogout: true,
            description: "Sign out"
        },
    ];

    const renderNavLink = (item: LinkItem) => {
        const IconComponent = item.icon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

        if (item.isLogout) {
            return (
                <div key={item.label} className="sidebar-link logout-link">
                    <LogoutButton>
                        <div className="link-content">
                            <div className="icon-wrapper">
                                <IconComponent className="sidebar-icon" />
                            </div>
                            {!isCollapsed && (
                                <div className="link-text">
                                    <span className="link-label">{item.label}</span>
                                    <span className="link-description">{item.description}</span>
                                </div>
                            )}
                        </div>
                    </LogoutButton>
                </div>
            );
        }

        return (
            <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                }
            >
                <div className="link-content">
                    <div className="icon-wrapper">
                        <IconComponent className="sidebar-icon" />
                        {item.badge && item.badge > 0 && (
                            <span className="link-badge">{item.badge}</span>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="link-text">
                            <span className="link-label">{item.label}</span>
                            <span className="link-description">{item.description}</span>
                        </div>
                    )}
                </div>
            </NavLink>
        );
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <div className={`hamburger ${isCollapsed ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>
                {!isCollapsed && (
                    <div className="sidebar-title">
                        <h3>Navigation</h3>
                        <span className="workspace-name">My Workspace</span>
                    </div>
                )}
            </div>

            <div className="sidebar-content">
                <ul className="sidebar-menu">
                    {/* Main Navigation */}
                    {!isCollapsed && <li className="sidebar-section-title">Main</li>}
                    {mainLinks.map((item) => (
                        <li key={item.to} className="sidebar-item">
                            {renderNavLink(item)}
                        </li>
                    ))}

                    <li className="sidebar-divider"></li>

                    {/* Collaboration */}
                    {!isCollapsed && <li className="sidebar-section-title">Collaboration</li>}
                    {collaborationLinks.map((item) => (
                        <li key={item.to} className="sidebar-item">
                            {renderNavLink(item)}
                        </li>
                    ))}

                    <li className="sidebar-divider"></li>

                    {/* Insights */}
                    {!isCollapsed && <li className="sidebar-section-title">Insights</li>}
                    {insightsLinks.map((item) => (
                        <li key={item.to} className="sidebar-item">
                            {renderNavLink(item)}
                        </li>
                    ))}

                    <li className="sidebar-divider"></li>

                    {/* Settings */}
                    {!isCollapsed && <li className="sidebar-section-title">Settings</li>}
                    {settingLinks.map((item) => (
                        <li key={item.label} className="sidebar-item">
                            {renderNavLink(item)}
                        </li>
                    ))}
                </ul>

                {/* Sidebar Footer */}
                {!isCollapsed && (
                    <div className="sidebar-footer">
                        <div className="workspace-info">
                            <div className="workspace-stats">
                                <div className="stat">
                                    <span className="stat-label">Active Projects</span>
                                    <span className="stat-value">12</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Pending Tasks</span>
                                    <span className="stat-value">5</span>
                                </div>
                            </div>
                            <div className="upgrade-prompt">
                                <button className="upgrade-btn">
                                    <FaBookmark /> Upgrade Plan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;