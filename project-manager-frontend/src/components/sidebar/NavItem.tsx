import { Link } from "react-router-dom";
import React from "react";

interface NavItemProps {
    to: string;
    label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label }) => {
    return (
        <li className="nav-item">
            <Link to={to}>{label}</Link>
        </li>
    );
};

export default NavItem;
