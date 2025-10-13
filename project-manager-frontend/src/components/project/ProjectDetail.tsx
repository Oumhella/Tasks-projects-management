// ProjectDetail.tsx - Updated handleAddMember logic
import React, { useState, useEffect } from 'react';
import {FaCalendar, FaClock, FaUsers, FaTasks, FaPlus, FaEdit, FaTrash, FaUser, FaEye, FaTimes} from 'react-icons/fa';
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
import Calendar from "../task/Calendar";

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
interface Uuser {
    id: string;
    username: string;
    role: 'admin' | 'project-manager' | 'developer' | 'observator';

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
    const [showUserForm, setShowUserForm] = useState(false);
    const [user, setUser] = useState<Uuser>();

    const [activeView, setActiveView] = useState<'default' | 'calendar' | 'kanban' | 'network' | 'pulse'>('default');

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

    const handleCloseView = () => {
        setActiveView('default');
    }

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

    if (loading) return <div className="loading">Loading tasks and team members...</div>;

    if (error) return <div className="error">{error}</div>;

    if (showTaskForm)
        return <TaskForm projectId={project.id} readOnlyProject onSave={handleTaskSaved} onCancel={handleTaskFormCancel} />;

    if(showTaskEdit)
        return <TaskForm task={task} projectId={project.id} readOnlyProject onSave={handleTaskEdited} onCancel={handleTaskEditCancel} />;

    if(showTaskView)
        return <TaskDetail task={task} />

    if(showUserForm){
        return (
            <User
                project={project}
                onMemberAdded={handleMemberAdded}
                onCancel={handleUserFormCancel}
            />
        );
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

            {/* View Selector */}
            <div className={`view-selector ${activeView !== 'default' ? 'compact' : ''}`}>
                <button
                    className={`view-option ${activeView === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveView('calendar')}
                >
                    <FaCalendar />
                    <span>Calendar View</span>
                </button>

                <button
                    className={`view-option ${activeView === 'kanban' ? 'active' : ''}`}
                    onClick={() => setActiveView('kanban')}
                >
                    <FaTasks />
                    <span>Kanban View</span>
                </button>

                <button
                    className={`view-option ${activeView === 'network' ? 'active' : ''}`}
                    onClick={() => setActiveView('network')}
                >
                    <FaUsers />
                    <span>Network View</span>
                </button>

                <button
                    className={`view-option ${activeView === 'pulse' ? 'active' : ''}`}
                    onClick={() => setActiveView('pulse')}
                >
                    <FaEye />
                    <span>Project Pulse</span>
                </button>
            </div>

            {/* View Container */}
            {activeView !== 'default' && (
                <div className="view-container">
                    <div className="view-header">
                        <h3>
                            {activeView === 'calendar' && <><FaCalendar /> Calendar View</>}
                            {activeView === 'kanban' && <><FaTasks /> Kanban View</>}
                            {activeView === 'network' && <><FaUsers /> Network View</>}
                            {activeView === 'pulse' && <><FaEye /> Project Pulse</>}
                        </h3>
                        <button className="close-view" onClick={handleCloseView}>
                            <FaTimes />
                        </button>
                    </div>
                    <div className="view-content">
                        {activeView === 'calendar' && <Calendar project={project} />}
                        {activeView === 'kanban' && <Kanban project={project} />}
                        {activeView === 'network' && <ProjectNetworkMap project={project} />}
                        {activeView === 'pulse' && <ProjectPulse project={project} />}
                    </div>
                </div>
            )}

            {/* Default Project Content (shown when no special view is selected) */}
            {activeView === 'default' && (
                <>
                    <div className="project-tasks">
                        <div className="tasks-header">
                            <h3><FaTasks/> Project Tasks ({tasks.length})</h3>
                            {hasCreateAuthority() && (
                            <button onClick={handleAddTask}><FaPlus/> Add Task </button>
                                )}
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
                                        {hasUpdateAuthority() && (
                                        <button onClick={() => handleEditTask(task)}><FaEdit/></button>
                                        )}
                                        {hasDeleteAuthority() && (
                                        <button onClick={() => handleDeleteTask(task.id)}><FaTrash/></button>
                                            )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="project-team">
                        <div className="team-header">
                            <h3><FaUsers/> Team Members ({teamMembers.length})</h3>
                            {hasCreateAuthority() && (
                            <button onClick={handleAddMember}><FaPlus/> Add Member</button>
                                )}
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
                </>
            )}
        </div>
    );
};

export default ProjectDetail;
// ProjectDetail.tsx - Updated with new design system classes
// import React, { useState, useEffect } from 'react';
// import {FaCalendar, FaClock, FaUsers, FaTasks, FaPlus, FaEdit, FaTrash, FaUser, FaEye, FaTimes} from 'react-icons/fa';
// import apiService from "../../services/api";
// import {useNavigate} from "react-router-dom";
// import TaskForm from "../task/TaskForm";
// import TaskDetail from "../task/TaskDetail";
// import TaskList from "../task/TaskList";
// import ProjectPulse from "./ProjectPulse";
// import User from "../users/User";
// import Kanban from "../task/Kanban";
// import ProjectNetworkMap from "./ProjectNetworkMap";
// import Calendar from "../task/Calendar";
// import '../../all.css';
//
// // ... keep all your interfaces the same ...
// interface Project {
//     id: string;
//     name: string;
//     description: string;
//     status: string;
//     startDate: string;
//     endDate: string;
//     color: string;
//     icon: string;
//     memberIds: string[];
// }
//
// interface Task {
//     id: string;
//     title: string;
//     description: string;
//     status: string;
//     priority: string;
//     type: string;
//     estimatedHours: number;
//     dueDate: string;
//     assignedToUserId: string;
// }
//
// interface TeamMember {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
// }
//
// interface ProjectDetailProps {
//     project: Project;
// }
//
// const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
//     const [tasks, setTasks] = useState<Task[]>([]);
//     const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string>('');
//     const navigate = useNavigate();
//     const [showTaskForm, setShowTaskForm] = useState(false);
//     const [showTaskView, setShowTaskView] = useState(false);
//     const [task, setTask] = useState<Task>();
//     const [showTaskEdit, setShowTaskEdit] = useState(false);
//     const [showUserForm, setShowUserForm] = useState(false);
//
//     // State for active view
//     const [activeView, setActiveView] = useState<'default' | 'calendar' | 'kanban' | 'network' | 'pulse'>('default');
//
//     useEffect(() => {
//         const fetchData = async () => {
//             if (!project?.id) {
//                 setLoading(false);
//                 return;
//             }
//
//             setLoading(true);
//             setError('');
//
//             try {
//                 const fetchedTasks = await apiService.getTasksByProjectId(project.id);
//                 setTasks(fetchedTasks);
//                 const fetchedMembers = await apiService.getProjectMembers(project.id);
//                 setTeamMembers(fetchedMembers);
//             } catch (err) {
//                 console.error('Error fetching project data:', err);
//                 setError('Failed to load project details. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [project]);
//
//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'PLANNING': return 'status-planning';
//             case 'ON_TRACK': return 'status-on-track';
//             case 'ON_HOLD': return 'status-on-hold';
//             case 'COMPLETED': return 'status-completed';
//             case 'ARCHIVED': return 'status-archived';
//             default: return 'status-default';
//         }
//     };
//
//     const getStatusLabel = (status: string) =>
//         status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
//
//     const getPriorityColor = (priority: string) => {
//         switch (priority) {
//             case 'CRITICAL': return 'priority-critical';
//             case 'HIGH': return 'priority-high';
//             case 'MEDIUM': return 'priority-medium';
//             case 'LOW': return 'priority-low';
//             default: return 'priority-default';
//         }
//     };
//
//     const getTypeColor = (type: string) => {
//         switch (type) {
//             case 'BUG': return 'type-bug';
//             case 'FEATURE': return 'type-feature';
//             case 'TASK': return 'type-task';
//             case 'STORY': return 'type-story';
//             default: return 'type-default';
//         }
//     };
//     const handleViewTask = (task: React.SetStateAction<Task | undefined>) => {
//         setShowTaskView(true);
//         setTask(task);
//         return task;
//     }
//
//     const handleDeleteTask = async (id: string) => {
//         if(window.confirm("are you sure you want to delete this task?")) {
//             setLoading(true);
//             try {
//                 await apiService.deleteTask(id);
//                 setTasks(prev => prev.filter(task => task.id !== id));
//             } catch (error) {
//                 console.error("Error deleting task", error);
//                 setError("Failed to delete task");
//             }finally{
//                 setLoading(false);
//             }
//         }
//     }
//
//     const handleAddTask = () => setShowTaskForm(true);
//
//     const handleAddMember = () => setShowUserForm(true);
//
//     const handleMemberAdded = async () => {
//         setShowUserForm(false);
//
//         try {
//             const fetchedMembers = await apiService.getProjectMembers(project.id);
//             setTeamMembers(fetchedMembers);
//
//             console.log('Member added successfully');
//         } catch (err) {
//             console.error('Error refreshing team members:', err);
//         }
//     };
//
//     const handleUserFormCancel = () => setShowUserForm(false);
//
//     const handleTaskSaved = async () => {
//         setShowTaskForm(false);
//         try {
//             const fetchedTasks = await apiService.getTasksByProjectId(project.id);
//             setTasks(fetchedTasks);
//         } catch (err) { console.error(err); }
//     };
//
//     const handleTaskFormCancel = () => setShowTaskForm(false);
//
//     const handleEditTask = (task: React.SetStateAction<Task | undefined>) => {
//         setShowTaskEdit(true);
//         setTask(task);
//     }
//
//     const handleTaskEdited = async () => {
//         setShowTaskEdit(false);
//         try {
//             const fetchedTasks = await apiService.getTasksByProjectId(project.id);
//             setTasks(fetchedTasks);
//         } catch (err) { console.error(err); }
//     };
//
//     const handleTaskEditCancel = () => setShowTaskEdit(false);
//
//     const handleCloseView = () => {
//         setActiveView('default');
//     }
//
//     if (loading) return <div className="loading p-6 text-center text-muted">Loading tasks and team members...</div>;
//
//     if (error) return <div className="alert alert-danger">{error}</div>;
//
//     if (showTaskForm)
//         return <TaskForm projectId={project.id} readOnlyProject onSave={handleTaskSaved} onCancel={handleTaskFormCancel} />;
//
//     if(showTaskEdit)
//         return <TaskForm task={task} projectId={project.id} readOnlyProject onSave={handleTaskEdited} onCancel={handleTaskEditCancel} />;
//
//     if(showTaskView)
//         return <TaskDetail task={task} />
//
//     if(showUserForm){
//         return (
//             <User
//                 project={project}
//                 onMemberAdded={handleMemberAdded}
//                 onCancel={handleUserFormCancel}
//             />
//         );
//     }
//
//     return (
//         <div className="container mx-auto p-6">
//             <div className="project-header flex items-start gap-6 mb-6 pb-4 border-b border-gray-200">
//                 <div className="project-icon w-20 h-20 rounded-xl flex items-center justify-center text-4xl" style={{backgroundColor: project.color}}>
//                     {project.icon}
//                 </div>
//                 <div>
//                     <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
//                     <span className={`status-badge ${getStatusColor(project.status)}`}>
//                         {getStatusLabel(project.status)}
//                     </span>
//                 </div>
//             </div>
//             <p className="text-secondary mb-6">{project.description}</p>
//
//             <div className="project-info flex gap-8 mb-8 flex-wrap">
//                 <div className="flex items-center gap-2 text-secondary">
//                     <FaCalendar/> Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
//                 </div>
//                 <div className="flex items-center gap-2 text-secondary">
//                     <FaClock/> End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
//                 </div>
//                 <div className="flex items-center gap-2 text-secondary">
//                     <FaUsers/> Team: {teamMembers.length}
//                 </div>
//             </div>
//
//             {/* View Selector */}
//             <div className={`view-selector flex bg-gray-100 rounded-xl p-2 mb-8 gap-2 ${activeView !== 'default' ? 'compact' : ''}`}>
//                 <button
//                     className={`view-option flex items-center gap-2 px-5 py-3 border-none rounded-lg bg-transparent text-secondary font-medium cursor-pointer transition-all flex-1 justify-center ${activeView === 'calendar' ? 'bg-primary text-white shadow-md' : ''}`}
//                     onClick={() => setActiveView('calendar')}
//                 >
//                     <FaCalendar />
//                     <span>Calendar View</span>
//                 </button>
//
//                 <button
//                     className={`view-option flex items-center gap-2 px-5 py-3 border-none rounded-lg bg-transparent text-secondary font-medium cursor-pointer transition-all flex-1 justify-center ${activeView === 'kanban' ? 'bg-primary text-white shadow-md' : ''}`}
//                     onClick={() => setActiveView('kanban')}
//                 >
//                     <FaTasks />
//                     <span>Kanban View</span>
//                 </button>
//
//                 <button
//                     className={`view-option flex items-center gap-2 px-5 py-3 border-none rounded-lg bg-transparent text-secondary font-medium cursor-pointer transition-all flex-1 justify-center ${activeView === 'network' ? 'bg-primary text-white shadow-md' : ''}`}
//                     onClick={() => setActiveView('network')}
//                 >
//                     <FaUsers />
//                     <span>Network View</span>
//                 </button>
//
//                 <button
//                     className={`view-option flex items-center gap-2 px-5 py-3 border-none rounded-lg bg-transparent text-secondary font-medium cursor-pointer transition-all flex-1 justify-center ${activeView === 'pulse' ? 'bg-primary text-white shadow-md' : ''}`}
//                     onClick={() => setActiveView('pulse')}
//                 >
//                     <FaEye />
//                     <span>Project Pulse</span>
//                 </button>
//             </div>
//
//             {/* View Container */}
//             {activeView !== 'default' && (
//                 <div className="view-container border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-8 min-h-96">
//                     <div className="view-header flex justify-between items-center px-6 py-4 bg-gray-100 border-b border-gray-200">
//                         <h3 className="flex items-center gap-2 text-gray-800 m-0">
//                             {activeView === 'calendar' && <><FaCalendar /> Calendar View</>}
//                             {activeView === 'kanban' && <><FaTasks /> Kanban View</>}
//                             {activeView === 'network' && <><FaUsers /> Network View</>}
//                             {activeView === 'pulse' && <><FaEye /> Project Pulse</>}
//                         </h3>
//                         <button className="close-view flex items-center justify-center w-8 h-8 border-none rounded bg-gray-200 text-gray-600 cursor-pointer transition-all" onClick={handleCloseView}>
//                             <FaTimes />
//                         </button>
//                     </div>
//                     <div className="view-content p-6 bg-white">
//                         {activeView === 'calendar' && <Calendar project={project} />}
//                         {activeView === 'kanban' && <Kanban project={project} />}
//                         {activeView === 'network' && <ProjectNetworkMap project={project} />}
//                         {activeView === 'pulse' && <ProjectPulse project={project} />}
//                     </div>
//                 </div>
//             )}
//
//             {/* Default Project Content (shown when no special view is selected) */}
//             {activeView === 'default' && (
//                 <>
//                     <div className="project-tasks mb-10">
//                         <div className="tasks-header flex justify-between items-center mb-6">
//                             <h3 className="flex items-center gap-2 text-2xl text-gray-800 m-0"><FaTasks/> Project Tasks ({tasks.length})</h3>
//                             <button className="btn btn-primary flex items-center gap-2" onClick={handleAddTask}><FaPlus/> Add Task</button>
//                         </div>
//                         <div className="table-responsive">
//                             <table className="table w-full mb-6 text-gray-800 bg-white border-collapse shadow-sm rounded-xl overflow-hidden">
//                                 <thead>
//                                 <tr>
//                                     <th className="bg-gray-100 px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wide border-b border-gray-300">Task</th>
//                                     <th className="bg-gray-100 px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wide border-b border-gray-300">Status</th>
//                                     <th className="bg-gray-100 px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wide border-b border-gray-300">Priority</th>
//                                     <th className="bg-gray-100 px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wide border-b border-gray-300">Type</th>
//                                     <th className="bg-gray-100 px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wide border-b border-gray-300">Due Date</th>
//                                     <th className="bg-gray-100 px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wide border-b border-gray-300">Actions</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {tasks.map(task => (
//                                     <tr key={task.id} className="transition-colors hover:bg-gray-50">
//                                         <td className="px-4 py-4 border-b border-gray-200">
//                                             <div className="font-semibold text-gray-800 mb-1">{task.title}</div>
//                                             <div className="text-gray-600 text-sm line-clamp-2">{task.description}</div>
//                                         </td>
//                                         <td className="px-4 py-4 border-b border-gray-200">
//                                             <span className={`status-badge ${getStatusColor(task.status)}`}>
//                                                 {getStatusLabel(task.status)}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-4 border-b border-gray-200">
//                                             <span className={`badge ${getPriorityColor(task.priority)}`}>
//                                                 {task.priority}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-4 border-b border-gray-200">
//                                             <span className={`badge ${getTypeColor(task.type)}`}>
//                                                 {task.type}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-4 border-b border-gray-200">
//                                             {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
//                                         </td>
//                                         <td className="px-4 py-4 border-b border-gray-200">
//                                             <div className="task-actions flex gap-2">
//                                                 <button className="btn btn-ghost p-2" onClick={() => handleViewTask(task)}><FaEye/></button>
//                                                 <button className="btn btn-ghost p-2" onClick={() => handleEditTask(task)}><FaEdit/></button>
//                                                 <button className="btn btn-ghost p-2 text-danger" onClick={() => handleDeleteTask(task.id)}><FaTrash/></button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//
//                     <div className="project-team">
//                         <div className="team-header flex justify-between items-center mb-6">
//                             <h3 className="flex items-center gap-2 text-2xl text-gray-800 m-0"><FaUsers/> Team Members ({teamMembers.length})</h3>
//                             <button className="btn btn-primary flex items-center gap-2" onClick={handleAddMember}><FaPlus/> Add Member</button>
//                         </div>
//                         <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {teamMembers.map(member => (
//                                 <div key={member.id} className="team-member card flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
//                                     <div className="member-avatar w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-white text-xl">
//                                         <FaUser/>
//                                     </div>
//                                     <div className="member-info flex-1">
//                                         <h4 className="text-gray-800 mb-1">{member.name}</h4>
//                                         <p className="text-gray-600 text-sm mb-1">{member.email}</p>
//                                         <p className="member-role text-gray-500 text-xs font-medium">{member.role}</p>
//                                     </div>
//                                     <button className="edit-member btn btn-ghost p-2"><FaEdit/></button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };
//
// export default ProjectDetail;