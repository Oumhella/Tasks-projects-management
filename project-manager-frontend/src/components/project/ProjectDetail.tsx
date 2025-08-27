// ProjectDetail.tsx - Updated handleAddMember logic
import React, { useState, useEffect } from 'react';
import {FaCalendar, FaClock, FaUsers, FaTasks, FaPlus, FaEdit, FaTrash, FaUser, FaEye} from 'react-icons/fa';
import apiService from "../../services/api";
import TaskForm from "../task/TaskForm";
import {useNavigate} from "react-router-dom";
import "./ProjectDetail.css"
import TaskDetail from "../task/TaskDetail";
import TaskList from "../task/TaskList";
import ProjectPulse from "./ProjectPulse";
import User from "../users/User";
import Kanban from "../task/Kanban";
import ProjectNetworkMap from "./ProjectNetworkMap";

// ... keep all your interfaces the same ...
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
    const [showTaskView, setShowTaskView] = useState(false);
    const [task, setTask] = useState<Task>();
    const [showTaskEdit, setShowTaskEdit] = useState(false);
    const [showProjectPulse, setShowProjectPulse] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);
    const [showVueKanban, setShowVueKanban] = useState(false);
    const [showProjectNetwork, setShowProjectNetwork] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!project?.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                const fetchedTasks = await apiService.getTasksByProjectId(project.id);
                setTasks(fetchedTasks);
                const fetchedMembers = await apiService.getProjectMembers(project.id);
                setTeamMembers(fetchedMembers);
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
            case 'PLANNING': return 'status-planning';
            case 'ON_TRACK': return 'status-on-track';
            case 'ON_HOLD': return 'status-on-hold';
            case 'COMPLETED': return 'status-completed';
            case 'ARCHIVED': return 'status-archived';
            default: return 'status-default';
        }
    };

    const getStatusLabel = (status: string) =>
        status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'priority-critical';
            case 'HIGH': return 'priority-high';
            case 'MEDIUM': return 'priority-medium';
            case 'LOW': return 'priority-low';
            default: return 'priority-default';
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

    const handleViewTask = (task: React.SetStateAction<Task | undefined>) => {
        setShowTaskView(true);
        setTask(task);
        return task;
    }

    const handleDeleteTask = async (id: string) => {
        if(window.confirm("are you sure you want to delete this task?")) {
            setLoading(true);
            try {
                await apiService.deleteTask(id);
                setTasks(prev => prev.filter(task => task.id !== id));
            } catch (error) {
                console.error("Error deleting task", error);
                setError("Failed to delete task");
            }finally{
                setLoading(false);
            }
        }
    }

    const handleAddTask = () => setShowTaskForm(true);

    const handleAddMember = () => setShowUserForm(true);

    const handleMemberAdded = async () => {
        setShowUserForm(false);

        try {
            const fetchedMembers = await apiService.getProjectMembers(project.id);
            setTeamMembers(fetchedMembers);

            console.log('Member added successfully');
        } catch (err) {
            console.error('Error refreshing team members:', err);
        }
    };

    const handleUserFormCancel = () => setShowUserForm(false);

    const handleTaskSaved = async () => {
        setShowTaskForm(false);
        try {
            const fetchedTasks = await apiService.getTasksByProjectId(project.id);
            setTasks(fetchedTasks);
        } catch (err) { console.error(err); }
    };

    const handleTaskFormCancel = () => setShowTaskForm(false);

    const handleEditTask = (task: React.SetStateAction<Task | undefined>) => {
        setShowTaskEdit(true);
        setTask(task);
    }

    const handleTaskEdited = async () => {
        setShowTaskEdit(false);
        try {
            const fetchedTasks = await apiService.getTasksByProjectId(project.id);
            setTasks(fetchedTasks);
        } catch (err) { console.error(err); }
    };

    const handleTaskEditCancel = () => setShowTaskEdit(false);

    const handleProjectPulse = () => {
        setShowProjectPulse(true);
    }

    const handleVueKanban = () =>{
        setShowVueKanban(true);
    }
    const handleProjectNetwork = () =>{
        setShowProjectNetwork(true);
    }

    if (loading) return <div className="loading">Loading tasks and team members...</div>;

    if (error) return <div className="error">{error}</div>;

    if (showTaskForm)
        return <TaskForm projectId={project.id} readOnlyProject onSave={handleTaskSaved} onCancel={handleTaskFormCancel} />;

    if(showTaskEdit)
        return <TaskForm task={task} projectId={project.id} readOnlyProject onSave={handleTaskEdited} onCancel={handleTaskEditCancel} />;

    if(showTaskView)
        return <TaskDetail task={task} />

    if (showProjectPulse){
        return <ProjectPulse project={project}/>;
    }

    if(showUserForm){
        return (
            <User
                project={project}
                onMemberAdded={handleMemberAdded}
                onCancel={handleUserFormCancel}
            />
        );
    }

    if (showVueKanban){
        return <Kanban project={project} />
    }
    if (showProjectNetwork){
        return <ProjectNetworkMap project={project} />
    }

    return (
        <div className="project-detail">
            <div className="project-header">
                <div className="project-icon" style={{backgroundColor: project.color}}>{project.icon}</div>
                <div>
                    <h1 className="project-title">{project.name}</h1>
                    <span className={`project-status ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                    </span>
                    <button
                        onClick={handleProjectPulse}
                        className="edit-btn"
                    >
                        Project pulse
                    </button>
                </div>
            </div>
            <p className="project-description">{project.description}</p>

            <div className="project-info">
                <div>
                    <FaCalendar/> Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                </div>
                <div><FaClock/> End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                </div>
                <div><FaUsers/> Team: {teamMembers.length}</div>
            </div>

            <button onClick={handleVueKanban}><FaEye/> Vue Kanban</button>

            <button onClick={handleProjectNetwork}><FaEye/> Vue Network</button>

            <div className="project-tasks">
                <div className="tasks-header">
                    <h3><FaTasks/> Project Tasks ({tasks.length})</h3>
                    <button onClick={handleAddTask}><FaPlus/> Add Task</button>
                </div>
                <table className="tasks-table">
                    <thead>
                    <tr>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Type</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>
                                <div className="task-title">{task.title}</div>
                                <div className="task-desc">{task.description}</div>
                            </td>
                            <td><span
                                className={`task-badge ${getStatusColor(task.status)}`}>{getStatusLabel(task.status)}</span>
                            </td>
                            <td><span className={`task-badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                            </td>
                            <td><span className={`task-badge ${getTypeColor(task.type)}`}>{task.type}</span></td>
                            <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</td>
                            <td className="task-actions">
                                <button onClick={() => handleViewTask(task)}><FaEye/></button>
                                <button onClick={() => handleEditTask(task)}><FaEdit/></button>
                                <button onClick={() => handleDeleteTask(task.id)}><FaTrash/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="project-team">
                <div className="team-header">
                    <h3><FaUsers/> Team Members ({teamMembers.length})</h3>
                    <button onClick={handleAddMember}><FaPlus/> Add Member</button>
                </div>
                <div className="team-grid">
                    {teamMembers.map(member => (
                        <div key={member.id} className="team-member">
                            <div className="member-avatar"><FaUser/></div>
                            <div className="member-info">
                                <h4>{member.name}</h4>
                                <p>{member.email}</p>
                                <p className="member-role">{member.role}</p>
                            </div>
                            <button className="edit-member"><FaEdit/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;