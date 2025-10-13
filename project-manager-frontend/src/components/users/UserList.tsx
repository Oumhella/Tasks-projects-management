import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaUser } from 'react-icons/fa';
import apiService from '../../services/api';
import './UserList.css';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const filterUsers = useCallback(() => {
    let filtered = users;

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
          (user.firstName?.toLowerCase() || '').includes(searchTermLower) ||
          (user.lastName?.toLowerCase() || '').includes(searchTermLower) ||
          (user.email?.toLowerCase() || '').includes(searchTermLower) ||
          (user.username?.toLowerCase() || '').includes(searchTermLower)
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#dc2626';
      case 'project-manager':
        return '#2563eb';
      case 'developer':
        return '#059669';
      case 'tester':
        return '#d97706';
      default:
        return '#6b7280';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'project-manager':
        return 'Project Manager';
      case 'developer':
        return 'Developer';
      case 'tester':
        return 'Tester';
      default:
        return role;
    }
  };

  const getUserInitials = (user: User) => {
    const firstInitial = user.firstName ? user.firstName.charAt(0) : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}` || 'U';
  };

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    } else {
      return 'Unknown User';
    }
  };

  if (loading) {
    return (
        <div className="user-list-container">
          <div className="card">
            <h2>Loading Users...</h2>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="user-list-container">
          <div className="card">
            <h2>Error</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchUsers}>
              Retry
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="user-list-container">
        <div className="user-list-header">
          <h1>Users</h1>
          <Link to="/users/create" className="btn btn-primary">
            <FaUser className="btn-icon" />
            Add User
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="card">
          <div className="filter-grid">
            <div className="form-group">
              <label className="form-label">Search Users</label>
              <div className="search-input-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search by name, email, or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Filter by Role</label>
              <select
                  className="form-input"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Administrator</option>
                <option value="project-manager">Project Manager</option>
                <option value="developer">Developer</option>
                <option value="tester">Tester</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <h3 className="user-count">
            Users ({filteredUsers.length})
          </h3>

          {filteredUsers.length === 0 ? (
              <p className="no-users-message">
                {users.length === 0 ? 'No users found.' : 'No users match your search criteria.'}
              </p>
          ) : (
              <div className="table-container">
                <table className="user-table">
                  <thead>
                  <tr>
                    <th>User</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td data-label="User">
                          <div className="user-info">
                            <div
                                className="user-avatar"
                                style={{ backgroundColor: getRoleColor(user.role) }}
                            >
                              {getUserInitials(user)}
                            </div>
                            <div className="user-details">
                              <div className="user-name">
                                {getUserDisplayName(user)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-label="Username">
                      <span className="username">
                        {user.username || 'N/A'}
                      </span>
                        </td>
                        <td data-label="Email">{user.email || 'N/A'}</td>
                        <td data-label="Role">
                      <span
                          className="role-badge"
                          style={{ backgroundColor: getRoleColor(user.role) }}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                        </td>
                        <td data-label="Created" className="created-date">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td data-label="Actions">
                          <div className="action-buttons">
                            <Link
                                to={`/users/${user.id}/edit`}
                                className="btn btn-secondary btn-sm"
                            >
                              <FaEdit className="btn-icon" />
                              Edit
                            </Link>
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="btn btn-danger btn-sm"
                            >
                              <FaTrash className="btn-icon" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </div>
  );
};

export default UserList;