import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import apiService from "../../services/api";
import './TaskForm.css';

interface TaskFormProps {
    task?: any;
    projectId?: string;
    readOnlyProject?: boolean;
    onSave: () => void;
    onCancel: () => void;
}

interface TaskFormData {
    title: string;
    description: string;
    priority: string;
    type: string;
    status: string;
    estimatedHours: number;
    dueDate: string;
    projectId: string;
    assignedToUserId: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, projectId, readOnlyProject, onSave, onCancel }) => {
    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        priority: 'MEDIUM',
        type: 'TASK',
        status: 'TODO',
        estimatedHours: 0,
        dueDate: '',
        projectId: projectId || '',
        assignedToUserId: ''
    });

    const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
    const [users, setUsers] = useState<Array<{ id: string; name: string; email?: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            setInitialLoading(true);
            setError('');

            try {
                let projectsData = [];
                let usersData = [];

                if (readOnlyProject && projectId) {
                    const [projectResponse, membersResponse] = await Promise.all([
                        apiService.getProject(projectId),
                        apiService.getProjectMembers(projectId).catch(() => [])
                    ]);

                    projectsData = [projectResponse];
                    usersData = membersResponse;
                } else {
                    const [projectsResponse, usersResponse] = await Promise.all([
                        apiService.getProjects(),
                        apiService.getUsers().catch(() => [])
                    ]);

                    projectsData = projectsResponse;
                    usersData = usersResponse;
                }

                setProjects(projectsData);
                setUsers(usersData);

                if (task) {
                    setFormData({
                        title: task.title || '',
                        description: task.description || '',
                        priority: task.priority || 'MEDIUM',
                        type: task.type || 'TASK',
                        status: task.status || 'TODO',
                        estimatedHours: task.estimatedHours || 0,
                        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                        projectId: task.projectId || task.project?.id || projectId || '',
                        assignedToUserId: task.assignedToUserId || task.assignedTo?.id || ''
                    });
                }

            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError('Failed to load projects and users. Please try again.');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchInitialData();
    }, [task, projectId, readOnlyProject]);

    useEffect(() => {
        const fetchProjectMembers = async () => {
            if (formData.projectId && !readOnlyProject) {
                try {
                    const members = await apiService.getProjectMembers(formData.projectId);
                    setUsers(members);
                } catch (err) {
                    console.error('Error fetching project members:', err);
                    try {
                        const allUsers = await apiService.getUsers();
                        setUsers(allUsers);
                    } catch (fallbackErr) {
                        console.error('Error fetching all users:', fallbackErr);
                    }
                }
            }
        };

        if (formData.projectId && !readOnlyProject) {
            fetchProjectMembers();
        }
    }, [formData.projectId, readOnlyProject]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estimatedHours' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.title.trim()) {
                throw new Error('Title is required');
            }
            if (!formData.projectId) {
                throw new Error('Project is required');
            }

            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                type: formData.type,
                status: formData.status,
                estimatedHours: formData.estimatedHours,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
                projectId: formData.projectId,
                assignedToUserId: formData.assignedToUserId || null
            };
            console.log('Sending task data:', taskData); // Add this line

            if (task) {
                await apiService.updateTask(task.id, taskData);
            } else {
                await apiService.createTask(taskData);
            }

            onSave();
        } catch (err) {
            console.error('Error saving task:', err);
            setError(err instanceof Error ? err.message : 'Failed to save task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const priorityOptions = [
        { value: 'CRITICAL', label: 'Critical' },
        { value: 'HIGH', label: 'High' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'LOW', label: 'Low' }
    ];

    const typeOptions = [
        { value: 'BUG', label: 'Bug' },
        { value: 'FEATURE', label: 'Feature' },
        { value: 'TASK', label: 'Task' },
        { value: 'STORY', label: 'Story' }
    ];

    const statusOptions = [
        { value: 'TODO', label: 'To Do' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'IN_REVIEW', label: 'In Review' },
        { value: 'TESTING', label: 'Testing' },
        { value: 'DONE', label: 'Done' },
        { value: 'CLOSED', label: 'Closed' }
    ];

    if (initialLoading) {
        return (
            <div className="task-loading-container">
                <div className="task-loading-spinner"></div>
                <span className="task-loading-text">Loading form data...</span>
            </div>
        );
    }

    const getCurrentProjectName = () => {
        const currentProject = projects.find(p => p.id === formData.projectId);
        return currentProject ? currentProject.name : 'Loading...';
    };

    const getUserDisplayName = (user: any) => {
        if (user.name) return user.name;
        if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
        if (user.firstName) return user.firstName;
        if (user.username) return user.username;
        if (user.email) return user.email;
        return 'Unknown User';
    };

    return (
        <div className="task-form-container">
            {error && (
                <div className="task-error-message">
                    <div className="task-error-content">
                        <div className="task-error-icon">
                            <span>⚠️</span>
                        </div>
                        <div>
                            <p className="task-error-text">{error}</p>
                        </div>
                        <div className="task-error-dismiss">
                            <button
                                onClick={() => setError('')}
                                className="task-error-dismiss-button"
                            >
                                <span>×</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="task-form-header">
                <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
                {readOnlyProject && projectId && (
                    <p className="task-project-context">Creating task for: <strong>{getCurrentProjectName()}</strong></p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="task-form">
                <div className="task-form-grid">
                    <div className="task-form-group">
                        <label className="task-form-label">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="task-form-input"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div className="task-form-group">
                        <label className="task-form-label">
                            Project *
                        </label>
                        {readOnlyProject && projectId ? (
                            <div>
                                <input
                                    type="text"
                                    value={getCurrentProjectName()}
                                    disabled
                                    className="task-form-input"
                                />
                                <span className="task-fixed-project-note">
                                    (Fixed to current project)
                                </span>
                            </div>
                        ) : (
                            <select
                                name="projectId"
                                value={formData.projectId}
                                onChange={handleInputChange}
                                required
                                className="task-form-select"
                            >
                                <option value="">Select a project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="task-form-group">
                        <label className="task-form-label">
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="task-form-select"
                        >
                            {priorityOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="task-form-group">
                        <label className="task-form-label">
                            Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="task-form-select"
                        >
                            {typeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="task-form-group">
                        <label className="task-form-label">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="task-form-select"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="task-form-group">
                        <label className="task-form-label">
                            Assigned To
                            {readOnlyProject && (
                                <span className="task-label-note"> (Project Members Only)</span>
                            )}
                        </label>
                        <select
                            name="assignedToUserId"
                            value={formData.assignedToUserId}
                            onChange={handleInputChange}
                            className="task-form-select"
                        >
                            <option value="">Unassigned</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {getUserDisplayName(user)}
                                    {user.email && ` (${user.email})`}
                                </option>
                            ))}
                        </select>
                        {users.length === 0 && formData.projectId && (
                            <p className="task-no-members-note">
                                No members found for this project. Add members to assign tasks.
                            </p>
                        )}
                    </div>

                    <div className="task-form-group">
                        <label className="task-form-label">
                            Estimated Hours
                        </label>
                        <input
                            type="number"
                            name="estimatedHours"
                            value={formData.estimatedHours}
                            onChange={handleInputChange}
                            min="0"
                            className="task-form-input"
                            placeholder="0"
                        />
                    </div>

                    <div className="task-form-group">
                        <label className="task-form-label">
                            Due Date
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            className="task-form-input"
                        />
                    </div>
                </div>

                <div className="task-form-group">
                    <label className="task-form-label">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="task-form-textarea"
                        placeholder="Enter task description"
                    />
                </div>

                <div className="task-form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="task-btn task-btn-cancel"
                    >
                        <FaTimes className="task-btn-icon" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="task-btn task-btn-primary"
                    >
                        {loading ? (
                            <>
                                <span className="task-btn-spinner"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaSave className="task-btn-icon" />
                                {task ? 'Update Task' : 'Create Task'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;