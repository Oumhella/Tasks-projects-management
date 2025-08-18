import React, { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaUsers, FaTasks, FaPlus, FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import apiService from "../../services/api";
import TaskForm from "../task/TaskForm";
import {useNavigate} from "react-router-dom";

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
}

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    type: string;
    estimatedHours: number;
    dueDate: string;
    assignedToUserId: string;
}

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface ProjectDetailProps {
    project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const [showTaskForm, setShowTaskForm] = useState(false);
        // Use a single useEffect hook to handle all data fetching for this component.
    // The dependency array `[project.id]` ensures this effect runs whenever the project prop changes.
    useEffect(() => {
        const fetchData = async () => {
            if (!project || !project.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                // Fetch tasks for the project
                const fetchedTasks = await apiService.getTasksByProjectId(project.id);
                setTasks(fetchedTasks);

                // Fetch team members based on the project's member IDs
                // This is a placeholder as your API doesn't have a getMembersByProjectId endpoint.
                // You would need to make a call for each member or a single call to a users endpoint.
                // For now, let's keep the mock data for team members as it was.
                // A better approach would be:
                // const memberPromises = project.memberIds.map(memberId => apiService.getUser(memberId));
                // const fetchedMembers = await Promise.all(memberPromises);
                setTeamMembers([
                    {
                        id: '1',
                        name: 'John Doe',
                        email: 'john@example.com',
                        role: 'Project Manager'
                    },
                    {
                        id: '2',
                        name: 'Jane Smith',
                        email: 'jane@example.com',
                        role: 'Developer'
                    },
                    {
                        id: '3',
                        name: 'Bob Johnson',
                        email: 'bob@example.com',
                        role: 'Designer'
                    }
                ]);

            } catch (err) {
                console.error('Error fetching project data:', err);
                setError('Failed to load project details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [project]);



    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PLANNING': return 'bg-blue-100 text-blue-800';
            case 'ON_TRACK': return 'bg-green-100 text-green-800';
            case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED': return 'bg-gray-100 text-gray-800';
            case 'ARCHIVED': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'bg-red-100 text-red-800';
            case 'HIGH': return 'bg-orange-100 text-orange-800';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
            case 'LOW': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAddTask = () => {
        setShowTaskForm(true);
    };

    // Handle successful task creation/update - refresh tasks
    const handleTaskSaved = async () => {
        setShowTaskForm(false);
        // try {
        //     const fetchedTasks = await apiService.getTasksByProjectId(project.id);
        //     setTasks(fetchedTasks);
        // } catch (err) {
        //     console.error('Error refreshing tasks:', err);
        // }
    };

    // Handle task form cancellation
    const handleTaskFormCancel = () => {
        setShowTaskForm(false);
    };
    
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'BUG': return 'bg-red-100 text-red-800';
            case 'FEATURE': return 'bg-blue-100 text-blue-800';
            case 'TASK': return 'bg-green-100 text-green-800';
            case 'STORY': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading tasks and team members...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    if (showTaskForm) {
        return (
            <TaskForm
                projectId={project.id}
                readOnlyProject={true}
                onSave={handleTaskSaved}
                onCancel={handleTaskFormCancel}
            />
        );
    }
    // const handleAddTask = (project: any) => {
    //     <TaskForm
    //         projectId={project.id}
    //         onSave={() => navigate(`/projects/${project.id}`)}
    //         onCancel={() => navigate(`/projects/${project.id}`)}
    //     />
    // };
    //

    return (
        <div className="space-y-6">
            {/* Project Header */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                    <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                        style={{ backgroundColor: project.color }}
                    >
                        {project.icon}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                        </span>
                    </div>
                </div>
                <p className="text-gray-600 mb-6">{project.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <FaCalendar className="mr-2" />
                        <span>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="mr-2" />
                        <span>End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <FaUsers className="mr-2" />
                        <span>{teamMembers.length} team members</span>
                    </div>
                </div>
            </div>

            {/* Project Tasks */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FaTasks className="mr-2" />
                        Project Tasks ({tasks.length})
                    </h3>
                    <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center">
                        <FaPlus className="mr-2" />
                        Add Task
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Task
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                        <div className="text-sm text-gray-500">{task.description}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                            {getStatusLabel(task.status)}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(task.type)}`}>
                                            {task.type}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900">
                                            <FaEdit />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Team Members */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FaUsers className="mr-2" />
                        Team Members ({teamMembers.length})
                    </h3>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center">
                        <FaPlus className="mr-2" />
                        Add Member
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    <FaUser />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                    <p className="text-xs text-gray-400">{member.role}</p>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <FaEdit />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;