import * as React from "react";
import { useEffect, useState } from "react";
import {
    KanbanComponent,
    ColumnsDirective,
    ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import apiService from "../../services/api";
import TaskForm from "./TaskForm";
import "@syncfusion/ej2-react-kanban/styles/material.css";
import "./Kanban.css";

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

interface KanbanProps {
    project: any;
}

interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'project-manager' | 'developer' | 'observator';

}

const Kanban: React.FC<KanbanProps> = ({ project }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [user, setUser] = useState<User>();
    const [users, setUsers] = useState<User[]>([]);



    const getUserNames = async () =>{
        setError('');
        try {
            const response= tasks.map((task) => (
             apiService.getUser(task.assignedToUserId))
        );
            const users = await Promise.all(response);
            setUsers(users);
        }catch (error){
            console.error("error fetching users", error);
            setError("error fetching users");
        }
    }
    useEffect(() => {
        getUserNames();
    }, []);

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

    const fetchTasks = async () => {
        try {
            const tasks = await apiService.getTasksByProjectId(project.id);

            const users = await Promise.all(
                tasks.map(task => apiService.getUser(task.assignedToUserId))
            );

            const tasksWithNames = tasks.map((task, i) => ({
                ...task,
                assignedToUserName: `${users[i].firstName} ${users[i].lastName}`,
            }))

        setUsers(users);
        setTasks(tasksWithNames);

        } catch (err) {
            console.error("Error fetching tasks", err);
            setError("Error fetching tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setError("");
        fetchTasks();
    }, [project]);

    const handleDeleteTask = async (taskId: string) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            await apiService.deleteTask(taskId);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            setShowModal(false);
        } catch (err) {
            console.error("Error deleting task", err);
            alert("Failed to delete task.");
        }
    };
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

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
            </div>
        );
    }

    const CardTemplate = (props: Task) => {
        return (
            <div className="custom-card-template">
                <div className={`e-card-tags ${props.priority}`}>
                    {props.priority}
                </div>
                <h3>{props.title}</h3>
                <p>{props.description}</p>
                {hasDeleteAuthority() && (
                <button
                    className="delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(props.id);
                    }}
                >
                    Delete
                </button>
                    )}
            </div>
        );
    };

    return (
        <div className="kanban-container">
            {hasCreateAuthority() && (
            <button
                className="add-task-btn"
                onClick={() => {
                    setEditingTask(null);
                    setShowModal(true);
                }}
            >
                + Add Task
            </button>
                )}

            <KanbanComponent
                id="kanban"
                className="e-kanban"
                keyField="status"
                dataSource={tasks}
                allowDragAndDrop={true}
                allowKeyboard={true}
                enableTooltip={true}

                swimlaneSettings={{ keyField: "assignedToUserId",
                                    textField: "assignedToUserName",
                }}
                cardSettings={{
                    headerField: "title",
                    contentField: "description",
                    tagsField: "priority",
                    grabberField: "type",
                    template: CardTemplate,
                }}
                cardRendered={(args) => {
                    if (args.data.dueDate) {
                        const dueDate = new Date(args.data.dueDate + 'T00:00:00');
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (dueDate < today) {
                            args.element.classList.add('overdue-card');
                        }
                    }
                }}
                cardClick={(args: any) => {
                    setEditingTask(args.data as Task);
                    setShowModal(true);
                }}
                dragStop={async (args: any) => {
                    const draggedTask = args.data[0];
                    try {
                        await apiService.updateTask(draggedTask.id, { ...draggedTask });
                        setTasks(prev =>
                            prev.map(task =>
                                task.id === draggedTask.id ? { ...task, status: draggedTask.status } : task
                            )
                        );
                    } catch (err) {
                        console.error("Error updating task", err);
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective headerText="To Do" keyField="TODO" />
                    <ColumnDirective headerText="In Progress" keyField="IN_PROGRESS" />
                    <ColumnDirective headerText="Testing" keyField="TESTING" />
                    <ColumnDirective headerText="Done" keyField="DONE" />
                </ColumnsDirective>
            </KanbanComponent>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <TaskForm
                            task={editingTask ?? undefined}
                            projectId={project.id}
                            readOnlyProject={true}
                            onSave={async () => {
                                await fetchTasks();
                                setShowModal(false);
                            }}
                            onCancel={() => setShowModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Kanban;