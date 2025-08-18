import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaEye, FaTrash, FaSearch, FaUsers, FaTasks } from 'react-icons/fa';
import apiService from "../../services/api";
import './ProjectList.css';

interface ProjectListProps {
    onEdit: (project: any) => void;
    onView: (project: any) => void;
}

interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    color: string;
    icon: string;
    memberIds: string[];
    createdAt: string;
    taskIds: number ;
}

const ProjectList: React.FC<ProjectListProps> = ({ onEdit, onView }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filterProjects = useCallback(() => {
        let filtered = projects;

        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.icon.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(project => project.status === statusFilter);
        }

        setFilteredProjects(filtered);
    }, [projects, searchTerm, statusFilter]);

    useEffect(() => {
        filterProjects();
    }, [filterProjects]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await apiService.getProjects();
            setProjects(data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Failed to load projects. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDeleteProject = async (projectId: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await apiService.deleteProject(projectId);
                setProjects(prev => prev.filter(project => project.id !== projectId));
            } catch (error) {
                console.error('Error deleting project:', error);
                setError('Failed to delete project. Please try again.');
            }
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PLANNING': return 'Planning';
            case 'ON_TRACK': return 'On Track';
            case 'IN_PROGRESS': return 'In Progress';
            case 'ON_HOLD': return 'On Hold';
            case 'COMPLETED': return 'Completed';
            case 'ARCHIVED': return 'Archived';
            default: return status;
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'No date';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="project-list-container">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="filters">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="PLANNING">Planning</option>
                    <option value="ON_TRACK">On Track</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
            </div>

            {/* Projects Grid */}
            <div className="projects-grid">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="project-card">
                        <div className="project-header" style={{ backgroundColor: project.color }}>
                            {project.icon}
                        </div>

                        <div className="project-body">
                            <div className="project-title-row">
                                <h3>{project.name}</h3>
                                <span className={`status-badge status-${project.status.toLowerCase()}`}>
                                    {getStatusLabel(project.status)}
                                </span>
                            </div>

                            <p className="project-description">{project.description}</p>

                            <div className="project-stats">
                                <span><FaUsers /> {project.memberIds.length} members</span>
                                <span><FaTasks /> {project.taskIds}</span>
                            </div>

                            <div className="project-dates">
                                <div>Start: {formatDate(project.startDate)}</div>
                                <div>End: {formatDate(project.endDate)}</div>
                            </div>

                            <div className="project-actions">
                                <button className="btn view" onClick={() => onView(project)}>
                                    <FaEye /> View
                                </button>
                                <button className="btn edit" onClick={() => onEdit(project)}>
                                    <FaEdit /> Edit
                                </button>
                                <button className="btn delete" onClick={() => handleDeleteProject(project.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="no-projects">No projects found matching your criteria.</div>
            )}
        </div>
    );
};

export default ProjectList;
