import React from "react";
import { keycloak } from "../../config/Keycloak";

interface Props {
    children: React.ReactNode;
}

const LogoutButton: React.FC<Props> = ({ children }) => {
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        keycloak.logout({
            redirectUri: "http://localhost:3000", // change if deployed
        });
    };

    return (
        <button onClick={handleLogout} className="dropdown-item logout">
            {children}
        </button>
    );
};

export default LogoutButton;
