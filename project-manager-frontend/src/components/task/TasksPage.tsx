import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    CircularProgress,
    Paper,
    Alert
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskDetail from './TaskDetail';
import apiService from "../../services/api";

interface User {
    id: string;
    username: string;
    role: 'admin' | 'project-manager' | 'developer' | 'observator';
}

const TasksPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'detail'>('list');
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [user, setUser] = useState<User>();
    const [error, setError] = useState<String>('');
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (id) {
            if (window.location.pathname.includes('/edit')) {
                setView('edit');
            } else {
                setView('detail');
            }
        } else if (window.location.pathname.includes('/create')) {
            setView('create');
        } else {
            setView('list');
        }
    }, [id]);

    const hasCreateAuthority = () => {
        return user?.role === "project-manager";
    }

    const hasUpdateAuthority = () => {
        return user?.role === "project-manager" || user?.role === "developer";
    }

    const handleCreateTask = () => {
        navigate('/tasks/create');
        setView('create');
    };

    const handleEditTask = (task: any) => {
        setSelectedTask(task);
        navigate(`/tasks/${task.id}/edit`);
        setView('edit');
    };

    const handleViewTask = (task: any) => {
        setSelectedTask(task);
        navigate(`/tasks/${task.id}`);
        setView('detail');
    };

    const handleBackToList = () => {
        navigate('/tasks');
        setView('list');
        setSelectedTask(null);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            );
        }

        switch (view) {
            case 'create':
                return (
                    <Container maxWidth="lg">
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" component="h1" fontWeight="bold">Create New Task</Typography>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBackToList}
                                variant="outlined"
                            >
                                Back to Tasks
                            </Button>
                        </Box>
                        <Paper sx={{ p: 4, borderRadius: 2 }}>
                            <TaskForm onSave={handleBackToList} onCancel={handleBackToList} />
                        </Paper>
                    </Container>
                );
            case 'edit':
                return (
                    <Container maxWidth="lg">
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" component="h1" fontWeight="bold">Edit Task</Typography>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBackToList}
                                variant="outlined"
                            >
                                Back to Tasks
                            </Button>
                        </Box>
                        <Paper sx={{ p: 4, borderRadius: 2 }}>
                            <TaskForm
                                task={selectedTask}
                                onSave={handleBackToList}
                                onCancel={handleBackToList}
                            />
                        </Paper>
                    </Container>
                );
            case 'detail':
                return (
                    <Container maxWidth="xl">
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" component="h1" fontWeight="bold">Task Details</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {hasUpdateAuthority() && (
                                    <Button
                                        variant="contained"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEditTask(selectedTask)}
                                    >
                                        Edit
                                    </Button>
                                )}
                                <Button
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handleBackToList}
                                    variant="outlined"
                                >
                                    Back to Tasks
                                </Button>
                            </Box>
                        </Box>
                        <TaskDetail task={selectedTask} />
                    </Container>
                );
            default:
                return (
                    <Container maxWidth="xl">
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>Tasks</Typography>
                                <Typography variant="body1" color="text.secondary">Manage and track your tasks</Typography>
                            </Box>
                            {hasCreateAuthority() && (
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleCreateTask}
                                    size="large"
                                >
                                    Create Task
                                </Button>
                            )}
                        </Box>
                        <TaskList onEdit={handleEditTask} onView={handleViewTask} />
                    </Container>
                );
        }
    };

    return (
        <Box sx={{ py: 4 }}>
            {error && (
                <Container maxWidth="xl" sx={{ mb: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </Container>
            )}
            {renderContent()}
        </Box>
    );
};

export default TasksPage;