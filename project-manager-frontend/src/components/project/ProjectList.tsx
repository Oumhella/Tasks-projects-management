import React, {useState, useEffect, useCallback} from 'react';
import { FaEdit, FaEye, FaTrash, FaSearch, FaUsers, FaTasks } from 'react-icons/fa';
import apiService from "../../services/api";

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

            // Fallback to mock data if API fails
            const mockProjects: Project[] = [
                {
                    id: '1',
                    name: 'E-commerce Platform',
                    description: 'Modern e-commerce platform with React and Node.js',
                    status: 'ON_TRACK',
                    startDate: '2024-01-01',
                    endDate: '2024-06-30',
                    color: '#3B82F6',
                    icon: '🛒',
                    memberIds: ['1', '2', '3'],
                    createdAt: '2024-01-01'
                },
                {
                    id: '2',
                    name: 'Mobile App Development',
                    description: 'Cross-platform mobile app using React Native',
                    status: 'PLANNING',
                    startDate: '2024-03-01',
                    endDate: '2024-08-31',
                    color: '#10B981',
                    icon: '📱',
                    memberIds: ['1', '4'],
                    createdAt: '2024-01-15'
                },
                {
                    id: '3',
                    name: 'Data Analytics Dashboard',
                    description: 'Real-time analytics dashboard for business metrics',
                    status: 'COMPLETED',
                    startDate: '2023-10-01',
                    endDate: '2024-01-31',
                    color: '#8B5CF6',
                    icon: '📊',
                    memberIds: ['2', '3', '5'],
                    createdAt: '2023-10-01'
                },
                {
                    id: '4',
                    name: 'API Gateway Service',
                    description: 'Microservices API gateway with authentication',
                    status: 'IN_PROGRESS',
                    startDate: '2024-02-01',
                    endDate: '2024-05-31',
                    color: '#F59E0B',
                    icon: '🔌',
                    memberIds: ['1', '3'],
                    createdAt: '2024-02-01'
                }
            ];
            setProjects(mockProjects);
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PLANNING': return 'bg-blue-100 text-blue-800';
            case 'ON_TRACK': return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
            case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED': return 'bg-gray-100 text-gray-800';
            case 'ARCHIVED': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-800';
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
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                        {/* Project Header */}
                        <div
                            className="h-32 flex items-center justify-center text-4xl"
                            style={{ backgroundColor: project.color }}
                        >
                            {project.icon}
                        </div>

                        {/* Project Content */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {project.name}
                                </h3>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                    {getStatusLabel(project.status)}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {project.description}
                            </p>

                            {/* Project Stats */}
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <div className="flex items-center">
                                    <FaUsers className="mr-1" />
                                    <span>{project.memberIds.length} members</span>
                                </div>
                                <div className="flex items-center">
                                    <FaTasks className="mr-1" />
                                    <span>12 tasks</span>
                                </div>
                            </div>

                            {/* Project Dates */}
                            <div className="text-xs text-gray-500 mb-4">
                                <div>Start: {formatDate(project.startDate)}</div>
                                <div>End: {formatDate(project.endDate)}</div>
                            </div>

                            {/* Project Actions */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onView(project)}
                                    className="flex-1 bg-blue-500 text-white text-sm py-2 px-3 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
                                >
                                    <FaEye className="mr-1" />
                                    View
                                </button>
                                <button
                                    onClick={() => onEdit(project)}
                                    className="flex-1 bg-green-500 text-white text-sm py-2 px-3 rounded hover:bg-green-600 transition-colors flex items-center justify-center"
                                >
                                    <FaEdit className="mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="bg-red-500 text-white text-sm py-2 px-3 rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>No projects found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectList;