import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit } from 'react-icons/fa';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import ProjectDetail from './ProjectDetail';
import './ProjectsPage.css';

const ProjectsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'detail'>('list');
    const [selectedProject, setSelectedProject] = useState<any>(null);

    useEffect(() => {
        if (id) {
            if (window.location.pathname.includes('/edit')) {
                setView('edit');
                // TODO: Fetch project data for editing
            } else {
                setView('detail');
                // TODO: Fetch project data for viewing
            }
        } else if (window.location.pathname.includes('/create')) {
            setView('create');
        } else {
            setView('list');
        }
    }, [id]);

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

    const renderContent = () => {
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
                        />
                    </div>
                );
            case 'detail':
                return (
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
                );
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

