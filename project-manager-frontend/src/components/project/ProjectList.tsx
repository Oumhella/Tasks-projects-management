
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
interface User {
    id: string;
    username: string;
    role: 'admin' | 'project-manager' | 'developer' | 'observator';

}
const ProjectList: React.FC<ProjectListProps> = ({ onEdit, onView }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [user, setUser] = useState<User>();


    const authenticatedUserRole = async () =>{

        setError('');
        try{
            const response = await apiService.getUserProfile();
            setUser(response);
        }catch (error){
            console.error("error fetching user profile", error);
            setError("error fetching user profile");
        }
    };
    useEffect(() => {
        authenticatedUserRole();
    }, []);

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

    // Fetch project statistics (members and tasks) after projects are loaded
    useEffect(() => {
        const fetchProjectStats = async () => {
            if (projects.length === 0) return;

            try {
                setError('');
                const projectsWithStats = await Promise.all(
                    projects.map(async (project) => {
                        try {
                            // Fetch project members
                            const members = await apiService.getProjectMembers(project.id);
                            // Fetch tasks for this project
                            const tasks = await apiService.getTasksByProjectId(project.id);

                            return {
                                ...project,
                                memberIds: members.map((member: any) => member.id),
                                taskIds: tasks.length
                            };
                        } catch (error) {
                            console.error(`Error fetching stats for project ${project.id}:`, error);
                            // Return project as-is if stats fetch fails
                            return project;
                        }
                    })
                );
                setProjects(projectsWithStats);
            } catch (error) {
                console.error('Error fetching project statistics:', error);
                setError('Failed to load project statistics. Some counts may be inaccurate.');
            }
        };

        fetchProjectStats();
    }, [projects.length]); // Only run when projects array length changes

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
    const hasCreateAuthority = () =>{
        if(user?.role === "project-manager"){
            return true;
        }
        return false;
    }

    const hasUpdateAuthority = () =>{
        if(user?.role === "project-manager" || user?.role === "developer"){
            return true;
        }
        return false;
    }
    const hasDeleteAuthority = () =>{
        if(user?.role === "project-manager"){
            return true;
        }
        return false;
    }

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
                                <span><FaUsers/> {project.memberIds?.length ?? 0} members</span>
                                <span><FaTasks/> {project.taskIds ?? 0} tasks</span>
                            </div>


                            <div className="project-dates">
                                <div>Start: {formatDate(project.startDate)}</div>
                                <div>End: {formatDate(project.endDate)}</div>
                            </div>

                            <div className="project-actions">
                                <button className="btn view" onClick={() => onView(project)}>
                                    <FaEye/> View
                                </button>
                                {hasUpdateAuthority() && (
                                <button className="btn edit" onClick={() => onEdit(project)}>
                                    <FaEdit/> Edit
                                </button>
                                )}
                                {hasDeleteAuthority() && (
                                <button className="btn delete" onClick={() => handleDeleteProject(project.id)}>
                                    <FaTrash/>
                                </button>
                                    )}
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
