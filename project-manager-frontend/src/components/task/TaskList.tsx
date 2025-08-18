import React, {useState, useEffect, useCallback} from 'react';
import { FaEdit, FaEye, FaTrash, FaSearch } from 'react-icons/fa';
import apiService from "../../services/api";
import './TaskList.css';

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
                await apiService.deleteTask(taskId);
                setTasks(prev => prev.filter(task => task.id !== taskId));
                console.log('Deleting task:', taskId);
            } catch (error) {
                console.error('Error deleting task:', error);
                setError("error deleting task");
            }
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'priority-critical';
            case 'HIGH': return 'priority-high';
            case 'MEDIUM': return 'priority-medium';
            case 'LOW': return 'priority-low';
            default: return 'priority-default';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'TODO': return 'status-todo';
            case 'IN_PR0GRESS': return 'status-in-progress';
            case 'IN_REVIEW': return 'status-in-review';
            case 'TESTING': return 'status-testing';
            case 'DONE': return 'status-done';
            case 'CLOSED': return 'status-closed';
            default: return 'status-default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'BUG': return 'type-bug';
            case 'FEATURE': return 'type-feature';
            case 'TASK': return 'type-task';
            case 'STORY': return 'type-story';
            default: return 'type-default';
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="task-list-container">
            {/* Filters */}
            <div className="filters-section">
                <div className="filters-grid">
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
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
                        className="filter-select"
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
                        className="filter-select"
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
            <div className="table-container">
                <table className="tasks-table">
                    <thead>
                    <tr>
                        <th>Task</th>
                        <th>Priority</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Hours</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTasks.map((task) => (
                        <tr key={task.id} className="task-row">
                            <td className="task-cell">
                                <div className="task-info">
                                    <div className="task-title">{task.title}</div>
                                    <div className="task-description">
                                        {task.description}
                                    </div>
                                </div>
                            </td>
                            <td className="task-cell">
                                    <span className={`badge ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                            </td>
                            <td className="task-cell">
                                    <span className={`badge ${getTypeColor(task.type)}`}>
                                        {task.type}
                                    </span>
                            </td>
                            <td className="task-cell">
                                    <span className={`badge ${getStatusColor(task.status)}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                            </td>
                            <td className="task-cell">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                            </td>
                            <td className="task-cell">
                                {task.estimatedHours}h
                            </td>
                            <td className="task-cell">
                                <div className="actions-container">
                                    <button
                                        onClick={() => onView(task)}
                                        className="action-btn view-btn"
                                        title="View"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => onEdit(task)}
                                        className="action-btn edit-btn"
                                        title="Edit"
                                        style={{ background: "#2563eb", color: "white", padding: "6px", borderRadius: "6px" }}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="action-btn delete-btn"
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
                <div className="no-tasks">
                    <p>No tasks found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default TaskList;