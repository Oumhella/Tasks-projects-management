import React, { useState, useEffect } from 'react';
import {
    FaComments,
    FaPaperclip,
    FaUser,
    FaCalendar,
    FaClock,
    FaProjectDiagram,
    FaFlag,
    FaTag
} from 'react-icons/fa';
import apiService from "../../services/api";

import './TaskDetail.css';

interface TaskDetailProps {
    task: any;
}

interface Comment {
    id: string;
    content: string;
    taskId: string;
    user: {
        id: string;
        name: string;
    };
}

interface Attachment {
    id: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    uploadedBy: {
        id: string;
        name: string;
    };
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [projectName, setProjectName] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            if (!task || !task.id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError('');

            try {
                const comments = await apiService.getCommentsByTask(task.id);
                setComments(comments);
                const attachments = await apiService.getAttachmentsByTask(task.id);
                setAttachments(attachments);
            } catch (err) {
                console.log("error fetching comments and attachments", err);
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [task]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const comment = {
                content: newComment.trim(),
                taskId: task.id,
                user: { id: "1", name: "taskusername" }
            };
            const createdComment = await apiService.createComment(comment);
            setComments(prev => [createdComment, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            setError("Error adding comment");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setLoading(true);
        setError('');
        try {
            for (const file of Array.from(files)) {
                const createdAttachment = await apiService.uploadAttachment(file, task.id);
                setAttachments(prev => [createdAttachment, ...prev]);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setError("Error uploading file");
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
            event.target.value = '';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getDownloadUrl = async (id: string) => {
        try {
            setLoading(true);
            const url = await apiService.getAttachmentDownloadUrl(id);
            if (url) {
                window.location.href = url;
            } else {
                setError("No download URL received");
            }
        } catch (error) {
            console.error("error downloading attachments", error);
            setError("Error downloading attachment");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAttachment = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this attachment?")) {
            try {
                await apiService.deleteAttachment(id);
                setAttachments(prev => prev.filter(att => att.id !== id));
            } catch (error) {
                console.error("Error deleting attachment", error);
                setError("Error deleting attachment");
            }
        }
    };

    useEffect(() => {
        const fetchProjectName = async () => {
            if (task?.projectId) {
                try {
                    const proj = await apiService.getProject(task.projectId);
                    setProjectName(proj.name || "Unknown Project");
                } catch (error) {
                    console.error("Error fetching project", error);
                    setError("Error fetching project name");
                }
            }
        };
        fetchProjectName();
    }, [task]);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="empty-state">
                <p>Task not found.</p>
            </div>
        );
    }

    return (
        <div className="task-detail">
            {error && (
                <div className="alert">
                    <p>{error}</p>
                    <button onClick={() => setError('')}>×</button>
                </div>
            )}


            <div className="card">
                <div className="card-header">
                    <div>
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                    </div>
                    <div className="labels">
            <span className={`badge ${getPriorityColor(task.priority)}`}>
              <FaFlag /> {task.priority}
            </span>
                        <span className={`badge ${getTypeColor(task.type)}`}>
              <FaTag /> {task.type}
            </span>
                        <span className={`badge ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
                    </div>
                </div>

                <div className="info-grid">
                    <div><FaProjectDiagram/> Project: {projectName || "Loading..."}</div>
                    <div><FaUser /> Assigned: {task.assignedToUserId || 'Unassigned'}</div>
                    <div><FaClock /> Est. Hours: {task.estimatedHours}h</div>
                    <div><FaCalendar /> Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</div>
                </div>
            </div>

            <div className="card">
                <h3><FaComments /> Comments ({comments.length})</h3>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                />
                <button onClick={handleAddComment} disabled={!newComment.trim()}>Add Comment</button>
                <div className="comments">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <strong>{"comment.user.name"}</strong>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h3><FaPaperclip /> Attachments ({attachments.length})</h3>
                <label className="upload-btn">
                    <input type="file" multiple onChange={handleFileUpload} />
                    Upload Files
                </label>
                <div className="attachments">
                    {attachments.map((attachment) => (
                        <div key={attachment.id} className="attachment">
                            <div>
                                <FaPaperclip />
                                <div>
                                    <span>{attachment.fileName}</span>
                                    <small>{formatFileSize(attachment.fileSize)} • Uploaded by {"attachment.uploadedBy.name"}</small>
                                </div>
                            </div>
                            <div>
                                <button onClick={() => getDownloadUrl(attachment.id)}>Download</button>
                                <button onClick={() => handleDeleteAttachment(attachment.id)} className="delete-btn">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'TODO': return 'status-todo';
        case 'IN_PROGRESS': return 'status-progress';
        case 'IN_REVIEW': return 'status-review';
        case 'TESTING': return 'status-testing';
        case 'DONE': return 'status-done';
        case 'CLOSED': return 'status-closed';
        default: return 'status-default';
    }
};

export default TaskDetail;
