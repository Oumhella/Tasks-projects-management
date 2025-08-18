import React, { useState, useEffect } from 'react';
import { FaComments, FaPaperclip, FaUser, FaCalendar, FaClock, FaProjectDiagram, FaFlag, FaTag } from 'react-icons/fa';
import apiService from "../../services/api";
import api from "../../services/api";
import {redirect} from "react-router-dom";

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
    const [attachment, setAttachment] = useState<Attachment | null>(null);
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
                setError("error fetching data");
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
                user: {id: "1", name: "taskusername"}
            };
            const createdComment = await apiService.createComment(comment);
            setComments(prev => [createdComment, ...prev]);

            setNewComment('');


        } catch (error) {
            console.error('Error adding comment:', error);
            setError("error adding comment");
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
            setError("error uploading file");
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

    // const handleFileDownload = async() =>{
    //
    //
    // }

    const getDownloadUrl= async (id: string) => {
        try {
            setLoading(true);
            const url = await apiService.getAttachmentDownloadUrl(id);
            if (url) {
                window.location.href = url; // forces download
                // OR: window.open(url, "_blank");
            } else {
                setError("No download URL received");
            }
        }catch (error){
            console.error("error downloading attachments", error);
            setError("Error downloading attachment");
        }finally {
            setLoading(false);
        }

    }

    const hanleDeleteAttachment = async(id: string) => {
        if(window.confirm("are you sure you want delete this attachment ?")) {
            try {
                await apiService.deleteAttachment(id);
                setAttachments(prev => prev.filter(attachment => attachment.id === id));
            } catch (error) {
                console.error("Error deleting attachment", error);
                setError("Error deleting attachment");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Task not found.</p>
            </div>
        );
    }

    return (
        <div>
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                onClick={() => setError('')}
                                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-400 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                            >
                                <span className="sr-only">Dismiss</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="space-y-6">
            {/* Task Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                    </div>
                    <div className="flex space-x-2">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                            <FaFlag className="mr-1" />
                            {task.priority}
                        </span>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(task.type)}`}>
                            <FaTag className="mr-1" />
                            {task.type}
                        </span>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <FaProjectDiagram className="mr-2" />
                        <span>Project: {task.projectId}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <FaUser className="mr-2" />
                        <span>Assigned: {task.assignedToUserId || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="mr-2" />
                        <span>Est. Hours: {task.estimatedHours}h</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <FaCalendar className="mr-2" />
                        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FaComments className="mr-2" />
                        Comments ({comments.length})
                    </h3>
                </div>

                {/* Add Comment */}
                <div className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            Add Comment
                        </button>
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.content} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{"dddddd"}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Attachments Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FaPaperclip className="mr-2" />
                        Attachments ({attachments.length})
                    </h3>
                    <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        Upload Files
                    </label>
                </div>

                <div className="space-y-3">
                    {attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                            <div className="flex items-center">
                                <FaPaperclip className="text-gray-400 mr-3" />
                                <div>
                                    <div className="font-medium text-gray-900">{attachment.fileName}</div>
                                    <div className="text-sm text-gray-500">
                                        {formatFileSize(attachment.fileSize)} • Uploaded by {"attachment.uploadedBy.name"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => getDownloadUrl(attachment.id)} className="text-blue-600
                                    hover:text-blue-800 text-sm">
                                    Download
                                </button>
                                <button onClick={()=> {hanleDeleteAttachment(attachment.id)}} className="text-red-600 hover:text-red-800 text-sm">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    );
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'CRITICAL': return 'bg-red-100 text-red-800';
        case 'HIGH': return 'bg-orange-100 text-orange-800';
        case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
        case 'LOW': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case 'BUG': return 'bg-red-100 text-red-800';
        case 'FEATURE': return 'bg-blue-100 text-blue-800';
        case 'TASK': return 'bg-green-100 text-green-800';
        case 'STORY': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'TODO': return 'bg-gray-100 text-gray-800';
        case 'IN_PR0GRESS': return 'bg-blue-100 text-blue-800';
        case 'IN_REVIEW': return 'bg-purple-100 text-purple-800';
        case 'TESTING': return 'bg-yellow-100 text-yellow-800';
        case 'DONE': return 'bg-green-100 text-green-800';
        case 'CLOSED': return 'bg-gray-100 text-gray-600';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default TaskDetail; 