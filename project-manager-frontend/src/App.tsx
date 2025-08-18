import React from 'react';
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/Home";
import UserList from "./components/users/UserList";
import User from "./components/users/User";
import ProjectsPage from "./components/project/ProjectsPage";
import TasksPage from "./components/task/TasksPage";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./components/project/ProjectDetail";

// TODO: Keycloak integration will be added here
// import { ReactKeycloakProvider } from '@react-keycloak/web';
// import keycloak from './config/Keycloak';

const App: React.FC = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/users/create" element={<User />} />
                    <Route path="/users/:id/edit" element={<User />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/create" element={<ProjectsPage />} />
                    <Route path="/projects/:id/edit" element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<ProjectsPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/tasks/create" element={<TasksPage />} />
                    <Route path="/tasks/:id/edit" element={<TasksPage />} />
                    <Route path="/tasks/:id" element={<TasksPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
