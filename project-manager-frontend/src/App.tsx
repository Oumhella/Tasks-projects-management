import React, {useEffect, useState} from 'react';
import './utils/keycloak-styler.js';
import UserList from "./components/users/UserList";
import User from "./components/users/User";
import ProjectsPage from "./components/project/ProjectsPage";
import TasksPage from "./components/task/TasksPage";
import Dashboard from "./pages/Dashboard";

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from "./components/sidebar/TopBar";
import Notifications from "./components/users/Notifications";
import Activities from './components/users/Activities';
import Profile from "./components/users/Profile";
import ChatInterface from "./components/chat/ChatInterface";

// TODO: Keycloak integration will be added here
// import { ReactKeycloakProvider } from '@react-keycloak/web';
// import keycloak from './config/Keycloak';

const App: React.FC = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user has valid token in localStorage
        const token = localStorage.getItem('access_token');
        if (token) {
            // Optionally validate token here
            setAuthenticated(true);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <TopBar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/users/create" element={<User />} />
                    <Route path="/users/:id/edit" element={<User />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/create" element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<ProjectsPage />} />
                    <Route path="/projects/:id/edit" element={<ProjectsPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/tasks/create" element={<TasksPage />} />
                    <Route path="/tasks/:id/edit" element={<TasksPage />} />
                    <Route path="/tasks/:id" element={<TasksPage />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chat" element={<ChatInterface />} />
                    {/* Catch-all route - redirect unknown paths to dashboard */}
                    <Route path="*" element={<Dashboard />} />
                </Routes>
            </div>
        </div>
    );
};
export default App;
