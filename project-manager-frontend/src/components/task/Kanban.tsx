// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import { KanbanComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-kanban";
// import {useEffect, useState} from "react";
// // import { kanbanData } from './datasource';
// import { extend } from '@syncfusion/ej2-base';
// import apiService from "../../services/api";
// import { createRoot } from 'react-dom/client';
//
// import "@syncfusion/ej2-base/styles/material.css";
// import '@syncfusion/ej2-buttons/styles/material.css';
// import "@syncfusion/ej2-layouts/styles/material.css";
// import '@syncfusion/ej2-dropdowns/styles/material.css';
// import '@syncfusion/ej2-inputs/styles/material.css';
// import "@syncfusion/ej2-navigations/styles/material.css";
// import "@syncfusion/ej2-popups/styles/material.css";
// import "@syncfusion/ej2-react-kanban/styles/material.css";
// interface Task {
//     id: string;
//     title: string;
//     description: string;
//     priority: string;
//     type: string;
//     status: string;
//     estimatedHours: number;
//     dueDate: string;
//     projectId: string;
//     assignedToUserId: string;
//     createdAt: string;
// }
// interface kanbanProps{
//     project: any;
// }
//
//
// const Kanban: React.FC<kanbanProps> = ({project})=>{
//
//     const [tasks, setTasks] = useState<Task[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string>('');
//
//     useEffect(() => {
//         setLoading(true);
//         setError('');
//         const tasksdata = async() => {
//             try {
//                 const tasks = await apiService.getTasksByProjectId(project.id);
//                 setTasks(tasks);
//             }catch (error){
//                 console.error("error fetching tasks",error);
//                 setError("error fetching tasks");
//             }finally {
//                 setLoading(false);
//             }
//
//         };
//         tasksdata();
//     }, [project]);
//
//     if (loading) return <p>Loading tasks...</p>;
//     if (error) return <p>{error}</p>;
//     console.log("Tasks for Kanban:", tasks);
//
//     return (
//
//     <KanbanComponent id="kanban" keyField="status" dataSource={tasks} cardSettings={{ contentField: "description", headerField: "id" }}
//                          swimlaneSettings={{ keyField: "assignedToUserId" }} allowDragAndDrop={true}>
//             <ColumnsDirective>
//                 <ColumnDirective headerText="To Do" keyField="Open" />
//                 <ColumnDirective headerText="In Progress" keyField="InProgress" />
//                 <ColumnDirective headerText="Testing" keyField="Testing" />
//                 <ColumnDirective headerText="Done" keyField="Close" />
//             </ColumnsDirective>
//         </KanbanComponent>
//     );
// }
//
// export default Kanban;
import React, { useEffect, useState } from "react";
import Board from "@lourenci/react-kanban";
import "@lourenci/react-kanban/dist/styles.css";
import apiService from "../../services/api";

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

const Kanban: React.FC<KanbanProps> = ({ project }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError("");
            try {
                const tasks = await apiService.getTasksByProjectId(project.id);
                setTasks(tasks);
            } catch (err) {
                console.error("Error fetching tasks", err);
                setError("Error fetching tasks");
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [project]);

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p>{error}</p>;

    console.log(tasks);
    const board = {
        columns: [
            {
                id: "todo",
                title: "To Do",
                cards: tasks
                    .filter((t) => t.status === "TODO")
                    .map((t) => ({
                        id: t.id,
                        title: t.title,
                        description: t.description
                    }))
            },
            {
                id: "inprogress",
                title: "In Progress",
                cards: tasks
                    .filter((t) => t.status === "IN_PROGRESS")
                    .map((t) => ({
                        id: t.id,
                        title: t.title,
                        description: t.description
                    }))
            },
            {
                id: "testing",
                title: "Testing",
                cards: tasks
                    .filter((t) => t.status === "TESTING")
                    .map((t) => ({
                        id: t.id,
                        title: t.title,
                        description: t.description
                    }))
            },
            {
                id: "done",
                title: "Done",
                cards: tasks
                    .filter((t) => t.status === "CLOSED")
                    .map((t) => ({
                        id: t.id,
                        title: t.title,
                        description: t.description
                    }))
            }
        ]
    };

    return (
        <Board
            disableColumnDrag
            initialBoard={board}
            allowAddCard={{ on: "top" }}
            allowRemoveCard
        />
    );
};


export default Kanban;
