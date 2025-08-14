import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit } from 'react-icons/fa';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskDetail from './TaskDetail';
import './TasksPage.css';

const TasksPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'detail'>('list');
    const [selectedTask, setSelectedTask] = useState<any>(null);

    useEffect(() => {
        if (id) {
            if (window.location.pathname.includes('/edit')) {
                setView('edit');
                // TODO: Fetch task data for editing
            } else {
                setView('detail');
                // TODO: Fetch task data for viewing
            }
        } else if (window.location.pathname.includes('/create')) {
            setView('create');
        } else {
            setView('list');
        }
    }, [id]);

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
                                <button
                                    onClick={() => handleEditTask(selectedTask)}
                                    className="edit-btn"
                                >
                                    <FaEdit />
                                    Edit
                                </button>
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
                            <button
                                onClick={handleCreateTask}
                                className="create-task-btn"
                            >
                                <FaPlus />
                                Create Task
                            </button>
                        </div>
                        <TaskList onEdit={handleEditTask} onView={handleViewTask} />
                    </div>
                );
        }
    };

    return renderContent();
};

export default TasksPage; 