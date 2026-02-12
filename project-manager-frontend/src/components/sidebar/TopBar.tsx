import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    IconButton,
    InputBase,
    Badge,
    MenuItem,
    Menu,
    Avatar,
    Box,
    Typography,
    Button,
    useTheme,
    alpha,
    Stack,
    Tooltip
} from "@mui/material";
import {
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    AccountCircle,
    MoreVert as MoreIcon,
    Dashboard as DashboardIcon,
    Assignment as ProjectIcon,
    Task as TaskIcon,
    Chat as ChatIcon,
    Add as AddIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    Menu as MenuIcon
} from "@mui/icons-material";
import apiService from "../../services/api";
import { useKeycloak } from "@react-keycloak/web";

interface User {
    firstName: string;
    lastName: string;
    email?: string;
    role?: string;
}

const TopBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const { keycloak } = useKeycloak();

    const [user, setUser] = useState<User | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    // Fetch logged user
    const getUserProfile = async () => {
        try {
            const response = await apiService.getUserProfile();
            if (response) {
                setUser(response);
            }
        } catch (error) {
            console.warn("User profile not available:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        if (keycloak.authenticated) {
            getUserProfile();
        }
    }, [keycloak.authenticated]);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        handleMenuClose();
        keycloak.logout();
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName && !lastName) return "U";
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
                elevation: 4,
                sx: { borderRadius: 2, minWidth: 200, mt: 1.5 }
            }}
        >
            <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                    {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {user?.email || user?.role || 'Member'}
                </Typography>
            </Box>
            <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, my: 1 }} />
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                <PersonIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
                <SettingsIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> Settings
            </MenuItem>
            <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, my: 1 }} />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} /> Logout
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <ChatIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const navItems = [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { label: 'Projects', icon: <ProjectIcon />, path: '/projects' },
        { label: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
        { label: 'Chat', icon: <ChatIcon />, path: '/chat' },
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="fixed"
                color="inherit"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backdropFilter: 'blur(20px)',
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                <Toolbar>
                    {/* Logo Area */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textDecoration: 'none',
                                fontSize: '1.5rem'
                            }}
                        >
                            AuraFlow
                        </Typography>
                    </Box>

                    {/* Navigation Links */}
                    <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Button
                                    key={item.label}
                                    component={NavLink}
                                    to={item.path}
                                    startIcon={item.icon}
                                    sx={{
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                        fontWeight: isActive ? 600 : 500,
                                        borderRadius: 2,
                                        px: 2,
                                        '&:hover': {
                                            backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.text.primary, 0.04),
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Stack>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Quick Actions & Profile */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/projects/create')}
                            sx={{ mr: 2, borderRadius: 2 }}
                        >
                            New Project
                        </Button>

                        <Tooltip title="Notifications">
                            <IconButton 
                                size="large" 
                                aria-label="show 17 new notifications" 
                                color="inherit"
                                onClick={() => navigate('/activities')}
                            >
                                <Badge badgeContent={3} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Account settings">
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <Avatar
                                    sx={{
                                        width: 35,
                                        height: 35,
                                        bgcolor: theme.palette.primary.main,
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {user ? getInitials(user.firstName, user.lastName) : <PersonIcon />}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            <Toolbar /> {/* Spacer for fixed AppBar */}
        </Box>
    );
};

export default TopBar;