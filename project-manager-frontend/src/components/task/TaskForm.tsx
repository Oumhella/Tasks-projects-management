import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import apiService from "../../services/api";
import './TaskForm.css'; // Import the CSS file

interface TaskFormProps {
    task?: any;
    projectId?: string;
    readOnlyProject?: boolean;
    onSave: () => void;
    onCancel: () => void;
    // isEdit?: boolean;
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

const TaskForm: React.FC<TaskFormProps> = ({ task, projectId, readOnlyProject, onSave, onCancel}) => {
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
    const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            setInitialLoading(true);
            setError('');

            try {
                const [projectsData, usersData] = await Promise.all([
                    apiService.getProjects(),
                    apiService.getUsers()
                ]);

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
    }, [task, projectId]);

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
        { value: 'CRITICAL', label: 'Critical', color: 'text-red-600' },
        { value: 'HIGH', label: 'High', color: 'text-orange-600' },
        { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600' },
        { value: 'LOW', label: 'Low', color: 'text-green-600' }
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
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <span className="loading-text">Loading form data...</span>
            </div>
        );
    }

    return (
        <div className="task-form-container">
            {error && (
                <div className="error-message">
                    <div className="error-content">
                        <div className="error-icon">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="error-text">{error}</p>
                        </div>
                        <div className="error-dismiss">
                            <button
                                onClick={() => setError('')}
                                className="error-dismiss-button"
                            >
                                <span className="sr-only">Dismiss</span>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="task-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Project *
                        </label>
                        {readOnlyProject && projectId ? (
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={projects.find(p => p.id === formData.projectId)?.name || 'Loading...'}
                                    disabled
                                    className="form-input"
                                />
                                <span className="fixed-project-note">
                                    (Fixed to current project)
                                </span>
                            </div>
                        ) : (
                            <select
                                name="projectId"
                                value={formData.projectId}
                                onChange={handleInputChange}
                                required
                                className="form-select"
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

                    <div className="form-group">
                        <label className="form-label">
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            {priorityOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            {typeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Assigned To
                        </label>
                        <select
                            name="assignedToUserId"
                            value={formData.assignedToUserId}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="">Unassigned</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Estimated Hours
                        </label>
                        <input
                            type="number"
                            name="estimatedHours"
                            value={formData.estimatedHours}
                            onChange={handleInputChange}
                            min="0"
                            className="form-input"
                            placeholder="0"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Due Date
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="form-textarea"
                        placeholder="Enter task description"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="cancel-button"
                    >
                        <FaTimes />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        <FaSave />
                        {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;