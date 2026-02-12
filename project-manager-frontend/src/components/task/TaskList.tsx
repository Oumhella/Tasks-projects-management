import React, {useState, useEffect, useCallback} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Box,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Typography,
    Stack,
    useTheme
} from '@mui/material';
import {
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Search as SearchIcon
} from '@mui/icons-material';
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

interface User {
    id: string;
    username: string;
    role: 'admin' | 'project-manager' | 'developer' | 'observator';
}

const TaskList: React.FC<TaskListProps> = ({ onEdit, onView }) => {
    const theme = useTheme();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState<User>();

    const authenticatedUserRole = async () => {
        setError('');
        try {
            const response = await apiService.getUserProfile();
            setUser(response);
        } catch (error) {
            console.error("error fetching user profile", error);
            setError("error fetching user profile");
        }
    };

    useEffect(() => {
        authenticatedUserRole();
    }, []);

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
            } catch (error) {
                console.error('Error deleting task:', error);
                setError("error deleting task");
            }
        }
    };

    const getPriorityColor = (priority: string): "default" | "error" | "warning" | "info" | "success" => {
        switch (priority) {
            case 'CRITICAL': return 'error';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'info';
            case 'LOW': return 'success';
            default: return 'default';
        }
    };

    const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        switch (status) {
            case 'TODO': return 'default';
            case 'IN_PROGRESS': return 'primary';
            case 'IN_REVIEW': return 'info';
            case 'TESTING': return 'warning';
            case 'DONE': return 'success';
            case 'CLOSED': return 'default';
            default: return 'default';
        }
    };

    const getTypeColor = (type: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        switch (type) {
            case 'BUG': return 'error';
            case 'FEATURE': return 'primary';
            case 'TASK': return 'info';
            case 'STORY': return 'secondary';
            default: return 'default';
        }
    };

    const hasUpdateAuthority = () => {
        return user?.role === "project-manager" || user?.role === "developer";
    }

    const hasDeleteAuthority = () => {
        return user?.role === "project-manager";
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            {/* Filters */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <TextField
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: 250 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="TODO">To Do</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="IN_REVIEW">In Review</MenuItem>
                        <MenuItem value="TESTING">Testing</MenuItem>
                        <MenuItem value="DONE">Done</MenuItem>
                        <MenuItem value="CLOSED">Closed</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={priorityFilter}
                        label="Priority"
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <MenuItem value="">All Priorities</MenuItem>
                        <MenuItem value="CRITICAL">Critical</MenuItem>
                        <MenuItem value="HIGH">High</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="LOW">Low</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={typeFilter}
                        label="Type"
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <MenuItem value="">All Types</MenuItem>
                        <MenuItem value="BUG">Bug</MenuItem>
                        <MenuItem value="FEATURE">Feature</MenuItem>
                        <MenuItem value="TASK">Task</MenuItem>
                        <MenuItem value="STORY">Story</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            {/* Tasks Table */}
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Hours</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTasks.map((task) => (
                            <TableRow 
                                key={task.id}
                                sx={{ 
                                    '&:hover': { bgcolor: 'action.hover' },
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <TableCell>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="600">
                                            {task.title}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                maxWidth: 300
                                            }}
                                        >
                                            {task.description}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={task.priority} 
                                        color={getPriorityColor(task.priority)}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={task.type} 
                                        color={getTypeColor(task.type)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={task.status.replace('_', ' ')} 
                                        color={getStatusColor(task.status)}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="500">
                                        {task.estimatedHours}h
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                        <IconButton
                                            size="small"
                                            onClick={() => onView(task)}
                                            color="primary"
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                        {hasUpdateAuthority() && (
                                            <IconButton
                                                size="small"
                                                onClick={() => onEdit(task)}
                                                color="primary"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {hasDeleteAuthority() && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteTask(task.id)}
                                                color="error"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredTasks.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No tasks found matching your criteria.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default TaskList;