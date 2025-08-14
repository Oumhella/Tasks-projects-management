import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { apiService } from '../../services/api'; // Import your API service

interface ProjectFormProps {
    project?: any;
    onSave: () => void;
    onCancel: () => void;
    isEdit?: boolean;
}

interface ProjectFormData {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    color: string;
    icon: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel, isEdit = false }) => {
    const [formData, setFormData] = useState<ProjectFormData>({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'PLANNING',
        color: '#3B82F6',
        icon: '📋'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
                status: project.status || 'PLANNING',
                color: project.color || '#3B82F6',
                icon: project.icon || '📋'
            });
        }
    }, [project]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('Project name is required');
            return false;
        }

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (start > end) {
                setError('Start date cannot be after end date');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Prepare data for API
            const projectData = {
                ...formData,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            };

            if (isEdit && project?.id) {
                // Update existing project
                await apiService.updateProject(project.id, projectData);
                console.log('Project updated successfully');
            } else {
                // Create new project
                await apiService.createProject(projectData);
                console.log('Project created successfully');
            }

            onSave();
        } catch (error: any) {
            console.error('Error saving project:', error);
            setError(error.message || 'An error occurred while saving the project');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!project?.id || !isEdit) return;

        const confirmDelete = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
        if (!confirmDelete) return;

        setLoading(true);
        setError(null);

        try {
            await apiService.deleteProject(project.id);
            console.log('Project deleted successfully');
            onSave(); // Trigger refresh
        } catch (error: any) {
            console.error('Error deleting project:', error);
            setError(error.message || 'An error occurred while deleting the project');
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = [
        { value: 'PLANNING', label: 'Planning' },
        { value: 'ON_TRACK', label: 'On Track' },
        { value: 'ON_HOLD', label: 'On Hold' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'ARCHIVED', label: 'Archived' }
    ];

    const iconOptions = [
        '📋', '🚀', '💻', '🎨', '🔧', '📱', '🌐', '📊', '🎯', '⚡', '🔒', '📈'
    ];

    const colorOptions = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
        '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            placeholder="Enter project name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Icon
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                            {iconOptions.map((icon, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                    className={`p-2 text-xl rounded border-2 transition-colors disabled:opacity-50 ${
                                        formData.icon === icon
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Color
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {colorOptions.map((color, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                                    className={`w-10 h-10 rounded-full border-2 transition-colors disabled:opacity-50 ${
                                        formData.color === color
                                            ? 'border-gray-800'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
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
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="Enter project description"
                    />
                </div>

                {/* Project Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Project Preview</h4>
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                            style={{ backgroundColor: formData.color }}
                        >
                            {formData.icon}
                        </div>
                        <div>
                            <h5 className="font-medium text-gray-900">
                                {formData.name || 'Project Name'}
                            </h5>
                            <p className="text-sm text-gray-500">
                                {formData.description || 'Project description will appear here'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Status: {statusOptions.find(s => s.value === formData.status)?.label}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div>
                        {isEdit && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                            >
                                Delete Project
                            </button>
                        )}
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                        >
                            <FaTimes className="mr-2" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.name.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                        >
                            <FaSave className="mr-2" />
                            {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;