import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaProjectDiagram, FaTasks, FaUsers, FaPlus, FaExclamationTriangle,
  FaChartBar, FaClipboardCheck, FaClock, FaBolt, FaUserFriends
} from 'react-icons/fa';
import apiService from '../services/api';
import './Dashboard.css';
interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalUsers: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projects, tasks, users] = await Promise.all([
        apiService.getProjects(),
        apiService.getTasks(),
        apiService.getUsers()
      ]);

      const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
      const activeProjects = projects.length - completedProjects;

      const completedTasks = tasks.filter(t => t.status === 'DONE').length;
      const todoTasks = tasks.filter(t => t.status === 'TODO').length;
      const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
      const overdueTasks = tasks.filter(t => {
        const due = new Date(t.endDate);
        return t.status !== 'DONE' && due < new Date();
      }).length;

      setStats({
        totalProjects: projects.length,
        activeProjects,
        completedProjects,
        totalTasks: tasks.length,
        todoTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        totalUsers: users.length
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="dashboard-container">
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <h2>Loading Dashboard...</h2>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="dashboard-container">
          <div className="error-card">
            <h2 className="error-title">Error</h2>
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={fetchDashboardData}>
              Retry
            </button>
          </div>
        </div>
    );
  }

  const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; colorClass: string }> = ({
                                                                                                             title, value, icon, colorClass
                                                                                                           }) => (
      <div className={`stat-card ${colorClass}`}>
        <div className="stat-content">
          <div className="stat-info">
            <h3>{title}</h3>
            <p className="stat-value">{value}</p>
          </div>
          <div className={`stat-icon ${colorClass}`}>{icon}</div>
        </div>
      </div>
  );

  return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome to your project management dashboard</p>
        </div>

        <div className="dashboard-main-grid">
          {/* Left Column - Main Content */}
          <div className="dashboard-sidebar">
            {/* Total Projects Section */}
            <section className="total-projects-section">
              <div className="section-header">
                <h2 className="section-title">TOTAL PROJECTS</h2>
                <div className="section-icon"><FaChartBar /></div>
              </div>
              <div className="projects-stats-grid">
                <div className="project-stat-item">
                  <div className="stat-item-header">
                    <h3 className="stat-item-title">ACTIVE PROJECTS</h3>
                    <span className="stat-item-badge">Live</span>
                  </div>
                  <p className="stat-item-value">{stats.activeProjects}</p>
                </div>
                <div className="project-stat-item">
                  <div className="stat-item-header">
                    <h3 className="stat-item-title">COMPLETED PROJECTS</h3>
                    <span className="stat-item-badge">Done</span>
                  </div>
                  <p className="stat-item-value">{stats.completedProjects}</p>
                </div>
                <div className="project-stat-item">
                  <div className="stat-item-header">
                    <h3 className="stat-item-title">TOTAL TASKS</h3>
                    <span className="stat-item-badge">All</span>
                  </div>
                  <p className="stat-item-value">{stats.totalTasks}</p>
                </div>
              </div>
            </section>

            {/* Tasks Overview Section */}
            <section className="tasks-overview-section">
              <div className="section-header">
                <h2 className="section-title">
                  <FaClipboardCheck className="section-icon" />
                  TASKS OVERVIEW
                </h2>
              </div>
              <div className="tasks-stats-grid">
                <div className="task-stat-item">
                  <h3 className="stat-item-title">IN PROGRESS TASKS</h3>
                  <p className="stat-item-value">{stats.inProgressTasks}</p>
                </div>
                <div className="task-stat-item success">
                  <h3 className="stat-item-title">COMPLETED TASKS</h3>
                  <p className="stat-item-value">{stats.completedTasks}</p>
                </div>
                <div className="task-stat-item danger">
                  <h3 className="stat-item-title">OVERDUE TASKS</h3>
                  <p className="stat-item-value">{stats.overdueTasks}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Quick Metrics */}
          <div className="quick-metrics-sidebar">

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon warning"><FaClock /></div>
                <h3 className="metric-title">To Do Tasks</h3>
              </div>
              <p className="metric-value">{stats.todoTasks}</p>
              <p className="metric-description">Pending tasks</p>
            </div>
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon success"><FaBolt /></div>
                <h3 className="metric-title">Productivity</h3>
              </div>
              <p className="metric-value">
                {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
              </p>
              <p className="metric-description">Overall team efficiency</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon primary"><FaUserFriends /></div>
                <h3 className="metric-title">Team Members</h3>
              </div>
              <p className="metric-value">{stats.totalUsers}</p>
              <p className="metric-description">Active team members</p>
            </div>
          </div>
        </div>

        {/* Total Users Section */}
        <section className="users-section">
          <div className="section-header">
            <h2 className="section-title">TOTAL USERS</h2>
            <div className="section-icon"><FaUserFriends /></div>
          </div>
          <div className="users-content">
            <p className="total-users-value">{stats.totalUsers}</p>
            <p className="total-users-label">Registered Users</p>
            <div className="users-stats">
              <div className="user-stat">
                <p className="user-stat-value">
                  {stats.totalUsers > 0 ? Math.round((stats.totalUsers - stats.overdueTasks) / stats.totalUsers * 100) : 0}%
                </p>
                <p className="user-stat-label">Active</p>
              </div>
              <div className="user-stat">
                <p className="user-stat-value">
                  {stats.totalUsers > 0 ? Math.round((stats.overdueTasks / stats.totalUsers) * 100) : 0}%
                </p>
                <p className="user-stat-label">Inactive</p>
              </div>
              <div className="user-stat">
                <p className="user-stat-value">92%</p>
                <p className="user-stat-label">Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <div className="quick-actions-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            <Link to="/projects/create" className="quick-action-btn"><FaPlus /> New Project</Link>
            <Link to="/tasks/create" className="quick-action-btn"><FaPlus /> New Task</Link>
            <Link to="/users/create" className="quick-action-btn"><FaPlus /> New User</Link>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="recent-activity-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <a href="#" className="view-all-link">View All</a>
          </div>
          <p className="recent-activity-placeholder">
            Recent activity will be displayed here when available.
          </p>
        </div>
      </div>
  );
};

export default Dashboard;