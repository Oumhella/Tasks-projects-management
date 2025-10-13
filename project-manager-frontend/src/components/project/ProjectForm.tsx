import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { apiService } from '../../services/api';
import './ProjectForm.css';

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
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('Project name is required');
            return false;
        }
        if (formData.startDate && formData.endDate) {
            if (new Date(formData.startDate) > new Date(formData.endDate)) {
                setError('Start date cannot be after end date');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        try {
            const projectData = {
                ...formData,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            };

            if (isEdit && project?.id) {
                await apiService.updateProject(project.id, projectData);
            } else {
                await apiService.createProject(projectData);
            }
            onSave();
        } catch (err: any) {
            setError(err.message || 'Error saving project');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!project?.id || !isEdit) return;
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        setLoading(true);
        setError(null);
        try {
            await apiService.deleteProject(project.id);
            onSave();
        } catch (err: any) {
            setError(err.message || 'Error deleting project');
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

    const iconOptions = ['📋', '🚀', '💻', '🎨', '🔧', '📱', '🌐', '📊', '🎯', '⚡', '🔒', '📈'];
    const colorOptions = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];

    return (
        <div className="project-form-container">
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="project-form">
                <div className="form-group">
                    <label className="form-label">Project Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="Enter project name"
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="form-select"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                <div className="date-grid">
                    <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Project Icon</label>
                    <div className="icon-options">
                        {iconOptions.map((icon, index) => (
                            <button
                                key={index}
                                type="button"
                                disabled={loading}
                                onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Project Color</label>
                    <div className="color-options">
                        {colorOptions.map((color, index) => (
                            <button
                                key={index}
                                type="button"
                                disabled={loading}
                                onClick={() => setFormData(prev => ({ ...prev, color }))}
                                style={{ backgroundColor: color }}
                                className={`color-option ${formData.color === color ? 'selected' : ''}`}
                            ></button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        disabled={loading}
                        placeholder="Enter project description"
                        className="form-control"
                    />
                </div>

                <div className="project-preview">
                    <div
                        className="icon-preview"
                        style={{ backgroundColor: formData.color }}
                    >
                        {formData.icon}
                    </div>
                    <div className="preview-text">
                        <h4>{formData.name || 'Project Name'}</h4>
                        <p>{formData.description || 'Project description will appear here'}</p>
                        <small>
                            Status: {statusOptions.find(s => s.value === formData.status)?.label}
                        </small>
                    </div>
                </div>

                <div className="form-actions">
                    {isEdit && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="btn btn-outline btn-danger"
                        >
                            Delete Project
                        </button>
                    )}
                    <div className="action-buttons">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="btn btn-outline"
                        >
                            <FaTimes /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.name.trim()}
                            className="btn btn-primary"
                        >
                            {loading ? <span className="spinner"></span> : <FaSave />}
                            {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;