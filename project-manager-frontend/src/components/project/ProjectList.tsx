import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    IconButton,
    Chip,
    Grid,
    Box,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Stack,
    useTheme,
    alpha
} from '@mui/material';
import {
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
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
    taskIds: number;
}

interface User {
    id: string;
    username: string;
    role: 'admin' | 'project-manager' | 'developer' | 'observator';
}

const ProjectList: React.FC<ProjectListProps> = ({ onEdit, onView }) => {
    const theme = useTheme();
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
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

    useEffect(() => {
        const fetchProjectStats = async () => {
            if (projects.length === 0) return;

            try {
                setError('');
                const projectsWithStats = await Promise.all(
                    projects.map(async (project) => {
                        try {
                            const members = await apiService.getProjectMembers(project.id);
                            const tasks = await apiService.getTasksByProjectId(project.id);

                            return {
                                ...project,
                                memberIds: members.map((member: any) => member.id),
                                taskIds: tasks.length
                            };
                        } catch (error) {
                            console.error(`Error fetching stats for project ${project.id}:`, error);
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
    }, [projects.length]);

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

    const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        switch (status) {
            case 'PLANNING': return 'info';
            case 'ON_TRACK': return 'success';
            case 'IN_PROGRESS': return 'primary';
            case 'ON_HOLD': return 'warning';
            case 'COMPLETED': return 'success';
            case 'ARCHIVED': return 'default';
            default: return 'default';
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
            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Search projects..."
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

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Status Filter</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status Filter"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="PLANNING">Planning</MenuItem>
                        <MenuItem value="ON_TRACK">On Track</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="ON_HOLD">On Hold</MenuItem>
                        <MenuItem value="COMPLETED">Completed</MenuItem>
                        <MenuItem value="ARCHIVED">Archived</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Projects Grid */}
            <Grid container spacing={3}>
                {filteredProjects.map((project) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                        <Card 
                            elevation={0}
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 3,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    boxShadow: theme.shadows[8],
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <Box 
                                sx={{ 
                                    height: 8, 
                                    background: `linear-gradient(135deg, ${project.color || theme.palette.primary.main}, ${alpha(project.color || theme.palette.primary.main, 0.7)})`,
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12
                                }} 
                            />
                            
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h6" component="h3" fontWeight="bold" sx={{ flexGrow: 1, pr: 1 }}>
                                        {project.name}
                                    </Typography>
                                    <Chip 
                                        label={getStatusLabel(project.status)} 
                                        color={getStatusColor(project.status)}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>

                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ 
                                        mb: 3,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {project.description}
                                </Typography>

                                <Stack spacing={1.5}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PeopleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {project.memberIds?.length ?? 0} members
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AssignmentIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {project.taskIds ?? 0} tasks
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>

                            <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                                <Button 
                                    size="small" 
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => onView(project)}
                                    variant="outlined"
                                    sx={{ flexGrow: 1 }}
                                >
                                    View
                                </Button>
                                {hasUpdateAuthority() && (
                                    <IconButton 
                                        size="small" 
                                        onClick={() => onEdit(project)}
                                        color="primary"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                                {hasDeleteAuthority() && (
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleDeleteProject(project.id)}
                                        color="error"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {filteredProjects.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No projects found matching your criteria.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ProjectList;
