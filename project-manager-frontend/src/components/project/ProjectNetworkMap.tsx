import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Clock, Zap, CheckCircle, Eye, X } from 'lucide-react';
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
    dependencies: string[];
    isAtRisk: boolean;
    riskScore: number;
    isCriticalPath: boolean;
    aiInsightSummary: string;
}

// interface Project {
//     id: string;
//     name: string;
//     // Add other project properties as needed
// }

interface Props {
    project: any;
}



const ProjectAnalysisNetwork: React.FC<Props> = ({ project }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [error, setError] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                setError(null);
                const analysisData = await apiService.analyzeProject(project.id);
                setTasks(analysisData);
            } catch (err) {
                setError('Failed to analyze project. Please try again.');
                console.error('Error fetching project analysis:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [project.id]);

    const getRiskColor = (riskScore: number) => {
        if (riskScore >= 70) return '#ef4444'; // red
        if (riskScore >= 40) return '#f97316'; // orange
        return '#22c55e'; // green
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DONE': return '#22c55e';
            case 'IN_PROGRESS': return '#3b82f6';
            case 'TODO': return '#64748b';
            default: return '#64748b';
        }
    };

    const getPriorityIcon = (priority: string) => {
        const iconStyle = { width: '16px', height: '16px' };
        switch (priority) {
            case 'CRITICAL': return <Zap style={{ ...iconStyle, color: '#ef4444' }} />;
            case 'HIGH': return <AlertCircle style={{ ...iconStyle, color: '#f97316' }} />;
            case 'MEDIUM': return <Clock style={{ ...iconStyle, color: '#eab308' }} />;
            default: return <CheckCircle style={{ ...iconStyle, color: '#22c55e' }} />;
        }
    };

    const calculateNodePosition = (index: number, total: number) => {
        const centerX = 400;
        const centerY = 300;
        const radius = Math.min(150, 50 + total * 8);
        const angle = (index * 2 * Math.PI) / total;
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
            padding: '24px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        maxWidth: {
            maxWidth: '1280px',
            margin: '0 auto'
        },
        header: {
            textAlign: 'center' as const,
            marginBottom: '32px'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px'
        },
        subtitle: {
            color: '#c4b5fd',
            fontSize: '1.125rem'
        },
        statsContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
            gap: '32px'
        },
        statItem: {
            textAlign: 'center' as const
        },
        statNumber: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white'
        },
        statLabel: {
            color: '#c4b5fd',
            fontSize: '0.875rem'
        },
        networkContainer: {
            position: 'relative' as const,
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '24px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            overflow: 'hidden'
        },
        svg: {
            width: '100%',
            height: '600px'
        },
        legend: {
            position: 'absolute' as const,
            top: '16px',
            left: '16px',
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(139, 92, 246, 0.2)'
        },
        legendTitle: {
            color: 'white',
            fontWeight: '600',
            marginBottom: '12px'
        },
        legendItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            fontSize: '0.875rem'
        },
        legendColor: {
            width: '16px',
            height: '16px',
            borderRadius: '50%'
        },
        legendText: {
            color: '#d1d5db'
        },
        loadingContainer: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        loadingContent: {
            textAlign: 'center' as const
        },
        spinner: {
            position: 'relative' as const,
            margin: '0 auto 16px'
        },
        spinnerOuter: {
            width: '80px',
            height: '80px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        spinnerInner: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '80px',
            height: '80px',
            border: '4px solid transparent',
            borderRight: '4px solid #ec4899',
            borderRadius: '50%',
            animation: 'spin-reverse 1.5s linear infinite'
        },
        loadingTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '8px'
        },
        loadingText: {
            color: '#c4b5fd'
        },
        errorContainer: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #7f1d1d 50%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        errorContent: {
            textAlign: 'center' as const,
            padding: '32px',
            background: 'rgba(127, 29, 29, 0.2)',
            borderRadius: '16px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
        },
        errorIcon: {
            width: '64px',
            height: '64px',
            color: '#f87171',
            margin: '0 auto 16px'
        },
        errorTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '8px'
        },
        errorText: {
            color: '#fca5a5'
        },
        modal: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
        },
        modalContent: {
            background: '#1e293b',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '672px',
            width: '100%',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            maxHeight: '80vh',
            overflowY: 'auto' as const
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
        },
        modalTitleContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        modalTitle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white'
        },
        closeButton: {
            color: '#9ca3af',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            transition: 'color 0.2s'
        },
        modalGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px'
        },
        modalSection: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '12px'
        },
        modalField: {},
        modalLabel: {
            color: '#c4b5fd',
            fontSize: '0.875rem'
        },
        modalValue: {
            color: 'white',
            marginTop: '4px'
        },
        statusIndicator: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '4px'
        },
        statusDot: {
            width: '12px',
            height: '12px',
            borderRadius: '50%'
        },
        riskBarContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '4px'
        },
        riskBar: {
            width: '100%',
            height: '8px',
            background: '#475569',
            borderRadius: '4px',
            overflow: 'hidden'
        },
        riskFill: {
            height: '100%',
            borderRadius: '4px',
            transition: 'width 0.5s ease'
        },
        riskScore: {
            color: 'white',
            fontWeight: 'bold'
        },
        description: {
            marginBottom: '24px'
        },
        insights: {
            marginBottom: '24px'
        },
        insightsBox: {
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '8px',
            border: '1px solid rgba(139, 92, 246, 0.2)'
        },
        insightsText: {
            color: 'white'
        },
        badges: {
            display: 'flex',
            gap: '16px'
        },
        badge: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.875rem'
        },
        criticalBadge: {
            background: 'rgba(234, 179, 8, 0.2)',
            border: '1px solid rgba(234, 179, 8, 0.3)'
        },
        riskBadge: {
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
        },
        criticalText: {
            color: '#fde047'
        },
        riskText: {
            color: '#fca5a5'
        },
        taskNode: {
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        keyframes: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes spin-reverse {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(-360deg); }
      }
    `
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <style>{styles.keyframes}</style>
                <div style={styles.loadingContent}>
                    <div style={styles.spinner}>
                        <div style={styles.spinnerOuter}></div>
                        <div style={styles.spinnerInner}></div>
                    </div>
                    <h3 style={styles.loadingTitle}>Analyzing Project</h3>
                    <p style={styles.loadingText}>AI is identifying dependencies and risk patterns...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorContent}>
                    <AlertCircle style={styles.errorIcon} />
                    <h3 style={styles.errorTitle}>Analysis Failed</h3>
                    <p style={styles.errorText}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{styles.keyframes}</style>
            <div style={styles.maxWidth}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        Project Analysis Network
                    </h1>
                    <p style={styles.subtitle}>{project.name}</p>
                    <div style={styles.statsContainer}>
                        <div style={styles.statItem}>
                            <div style={styles.statNumber}>{tasks.length}</div>
                            <div style={styles.statLabel}>Total Tasks</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ ...styles.statNumber, color: '#f87171' }}>{tasks.filter(t => t.isAtRisk).length}</div>
                            <div style={styles.statLabel}>At Risk</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={{ ...styles.statNumber, color: '#fbbf24' }}>{tasks.filter(t => t.isCriticalPath).length}</div>
                            <div style={styles.statLabel}>Critical Path</div>
                        </div>
                    </div>
                </div>

                {/* Network Visualization */}
                <div style={styles.networkContainer}>
                    <svg
                        ref={svgRef}
                        width="100%"
                        height="600"
                        viewBox="0 0 800 600"
                        style={styles.svg}
                    >
                        {/* Grid pattern background */}
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="1"/>
                            </pattern>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Draw dependency lines */}
                        {tasks.map((task, index) => {
                            const position = calculateNodePosition(index, tasks.length);
                            return task.dependencies?.map(depId => {
                                const depIndex = tasks.findIndex(t => t.id === depId);
                                if (depIndex === -1) return null;
                                const depPosition = calculateNodePosition(depIndex, tasks.length);
                                return (
                                    <g key={`${task.id}-${depId}`}>
                                        <line
                                            x1={depPosition.x}
                                            y1={depPosition.y}
                                            x2={position.x}
                                            y2={position.y}
                                            stroke={task.isCriticalPath ? "#fbbf24" : "#64748b"}
                                            strokeWidth={task.isCriticalPath ? "3" : "2"}
                                            strokeDasharray={task.isCriticalPath ? "none" : "5,5"}
                                            opacity="0.6"
                                        />
                                        {/* Arrow head */}
                                        <polygon
                                            points={`${position.x-8},${position.y-4} ${position.x-8},${position.y+4} ${position.x-2},${position.y}`}
                                            fill={task.isCriticalPath ? "#fbbf24" : "#64748b"}
                                            opacity="0.6"
                                        />
                                    </g>
                                );
                            });
                        })}

                        {/* Draw task nodes */}
                        {tasks.map((task, index) => {
                            const position = calculateNodePosition(index, tasks.length);
                            const riskColor = getRiskColor(task.riskScore);

                            return (
                                <g key={task.id}>
                                    {/* Outer glow ring for critical path */}
                                    {task.isCriticalPath && (
                                        <circle
                                            cx={position.x}
                                            cy={position.y}
                                            r="45"
                                            fill="none"
                                            stroke="#fbbf24"
                                            strokeWidth="2"
                                            opacity="0.4"
                                            filter="url(#glow)"
                                        />
                                    )}

                                    {/* Risk indicator ring */}
                                    <circle
                                        cx={position.x}
                                        cy={position.y}
                                        r="35"
                                        fill="none"
                                        stroke={riskColor}
                                        strokeWidth="4"
                                        opacity="0.8"
                                    />

                                    {/* Main task circle */}
                                    <circle
                                        cx={position.x}
                                        cy={position.y}
                                        r="30"
                                        fill={getStatusColor(task.status)}
                                        style={styles.taskNode}
                                        onClick={() => setSelectedTask(task)}
                                    />

                                    {/* Task title */}
                                    <text
                                        x={position.x}
                                        y={position.y - 50}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="12"
                                        fontWeight="500"
                                    >
                                        {task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title}
                                    </text>

                                    {/* Risk score */}
                                    <text
                                        x={position.x}
                                        y={position.y + 5}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="10"
                                        fontWeight="bold"
                                    >
                                        {task.riskScore}%
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Legend */}
                    <div style={styles.legend}>
                        <h3 style={styles.legendTitle}>Legend</h3>
                        <div>
                            <div style={styles.legendItem}>
                                <div style={{ ...styles.legendColor, backgroundColor: '#22c55e' }}></div>
                                <span style={styles.legendText}>Low Risk (0-39%)</span>
                            </div>
                            <div style={styles.legendItem}>
                                <div style={{ ...styles.legendColor, backgroundColor: '#f97316' }}></div>
                                <span style={styles.legendText}>Medium Risk (40-69%)</span>
                            </div>
                            <div style={styles.legendItem}>
                                <div style={{ ...styles.legendColor, backgroundColor: '#ef4444' }}></div>
                                <span style={styles.legendText}>High Risk (70-100%)</span>
                            </div>
                            <div style={styles.legendItem}>
                                <div style={{ ...styles.legendColor, border: '2px solid #fbbf24', backgroundColor: 'transparent' }}></div>
                                <span style={styles.legendText}>Critical Path</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Task Details Modal */}
                {selectedTask && (
                    <div style={styles.modal}>
                        <div style={styles.modalContent}>
                            <div style={styles.modalHeader}>
                                <div style={styles.modalTitleContainer}>
                                    {getPriorityIcon(selectedTask.priority)}
                                    <h2 style={styles.modalTitle}>{selectedTask.title}</h2>
                                </div>
                                <button
                                    style={styles.closeButton}
                                    onClick={() => setSelectedTask(null)}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                >
                                    <X style={{ width: '24px', height: '24px' }} />
                                </button>
                            </div>

                            <div style={styles.modalGrid}>
                                <div style={styles.modalSection}>
                                    <div style={styles.modalField}>
                                        <span style={styles.modalLabel}>Status:</span>
                                        <div style={styles.statusIndicator}>
                                            <div
                                                style={{
                                                    ...styles.statusDot,
                                                    backgroundColor: getStatusColor(selectedTask.status)
                                                }}
                                            ></div>
                                            <span style={styles.modalValue}>
                                              {selectedTask.status?.replace('_', ' ') ?? 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={styles.modalField}>
                                        <span style={styles.modalLabel}>Priority:</span>
                                        <p style={styles.modalValue}>{selectedTask.priority}</p>
                                    </div>
                                    <div style={styles.modalField}>
                                        <span style={styles.modalLabel}>Type:</span>
                                        <p style={styles.modalValue}>{selectedTask.type}</p>
                                    </div>
                                </div>

                                <div style={styles.modalSection}>
                                    <div style={styles.modalField}>
                                        <span style={styles.modalLabel}>Risk Score:</span>
                                        <div style={styles.riskBarContainer}>
                                            <div style={styles.riskBar}>
                                                <div
                                                    style={{
                                                        ...styles.riskFill,
                                                        width: `${selectedTask.riskScore}%`,
                                                        backgroundColor: getRiskColor(selectedTask.riskScore)
                                                    }}
                                                ></div>
                                            </div>
                                            <span style={styles.riskScore}>{selectedTask.riskScore}%</span>
                                        </div>
                                    </div>
                                    <div style={styles.modalField}>
                                        <span style={styles.modalLabel}>Estimated Hours:</span>
                                        <p style={styles.modalValue}>{selectedTask.estimatedHours}h</p>
                                    </div>
                                    <div style={styles.modalField}>
                                        <span style={styles.modalLabel}>Due Date:</span>
                                        <p style={styles.modalValue}>{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.description}>
                                <span style={styles.modalLabel}>Description:</span>
                                <p style={styles.modalValue}>{selectedTask.description}</p>
                            </div>

                            <div style={styles.insights}>
                                <span style={styles.modalLabel}>AI Insights:</span>
                                <div style={styles.insightsBox}>
                                    <p style={styles.insightsText}>{selectedTask.aiInsightSummary}</p>
                                </div>
                            </div>

                            <div style={styles.badges}>
                                {selectedTask.isCriticalPath && (
                                    <div style={{ ...styles.badge, ...styles.criticalBadge }}>
                                        <Zap style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
                                        <span style={styles.criticalText}>Critical Path</span>
                                    </div>
                                )}
                                {selectedTask.isAtRisk && (
                                    <div style={{ ...styles.badge, ...styles.riskBadge }}>
                                        <AlertCircle style={{ width: '16px', height: '16px', color: '#f87171' }} />
                                        <span style={styles.riskText}>At Risk</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectAnalysisNetwork;