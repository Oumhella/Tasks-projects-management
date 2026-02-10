import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  useTheme,
  Stack,
  Chip
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon,
  FlashOn as FlashOnIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import apiService from '../services/api';

// No longer importing Dashboard.css as we use MUI components

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalUsers: number;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projects, tasks, users] = await Promise.all([
        apiService.getProjects(),
        apiService.getTasks(),
        apiService.getUsers()
      ]);

      const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
      const activeProjects = projects.length - completedProjects;

      const completedTasks = tasks.filter(t => t.status === 'DONE').length;
      const todoTasks = tasks.filter(t => t.status === 'TODO').length;
      const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
      const overdueTasks = tasks.filter(t => {
        const due = new Date(t.endDate);
        return t.status !== 'DONE' && due < new Date();
      }).length;

      setStats({
        totalProjects: projects.length,
        activeProjects,
        completedProjects,
        totalTasks: tasks.length,
        todoTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        totalUsers: users.length
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">Loading Dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Paper sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
          <WarningIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>Error</Typography>
          <Typography color="text.secondary" paragraph>{error}</Typography>
          <Button variant="contained" onClick={fetchDashboardData}>Retry</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="800" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome to your project management dashboard
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Main Content */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={4}>
            {/* Total Projects Section */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">TOTAL PROJECTS</Typography>
                  <BarChartIcon sx={{ fontSize: 32, opacity: 0.8 }} />
                </Box>

                <Grid container spacing={3}>
                  {[
                    { label: 'ACTIVE PROJECTS', value: stats.activeProjects, badge: 'Live' },
                    { label: 'COMPLETED PROJECTS', value: stats.completedProjects, badge: 'Done' },
                    { label: 'TOTAL TASKS', value: stats.totalTasks, badge: 'All' }
                  ].map((item, index) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={index}>
                      <Box sx={{
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.2)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-2px)', bgcolor: 'rgba(255,255,255,0.25)' }
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" fontWeight="bold" sx={{ opacity: 0.9 }}>{item.label}</Typography>
                          <Chip label={item.badge} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 'bold', height: 20, fontSize: '0.65rem' }} />
                        </Box>
                        <Typography variant="h3" fontWeight="800">{item.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>

            {/* Tasks Overview Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                <AssignmentIcon color="warning" />
                <Typography variant="h6" fontWeight="bold">TASKS OVERVIEW</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'background.default', border: `1px solid ${theme.palette.divider}`, borderLeft: `4px solid ${theme.palette.warning.main}` }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>IN PROGRESS TASKS</Typography>
                    <Typography variant="h4" fontWeight="bold">{stats.inProgressTasks}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'background.default', border: `1px solid ${theme.palette.divider}`, borderLeft: `4px solid ${theme.palette.success.main}` }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>COMPLETED TASKS</Typography>
                    <Typography variant="h4" fontWeight="bold">{stats.completedTasks}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'background.default', border: `1px solid ${theme.palette.divider}`, borderLeft: `4px solid ${theme.palette.error.main}` }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>OVERDUE TASKS</Typography>
                    <Typography variant="h4" fontWeight="bold">{stats.overdueTasks}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Total Users Section */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">TOTAL USERS</Typography>
                <PeopleIcon sx={{ fontSize: 32, opacity: 0.8 }} />
              </Box>

              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h2" fontWeight="800" sx={{ mb: 1 }}>{stats.totalUsers}</Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>Registered Users</Typography>

                <Grid container spacing={2} sx={{ mt: 4 }}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.totalUsers > 0 ? Math.round((stats.totalUsers - stats.overdueTasks) / stats.totalUsers * 100) : 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Active</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.totalUsers > 0 ? Math.round((stats.overdueTasks / stats.totalUsers) * 100) : 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Inactive</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="h5" fontWeight="bold">92%</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Satisfaction</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Stack>
        </Grid>

        {/* Right Column - Quick Metrics */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            {/* Quick Metric Cards */}
            <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar variant="rounded" sx={{ bgcolor: theme.palette.warning.light, color: 'white' }}>
                    <AccessTimeIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600">To Do Tasks</Typography>
                </Box>
                <Typography variant="h3" fontWeight="800" gutterBottom>{stats.todoTasks}</Typography>
                <Typography variant="body2" color="text.secondary">Pending tasks to be picked up</Typography>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar variant="rounded" sx={{ bgcolor: theme.palette.success.light, color: 'white' }}>
                    <FlashOnIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600">Productivity</Typography>
                </Box>
                <Typography variant="h3" fontWeight="800" gutterBottom>
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">Overall team efficiency</Typography>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar variant="rounded" sx={{ bgcolor: theme.palette.primary.light, color: 'white' }}>
                    <PeopleIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600">Team</Typography>
                </Box>
                <Typography variant="h3" fontWeight="800" gutterBottom>{stats.totalUsers}</Typography>
                <Typography variant="body2" color="text.secondary">Active team members</Typography>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.default }}>
              <CardHeader title="Quick Actions" titleTypographyProps={{ fontWeight: 'bold' }} />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={2}>
                  <Button
                    component={Link}
                    to="/projects/create"
                    variant="contained"
                    fullWidth
                    startIcon={<AddIcon />}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    New Project
                  </Button>
                  <Button
                    component={Link}
                    to="/tasks/create"
                    variant="outlined"
                    fullWidth
                    startIcon={<AddIcon />}
                    sx={{ justifyContent: 'flex-start', py: 1.5, bgcolor: 'background.paper' }}
                  >
                    New Task
                  </Button>
                  <Button
                    component={Link}
                    to="/users/create"
                    variant="outlined"
                    fullWidth
                    startIcon={<AddIcon />}
                    sx={{ justifyContent: 'flex-start', py: 1.5, bgcolor: 'background.paper' }}
                  >
                    New User
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Recent Activity Placeholder */}
            <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <CardHeader
                title="Recent Activity"
                titleTypographyProps={{ fontWeight: 'bold' }}
                action={
                  <Button size="small" endIcon={<ArrowForwardIcon />}>View All</Button>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                  Recent activity will be displayed here when available.
                </Typography>
              </CardContent>
            </Card>

          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;