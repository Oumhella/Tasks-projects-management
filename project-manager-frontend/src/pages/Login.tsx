// src/pages/Login.tsx
import React from 'react';
import { useKeycloak } from "@react-keycloak/web";
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    useTheme,
    alpha,
    Stack
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const Login = () => {
    const { keycloak } = useKeycloak();
    const theme = useTheme();

    const handleLogin = () => {
        keycloak.login();
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background decoration circles */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: alpha(theme.palette.common.white, 0.03),
                    top: '-150px',
                    right: '-150px',
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: alpha(theme.palette.common.white, 0.05),
                    bottom: '-100px',
                    left: '-100px',
                    zIndex: 0
                }}
            />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={24}
                    sx={{
                        p: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}
                    >
                        <RocketLaunchIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Box>

                    <Typography
                        variant="h3"
                        component="h1"
                        fontWeight="800"
                        gutterBottom
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        AuraFlow
                    </Typography>

                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                        Project & Task Management
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: '80%' }}>
                        Streamline your workflow, collaborate with your team, and achieve your goals with our premium management platform.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<LoginIcon />}
                        onClick={handleLogin}
                        sx={{
                            py: 1.5,
                            px: 6,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            borderRadius: 3,
                            textTransform: 'none',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.32)}`,
                            }
                        }}
                    >
                        Sign In with Keycloak
                    </Button>

                    <Stack direction="row" spacing={1} sx={{ mt: 4, opacity: 0.6 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    </Stack>
                </Paper>

                <Typography variant="body2" sx={{ mt: 4, textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                    © 2026 AuraFlow Inc. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Login;