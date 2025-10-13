import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";



import React, { useEffect, useState } from "react";
import apiService from "../../services/api";

interface TaskEvent {
    title: string;
    start: Date;
    end: Date;
    resource?: Task; // Store full task data for styling
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

interface TaskProps {
    project: any;
}
const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});
// const localizer = globalizeLocalizer(globalize);

const MyCalendar: React.FC<TaskProps> = ({ project }) => {
    const [tasks, setTasks] = useState<TaskEvent[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await apiService.getTasksByProjectId(project.id);

                // Map API response into TaskEvent[] with proper validation
                const formattedEvents: TaskEvent[] = response
                    .filter((task: any) => task.dueDate && task.createdAt) // Only include tasks with dates
                    .map((task: any) => {
                        const startDate = new Date(task.createdAt);
                        const endDate = new Date(task.dueDate);

                        // Ensure end date is after start date
                        if (endDate <= startDate) {
                            endDate.setDate(startDate.getDate() + 1);
                        }

                        return {
                            title: task.title,
                            start: startDate,
                            end: endDate,
                            resource: task // Store full task data for styling
                        };
                    });

                setTasks(formattedEvents);
            } catch (err) {
                console.error("Error fetching tasks", err);
                setError("Error fetching tasks");
            } finally {
                setLoading(false);
            }
        };

        if (project?.id) {
            fetchTasks();
        }
    }, [project.id]);

    // Function to determine event styling based on task properties
    const eventStyleGetter = (event: TaskEvent) => {
        const task = event.resource;
        if (!task) return {};

        let className = '';

        // Priority-based styling
        switch (task.priority?.toLowerCase()) {
            case 'high':
            case 'critical':
                className += ' priority-high';
                break;
            case 'medium':
                className += ' priority-medium';
                break;
            case 'low':
                className += ' priority-low';
                break;
            default:
                break;
        }

        // Status-based styling
        switch (task.status?.toLowerCase()) {
            case 'completed':
            case 'done':
                className += ' status-completed';
                break;
            case 'on-hold':
            case 'cancelled':
                className += ' status-on-hold';
                break;
            default:
                break;
        }

        return { className: className.trim() };
    };

    return (
        <div>
            {loading && <div className="calendar-loading">Loading calendar...</div>}
            {error && <div className="calendar-error">{error}</div>}
            {!loading && !error && (
                <>
                    {tasks.length === 0 ? (
                        <div className="calendar-loading">
                            No tasks found for this project. Tasks will appear here once they are created.
                        </div>
                    ) : (
                        <Calendar
                            localizer={localizer}
                            events={tasks}
                            startAccessor="start"
                            endAccessor="end"
                            views={['month', 'week', 'day']}
                            defaultView="month"
                            date={currentDate}
                            onNavigate={(date) => setCurrentDate(date)}
                            eventPropGetter={eventStyleGetter}
                            style={{ height: 500 }}
                            toolbar={true}
                            popup={true}
                            popupOffset={30}
                            selectable={true}
                            step={60}
                            showMultiDayTimes={true}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default MyCalendar;
