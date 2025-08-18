import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import apiService from "../../services/api";

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

const TaskForm: React.FC<TaskFormProps> = ({ task, projectId, readOnlyProject , onSave, onCancel }) => {
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
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading form data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => setError('')}
                                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-400 hover:bg-red-100"
                            >
                                <span className="sr-only">Dismiss</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project *
                        </label>
                        {readOnlyProject && projectId ? (
                            <div className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={projects.find(p => p.id === formData.projectId)?.name || 'Loading...'}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <span className="text-sm text-gray-500 italic">
                (Fixed to current project)
            </span>
                            </div>
                        ) : (
                            <select
                                name="projectId"
                                value={formData.projectId}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {priorityOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {typeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assigned To
                        </label>
                        <select
                            name="assignedToUserId"
                            value={formData.assignedToUserId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Unassigned</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estimated Hours
                        </label>
                        <input
                            type="number"
                            name="estimatedHours"
                            value={formData.estimatedHours}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task description"
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center disabled:opacity-50"
                    >
                        <FaTimes className="mr-2"/>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                    >
                        <FaSave className="mr-2" />
                        {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;