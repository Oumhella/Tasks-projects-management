import React, { useState, useEffect } from 'react';
import { FaComments, FaPaperclip, FaUser, FaCalendar, FaClock, FaProjectDiagram, FaFlag, FaTag } from 'react-icons/fa';

interface TaskDetailProps {
    task: any;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
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

    useEffect(() => {
        // TODO: Replace with actual API calls when backend is connected
        // For now, using mock data
        const mockComments: Comment[] = [
            {
                id: '1',
                content: 'This task is progressing well. I should have it completed by the end of the week.',
                createdAt: '2024-01-15T10:30:00Z',
                user: { id: '1', name: 'John Doe' }
            },
            {
                id: '2',
                content: 'Great work! Let me know if you need any clarification.',
                createdAt: '2024-01-15T14:20:00Z',
                user: { id: '2', name: 'Jane Smith' }
            }
        ];

        const mockAttachments: Attachment[] = [
            {
                id: '1',
                fileName: 'design-mockup.pdf',
                fileSize: 2048576,
                uploadedAt: '2024-01-15T09:15:00Z',
                uploadedBy: { id: '1', name: 'John Doe' }
            },
            {
                id: '2',
                fileName: 'requirements.docx',
                fileSize: 512000,
                uploadedAt: '2024-01-14T16:30:00Z',
                uploadedBy: { id: '2', name: 'Jane Smith' }
            }
        ];

        setComments(mockComments);
        setAttachments(mockAttachments);
        setLoading(false);
    }, []);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            // TODO: Replace with actual API call when backend is connected
            const comment: Comment = {
                id: Date.now().toString(),
                content: newComment,
                createdAt: new Date().toISOString(),
                user: { id: '1', name: 'Current User' } // TODO: Get from auth context
            };

            setComments(prev => [comment, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        try {
            // TODO: Replace with actual API call when backend is connected
            for (const file of Array.from(files)) {
                const attachment: Attachment = {
                    id: Date.now().toString(),
                    fileName: file.name,
                    fileSize: file.size,
                    uploadedAt: new Date().toISOString(),
                    uploadedBy: { id: '1', name: 'Current User' } // TODO: Get from auth context
                };

                setAttachments(prev => [attachment, ...prev]);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                        <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{comment.user.name}</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </span>
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
                                        {formatFileSize(attachment.fileSize)} • Uploaded by {attachment.uploadedBy.name}
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                    Download
                                </button>
                                <button className="text-red-600 hover:text-red-800 text-sm">
                                    Delete
                                </button>
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