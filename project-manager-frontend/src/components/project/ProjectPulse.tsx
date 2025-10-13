// ProjectPulse.tsx
import React, { useState, useEffect, FC } from 'react';
import { apiService } from '../../services/api';
import './ProjectPulse.css';
import { Lightbulb, FlaskConical, CheckCircle, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';

// Define the expected structure of the Project Pulse analysis
interface ProjectPulseData {
    sentiment: string;
    summary: string;
    actions: string[];
}

// Ensure the Project interface is correctly defined to match the data structure
interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    startDate?: string;
    endDate?: string;
    color?: string;
    icon?: string;
    memberIds?: string[];
    // Add these properties to match the API data
    members?: { name: string }[];
    comments?: { text: string; author: string }[];
}

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

interface ProjectPulseProps {
    project: Project;
}

// Function to get sentiment color based on sentiment value
const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
        case 'stressed':
            return '#ef4444'; // red
        case 'stagnant':
            return '#f97316'; // orange
        case 'positive':
            return '#22c55e'; // green
        case 'stable':
            return '#3b82f6'; // blue
        default:
            return '#9ca3af'; // gray
    }
};

// Function to get sentiment icon based on sentiment value
const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
        case 'positive':
        case 'stable':
            return <CheckCircle className="h-6 w-6 text-green-500" />;
        case 'stressed':
            return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
        case 'stagnant':
            return <FlaskConical className="h-6 w-6 text-gray-500" />;
        default:
            return <Lightbulb className="h-6 w-6 text-blue-500" />;
    }
};

const ProjectPulse: FC<ProjectPulseProps> = ({ project }) => {
    const [pulseData, setPulseData] = useState<ProjectPulseData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!project || !project.id) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Fetch tasks and other data
                const tasks = await apiService.getTasksByProjectId(project.id);

                // Now that tasks are fetched, we can safely build the data payload.
                // Use a default empty array for members and comments to prevent errors.
                const projectDataForAnalysis = {
                    name: project.name,
                    description: project.description,
                    status: project.status,
                    members: project.members || [],
                    tasks: tasks,
                    comments: project.comments || [],
                };

                const pulse = await apiService.getProjectPulse(projectDataForAnalysis);
                setPulseData(pulse);
            } catch (err) {
                console.error("Error fetching project pulse data:", err);
                setError('Failed to fetch Project Pulse. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [project]); // Dependency array should watch for changes in the entire 'project' object.

    if (isLoading) {
        return (
            <div className="project-pulse-container loading-state">
                <div className="loading-content">
                    <RefreshCw className="loading-icon" />
                    <span>Analyzing project...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-pulse-container error-state">
                <XCircle className="error-icon" />
                <p className="error-text">{error}</p>
            </div>
        );
    }

    if (!pulseData) {
        return (
            <div className="project-pulse-container no-data-state">
                <div className="no-data-header">
                    <Lightbulb className="no-data-icon" />
                    <h3 className="no-data-title">Project Pulse</h3>
                </div>
                <p className="no-data-subtitle">
                    No analysis available yet.
                </p>
            </div>
        );
    }

    return (
        <div className="project-pulse-container">
            <h2 className="project-pulse-header">Project Pulse</h2>
            <div className="sentiment-section">
                <span className="sentiment-label">Current Sentiment</span>
                <h3 className="sentiment-value" style={{ color: getSentimentColor(pulseData.sentiment) }}>
                    {pulseData.sentiment}
                </h3>
            </div>
            <p className="summary-text">
                "{pulseData.summary}"
            </p>
            <div className="insights-box">
                <h4 className="insights-header">Actionable Insights</h4>
                <ul className="insights-list">
                    {pulseData.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProjectPulse;
