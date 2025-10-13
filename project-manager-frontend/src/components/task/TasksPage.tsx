import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit } from 'react-icons/fa';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskDetail from './TaskDetail';
import './TasksPage.css';
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
        switch (view) {
            case 'create':
                return (
                    <div className="tasks-page-container">
                        <div className="page-header">
                            <h1 className="page-title">Create New Task</h1>
                            <button
                                onClick={handleBackToList}
                                className="back-btn"
                            >
                                Back to Tasks
                            </button>
                        </div>
                        <TaskForm onSave={handleBackToList} onCancel={handleBackToList} />
                    </div>
                );
            case 'edit':
                return (
                    <div className="tasks-page-container">
                        <div className="page-header">
                            <h1 className="page-title">Edit Task</h1>
                            <button
                                onClick={handleBackToList}
                                className="back-btn"
                            >
                                Back to Tasks
                            </button>
                        </div>
                        <TaskForm 
                            task={selectedTask} 
                            onSave={handleBackToList} 
                            onCancel={handleBackToList} 
                        />
                    </div>
                );
            case 'detail':
                return (
                    <div className="tasks-page-container">
                        <div className="page-header">
                            <h1 className="page-title">Task Details</h1>
                            <div className="action-buttons">
                                {hasUpdateAuthority() && (
                                <button
                                    onClick={() => handleEditTask(selectedTask)}
                                    className="edit-btn"
                                >
                                    <FaEdit />
                                    Edit
                                </button>
                                    )}
                                <button
                                    onClick={handleBackToList}
                                    className="back-btn"
                                >
                                    Back to Tasks
                                </button>
                            </div>
                        </div>
                        <TaskDetail task={selectedTask} />
                    </div>
                );
            default:
                return (
                    <div className="tasks-page-container">
                        <div className="tasks-header">
                            <h1 className="tasks-title">Tasks</h1>
                            {hasCreateAuthority() &&(
                                <button
                                onClick={handleCreateTask}
                                className="create-task-btn"
                            >
                                <FaPlus />
                                Create Task
                            </button>
                                )}
                        </div>
                        <TaskList onEdit={handleEditTask} onView={handleViewTask} />
                    </div>
                );
        }
    };

    return (
        <div>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {renderContent()}
        </div>
    );
};

export default TasksPage;