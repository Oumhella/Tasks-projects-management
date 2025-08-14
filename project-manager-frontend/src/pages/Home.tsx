// Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaProjectDiagram, FaTasks, FaUsers, FaChartLine } from 'react-icons/fa';
import './Home.css';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section">
                <h1 className="hero-title">
                    Welcome to Project Manager
                </h1>
                <p className="hero-subtitle">
                    A comprehensive project management solution for teams and organizations
                </p>
                <div className="hero-buttons">
                    <Link to="/projects" className="hero-btn">
                        Get Started
                    </Link>
                    <Link to="/dashboard" className="hero-btn secondary">
                        View Dashboard
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon blue">
                        <FaProjectDiagram />
                    </div>
                    <h3 className="feature-title">Project Management</h3>
                    <p className="feature-description">
                        Create, organize, and track projects with ease
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon green">
                        <FaTasks />
                    </div>
                    <h3 className="feature-title">Task Tracking</h3>
                    <p className="feature-description">
                        Manage tasks, set priorities, and monitor progress
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon purple">
                        <FaUsers />
                    </div>
                    <h3 className="feature-title">Team Collaboration</h3>
                    <p className="feature-description">
                        Work together with your team members efficiently
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon orange">
                        <FaChartLine />
                    </div>
                    <h3 className="feature-title">Analytics & Reports</h3>
                    <p className="feature-description">
                        Get insights into project performance and progress
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-card">
                <h2 className="quick-actions-title">Quick Actions</h2>
                <div className="quick-actions-grid">
                    <Link
                        to="/projects/create"
                        className="quick-action-link project"
                    >
                        <FaProjectDiagram className="quick-action-icon" />
                        <span className="quick-action-text">Create New Project</span>
                    </Link>

                    <Link
                        to="/tasks/create"
                        className="quick-action-link task"
                    >
                        <FaTasks className="quick-action-icon" />
                        <span className="quick-action-text">Create New Task</span>
                    </Link>

                    <Link
                        to="/users/create"
                        className="quick-action-link user"
                    >
                        <FaUsers className="quick-action-icon" />
                        <span className="quick-action-text">Add New User</span>
                    </Link>
                </div>
            </div>

            {/* Keycloak Integration Notice */}
            <div className="keycloak-notice-card">
                <h3 className="keycloak-notice-title">
                    🔐 Authentication Coming Soon
                </h3>
                <p className="keycloak-notice-text">
                    Keycloak integration will be added for secure user authentication and authorization.
                </p>
            </div>
        </div>
    );
};

export default Home;
