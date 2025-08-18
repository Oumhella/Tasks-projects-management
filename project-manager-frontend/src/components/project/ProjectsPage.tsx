import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit } from 'react-icons/fa';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import ProjectDetail from './ProjectDetail';
import './ProjectsPage.css';
import apiService from "../../services/api";
import TaskForm from "../task/TaskForm";

const ProjectsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'detail' >('list');
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (id) {
                setLoading(true);
                try {
                    const projectData = await apiService.getProject(id);
                    setSelectedProject(projectData);
                    if (window.location.pathname.includes('/edit')) {
                        setView('edit');
                    } else {
                        setView('detail');
                    }
                } catch (error) {
                    console.error("Failed to fetch project details:", error);
                    navigate('/projects');
                } finally {
                    setLoading(false);
                }
            } else if (window.location.pathname.includes('/create')) {
                setView('create');
            } else {
                setView('list');
            }
        };

        fetchProjectDetails();
    }, [id, navigate]);


    const handleCreateProject = () => {
        navigate('/projects/create');
        setView('create');
    };

    const handleEditProject = (project: any) => {
        setSelectedProject(project);
        navigate(`/projects/${project.id}/edit`);
        setView('edit');
    };

    const handleViewProject = (project: any) => {
        setSelectedProject(project);
        navigate(`/projects/${project.id}`);
        setView('detail');
    };



    const handleBackToList = () => {
        navigate('/projects');
        setView('list');
        setSelectedProject(null);
    };

    // const onAddTask = (project: any) =>{
    //     setSelectedProject(project);
    //     navigate(`tasks/projects/${selectedProject.id}`);
    //     setView('editTasks');
    // }

    const renderContent = () => {
        if (loading) {
            return <div className="p-6 text-center text-gray-500">Loading project details...</div>;
        }
        switch (view) {
            case 'create':
                return (
                    <div className="projects-page-container">
                        <div className="page-header">
                            <h1 className="page-title">Create New Project</h1>
                            <button
                                onClick={handleBackToList}
                                className="back-btn"
                            >
                                Back to Projects
                            </button>
                        </div>
                        <ProjectForm onSave={handleBackToList} onCancel={handleBackToList} />
                    </div>
                );
            case 'edit':
                return (
                    <div className="projects-page-container">
                        <div className="page-header">
                            <h1 className="page-title">Edit Project</h1>
                            <button
                                onClick={handleBackToList}
                                className="back-btn"
                            >
                                Back to Projects
                            </button>
                        </div>
                        <ProjectForm 
                            project={selectedProject} 
                            onSave={handleBackToList} 
                            onCancel={handleBackToList}
                            isEdit={true}
                        />
                    </div>
                );
            case 'detail':
                return selectedProject ? (
                    <div className="projects-page-container">
                        <div className="page-header">
                            <h1 className="page-title">Project Details</h1>
                            <div className="action-buttons">
                                <button
                                    onClick={() => handleEditProject(selectedProject)}
                                    className="edit-btn"
                                >
                                    <FaEdit />
                                    Edit
                                </button>
                                <button
                                    onClick={handleBackToList}
                                    className="back-btn"
                                >
                                    Back to Projects
                                </button>
                            </div>
                        </div>
                        <ProjectDetail project={selectedProject} />
                    </div>
                ): (
                    <div className="p-6 text-center text-gray-500">Project not found.</div>
                );
            // case "editTasks":
            //     return
            default:
                return (
                    <div className="projects-page-container">
                        <div className="projects-header">
                            <h1 className="projects-title">Projects</h1>
                            <button
                                onClick={handleCreateProject}
                                className="create-project-btn"
                            >
                                <FaPlus />
                                Create Project
                            </button>
                        </div>
                        <ProjectList onEdit={handleEditProject} onView={handleViewProject} />
                    </div>
                );
        }
    };

    return renderContent();
};

export default ProjectsPage;

