import React, {useState, useEffect, useCallback} from 'react';
import { FaEdit, FaEye, FaTrash, FaSearch } from 'react-icons/fa';
import apiService from "../../services/api";

interface TaskListProps {
    onEdit: (task: any) => void;
    onView: (task: any) => void;
}

interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    type: string;
    status: string;
    estimatedHours: number;
    dueDate: string;
    projectId: string;
    assignedToUserId: string;
    createdAt: string;
}

const TaskList: React.FC<TaskListProps> = ({ onEdit, onView }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [error, setError] = useState('');

        const filteredtasks = useCallback(()=> {
            let filtered = tasks;
            if (searchTerm) {
                filtered = filtered.filter(task =>
                    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    task.priority.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            if (statusFilter){
                filtered = filtered.filter(task => task.status === statusFilter);
            }
            setFilteredTasks(filtered);
        },[tasks,searchTerm, statusFilter]);

            useEffect(() => {
                filteredtasks();
            }, [filteredtasks]);


        // TODO: Replace with actual API call when backend is connected
        // For now, using mock data
        const fetchData = async() => {
            try {
                setLoading(true);
                setError('');
                const tasks = await apiService.getTasks();
                setTasks(tasks);

                } catch (err) {
                console.error('Error fetching tasks:', err);
                setError('Failed to load tasks. Please try again.');
                } finally {
                setLoading(false);
            }
        };
    useEffect(() => {
        fetchData();
    }, []);
    //     const mockTasks: Task[] = [
    //         {
    //             id: '1',
    //             title: 'Implement user authentication',
    //             description: 'Add login and registration functionality',
    //             priority: 'HIGH',
    //             type: 'FEATURE',
    //             status: 'IN_PR0GRESS',
    //             estimatedHours: 8,
    //             dueDate: '2024-02-15',
    //             projectId: '1',
    //             assignedToUserId: '1',
    //             createdAt: '2024-01-15'
    //         },
    //         {
    //             id: '2',
    //             title: 'Fix navigation bug',
    //             description: 'Navigation menu not working on mobile',
    //             priority: 'CRITICAL',
    //             type: 'BUG',
    //             status: 'TODO',
    //             estimatedHours: 4,
    //             dueDate: '2024-01-20',
    //             projectId: '1',
    //             assignedToUserId: '2',
    //             createdAt: '2024-01-16'
    //         },
    //         {
    //             id: '3',
    //             title: 'Design dashboard layout',
    //             description: 'Create responsive dashboard design',
    //             priority: 'MEDIUM',
    //             type: 'TASK',
    //             status: 'DONE',
    //             estimatedHours: 6,
    //             dueDate: '2024-01-25',
    //             projectId: '2',
    //             assignedToUserId: '3',
    //             createdAt: '2024-01-10'
    //         }
    //     ];
    //
    //     setTasks(mockTasks);
    //     setFilteredTasks(mockTasks);
    //     setLoading(false);
    // }, []);

    useEffect(() => {
        let filtered = tasks;

        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        if (priorityFilter) {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        if (typeFilter) {
            filtered = filtered.filter(task => task.type === typeFilter);
        }

        setFilteredTasks(filtered);
    }, [tasks, searchTerm, statusFilter, priorityFilter, typeFilter]);

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                // TODO: Replace with actual API call when backend is connected
                console.log('Deleting task:', taskId);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                
                setTasks(prev => prev.filter(task => task.id !== taskId));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'TODO': return 'bg-gray-100 text-gray-800';
            case 'IN_PR0GRESS': return 'bg-blue-100 text-blue-800';
            case 'IN_REVIEW': return 'bg-purple-100 text-purple-800';
            case 'TESTING': return 'bg-yellow-100 text-yellow-800';
            case 'DONE': return 'bg-green-100 text-green-800';
            case 'CLOSED': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-800';
        }
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
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
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
                        <option value="TODO">To Do</option>
                        <option value="IN_PR0GRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="TESTING">Testing</option>
                        <option value="DONE">Done</option>
                        <option value="CLOSED">Closed</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Priorities</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="BUG">Bug</option>
                        <option value="FEATURE">Feature</option>
                        <option value="TASK">Task</option>
                        <option value="STORY">Story</option>
                    </select>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Task
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hours
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {task.description}
                                        </div>
                                    </div>
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
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {task.estimatedHours}h
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onView(task)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="View"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => onEdit(task)}
                                            className="text-green-600 hover:text-green-900"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>No tasks found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default TaskList; 