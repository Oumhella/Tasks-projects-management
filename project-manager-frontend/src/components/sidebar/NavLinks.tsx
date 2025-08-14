import NavItem from "./NavItem";
import React from "react";

export interface LinkItem {
    to: string;
    label: string;
}

interface NavLinksProps {
    links: LinkItem[];
}

const NavLinks: React.FC<NavLinksProps> = ({ links }) => {
    return (
        <ul className="nav-links">
            {links.map((link) => (
                <NavItem key={link.to} to={link.to} label={link.label} />
            ))}
        </ul>
    );
};

export default NavLinks;
