import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaUser, FaEnvelope, FaKey, FaUserTag } from 'react-icons/fa';
import './user.css';
import apiService from "../../services/api";

interface UserFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: string;
}
interface User {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: string;
}
const User: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'developer'
    });

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<UserFormData>>({});
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (id) {
                setIsEditMode(true);
                try {
                    setLoading(true);
                    const userData = await apiService.getUser(id);
                    // Populate form with fetched data
                    setFormData({
                        username: userData.username,
                        email: userData.email,
                        password: '', // Passwords are not fetched for security reasons
                        confirmPassword: '',
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        role: userData.role
                    });
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    // Navigate to the user list or show an error message
                    navigate('/users');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [id, navigate]);


    const validateForm = (): boolean => {
        const newErrors: Partial<UserFormData> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!isEditMode) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.role) {
            newErrors.role = 'Role is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof UserFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (isEditMode && id) {
                const userUpdateData = {
                    username: formData.username,
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    role: formData.role
                };
                await apiService.updateUser(id, userUpdateData);
            } else {
                const userCreateData = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    role: formData.role
                };
                await apiService.createUser(userCreateData);
            }
            navigate('/users');
        } catch (error) {
            console.error('Error saving user:', error);
            // Handle error, e.g., show an error message on the form
            setErrors({ email: 'Failed to save user. Please try again.' });
        } finally {
            setLoading(false);
        }
    };
    const roleOptions = [
        { value: 'admin', label: 'Administrator', description: 'Full system access' },
        { value: 'project-manager', label: 'Project Manager', description: 'Manage projects and teams' },
        { value: 'developer', label: 'Developer', description: 'Develop and maintain code' },
        { value: 'designer', label: 'Designer', description: 'Create user interfaces and graphics' },
        { value: 'tester', label: 'Tester', description: 'Test and quality assurance' },
        { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
    ];

    if (isEditMode && loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="user-container">
            <div className="user-card">
                <div className="user-header">
                    <h1 className="user-title">
                        {isEditMode ? 'Edit User' : 'Create New User'}
                    </h1>
                    <p className="user-subtitle">
                        {isEditMode ? 'Update user information' : 'Add a new user to the system'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="user-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">
                                <FaUser />
                                Username *
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`form-input ${errors.username ? 'error' : ''}`}
                                placeholder="Enter username"
                            />
                            {errors.username && (
                                <span className="error-message">{errors.username}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaEnvelope />
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="Enter email"
                            />
                            {errors.email && (
                                <span className="error-message">{errors.email}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaUser />
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`form-input ${errors.firstName ? 'error' : ''}`}
                                placeholder="Enter first name"
                            />
                            {errors.firstName && (
                                <span className="error-message">{errors.firstName}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaUser />
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`form-input ${errors.lastName ? 'error' : ''}`}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && (
                                <span className="error-message">{errors.lastName}</span>
                            )}
                        </div>

                        {!isEditMode && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">
                                        <FaKey />
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`form-input ${errors.password ? 'error' : ''}`}
                                        placeholder="Enter password"
                                    />
                                    {errors.password && (
                                        <span className="error-message">{errors.password}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <FaKey />
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                        placeholder="Confirm password"
                                    />
                                    {errors.confirmPassword && (
                                        <span className="error-message">{errors.confirmPassword}</span>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="form-group role-select-group">
                            <label className="form-label">
                                <FaUserTag />
                                Role *
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className={`form-input ${errors.role ? 'error' : ''}`}
                            >
                                {roleOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label} - {option.description}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <span className="error-message">{errors.role}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/users')}
                            className="cancel-btn"
                            disabled={loading}
                        >
                            <FaTimes />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >
                            <FaSave />
                            {loading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default User;
