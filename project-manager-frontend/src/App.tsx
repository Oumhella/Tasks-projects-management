import React from 'react';
import './utils/keycloak-styler.js';
import UserList from "./components/users/UserList";
import User from "./components/users/User";
import ProjectsPage from "./components/project/ProjectsPage";
import TasksPage from "./components/task/TasksPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TopBar from "./components/sidebar/TopBar";
import Notifications from "./components/users/Notifications";
import Activities from './components/users/Activities';
import Profile from "./components/users/Profile";
import ChatInterface from "./components/chat/ChatInterface";
import { useKeycloak } from "@react-keycloak/web";
import { Box, CircularProgress, Typography } from "@mui/material";

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    const { keycloak, initialized } = useKeycloak();
    const location = useLocation();

    if (!initialized) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!keycloak.authenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

const App: React.FC = () => {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
                <CircularProgress />
                <Typography variant="body1" color="text.secondary">Initializing Application...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {keycloak.authenticated && <TopBar />}
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1,
                    width: '100%',
                    pt: keycloak.authenticated ? '64px' : 0,
                    minHeight: '100vh',
                    bgcolor: 'background.default'
                }}
            >
                <Routes>
                    <Route path="/login" element={
                        keycloak.authenticated ? <Navigate to="/" replace /> : <Login />
                    } />

                    <Route path="/" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/users" element={
                        <PrivateRoute>
                            <UserList />
                        </PrivateRoute>
                    } />
                    <Route path="/users/create" element={
                        <PrivateRoute>
                            <User />
                        </PrivateRoute>
                    } />
                    <Route path="/users/:id/edit" element={
                        <PrivateRoute>
                            <User />
                        </PrivateRoute>
                    } />
                    <Route path="/projects" element={
                        <PrivateRoute>
                            <ProjectsPage />
                        </PrivateRoute>
                    } />
                    <Route path="/projects/create" element={
                        <PrivateRoute>
                            <ProjectsPage />
                        </PrivateRoute>
                    } />
                    <Route path="/projects/:id" element={
                        <PrivateRoute>
                            <ProjectsPage />
                        </PrivateRoute>
                    } />
                    <Route path="/projects/:id/edit" element={
                        <PrivateRoute>
                            <ProjectsPage />
                        </PrivateRoute>
                    } />
                    <Route path="/tasks" element={
                        <PrivateRoute>
                            <TasksPage />
                        </PrivateRoute>
                    } />
                    <Route path="/tasks/create" element={
                        <PrivateRoute>
                            <TasksPage />
                        </PrivateRoute>
                    } />
                    <Route path="/tasks/:id/edit" element={
                        <PrivateRoute>
                            <TasksPage />
                        </PrivateRoute>
                    } />
                    <Route path="/tasks/:id" element={
                        <PrivateRoute>
                            <TasksPage />
                        </PrivateRoute>
                    } />
                    <Route path="/activities" element={
                        <PrivateRoute>
                            <Activities />
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                    <Route path="/chat" element={
                        <PrivateRoute>
                            <ChatInterface />
                        </PrivateRoute>
                    } />
                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Box>
        </Box>
    );
};
export default App;
