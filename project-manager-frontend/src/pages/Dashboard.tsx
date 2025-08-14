import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaProjectDiagram, FaTasks, FaUsers, FaPlus } from 'react-icons/fa';
import apiService from '../services/api';
import './Dashboard.css';

interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  totalUsers: number;
  completedTasks: number;
  pendingTasks: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalTasks: 0,
    totalUsers: 0,
    completedTasks: 0,
    pendingTasks: 0
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
      
      // Fetch all data in parallel
      const [projects, tasks, users] = await Promise.all([
        apiService.getProjects(),
        apiService.getTasks(),
        apiService.getUsers()
      ]);

      const completedTasks = tasks.filter((task: any) => task.status === 'DONE').length;
      const pendingTasks = tasks.filter((task: any) => task.status === 'TODO').length;

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        totalUsers: users.length,
        completedTasks,
        pendingTasks
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please check if the backend is running on port 8081.');
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
    title, 
    value, 
    icon, 
    colorClass 
  }) => (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-content">
        <div className="stat-info">
          <h3>{title}</h3>
          <p className="stat-value">{value}</p>
        </div>
        <div className="stat-icon">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<FaProjectDiagram />}
          colorClass="blue"
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={<FaTasks />}
          colorClass="green"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers />}
          colorClass="orange"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={<FaTasks />}
          colorClass="purple"
        />
      </div>

      {/* Task Progress */}
      <div className="task-progress-card">
        <h3 className="task-progress-title">Task Progress</h3>
        <div className="progress-item">
          <div className="progress-header">
            <span>Completed</span>
            <span>{stats.completedTasks} / {stats.totalTasks}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%`
              }} 
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-card">
        <h3 className="quick-actions-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          <Link to="/projects/create" className="quick-action-btn">
            <FaPlus />
            New Project
          </Link>
          <Link to="/tasks/create" className="quick-action-btn">
            <FaPlus />
            New Task
          </Link>
          <Link to="/users/create" className="quick-action-btn">
            <FaPlus />
            New User
          </Link>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="recent-activity-card">
        <h3 className="recent-activity-title">Recent Activity</h3>
        <p className="recent-activity-placeholder">
          Recent activity will be displayed here when available.
        </p>
      </div>
    </div>
  );
};

export default Dashboard; 