import {keycloak} from '../config/Keycloak';
const API_BASE_URL = 'http://localhost:8081/api/v1';

interface ProjectPulseResponse {
  sentiment: string;
  summary: string;
  actions: string[];
}
class ApiService {

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    await keycloak.updateToken(30);
    const token = keycloak.token;
    if (!token) throw new Error("No valid token available");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return this.parseResponse<T>(response);
  }

  private async parseResponse<T>(response: Response): Promise<T> {
      const text = await response.text();
      if (!text) return {} as T;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json'))
          return JSON.parse(text);
      return text as unknown as T; }

    // Project endpoints
  async getProjects(): Promise<any[]> {
    return this.request<any[]>('/projects');
  }

  async getProject(id: string): Promise<any> {
    return this.request<any>(`/projects/${id}`);
  }

  async addProjectMember(id: string, user:any): Promise<any> {
    return this.request<any>(`/projects/${id}/add`, {
      method: "POST",
      body: JSON.stringify(user),
    })
  }

  async getProjectMembers(id: string | undefined): Promise<any[]> {
    return this.request<any>(`/projects/${id}/members`);
  }

  async createProject(project: any): Promise<any> {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }
  async analyzeProject(id: String): Promise<any> {
    // First get the project and its tasks for AI analysis
    const [project, tasks] = await Promise.all([
      this.getProject(id.toString()),
      this.getTasksByProjectId(id.toString())
    ]);

    // Prepare comprehensive project data for AI analysis
    const projectDataForAnalysis = {
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      tasks: tasks,
      members: project.members || [],
      comments: project.comments || []
    };

    const prompt = `Analyze this project and provide detailed task-level insights. Return a JSON object with the following structure:

    {
      "tasks": [
        {
          "id": "original_task_id",
          "title": "original_task_title",
          "isAtRisk": boolean,
          "riskScore": number (0-100),
          "isCriticalPath": boolean,
          "aiInsightSummary": "brief explanation of task status and recommendations"
        }
      ]
    }

    Project Context:
    - Name: ${project.name}
    - Description: ${project.description}
    - Status: ${project.status}
    - Tasks: ${JSON.stringify(tasks, null, 2)}
    - Members: ${project.members?.map((m: any) => m.name).join(', ') || 'None'}

    For each task, determine:
    1. isAtRisk: true if the task is likely to miss its deadline or has blockers
    2. riskScore: 0-100 score based on dependencies, priority, and timeline
    3. isCriticalPath: true if this task is on the project's critical path
    4. aiInsightSummary: brief analysis of the task's current state

    Focus on identifying bottlenecks, dependencies, and actionable insights.`;

    const chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "tasks": {
              "type": "ARRAY",
              "items": {
                "type": "OBJECT",
                "properties": {
                  "id": { "type": "STRING" },
                  "title": { "type": "STRING" },
                  "isAtRisk": { "type": "BOOLEAN" },
                  "riskScore": { "type": "NUMBER" },
                  "isCriticalPath": { "type": "BOOLEAN" },
                  "aiInsightSummary": { "type": "STRING" }
                },
                "required": ["id", "title", "isAtRisk", "riskScore", "isCriticalPath", "aiInsightSummary"]
              }
            }
          },
          "required": ["tasks"]
        }
      }
    };

    const apiKey = 'AIzaSyD4Gj0ee03Q4Xn4BqmtNJPUQ3M2r5KxGLQ';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const result = await response.json();
      const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (jsonText) {
        const aiAnalysis = JSON.parse(jsonText);

        // Merge AI analysis with original task data
        const enhancedTasks = tasks.map(originalTask => {
          const aiTask = aiAnalysis.tasks.find((t: any) => t.id === originalTask.id);
          if (aiTask) {
            return {
              ...originalTask,
              isAtRisk: aiTask.isAtRisk,
              riskScore: aiTask.riskScore,
              isCriticalPath: aiTask.isCriticalPath,
              aiInsightSummary: aiTask.aiInsightSummary
            };
          }
          return originalTask;
        });

        return enhancedTasks;
      }

      throw new Error("Invalid response from Gemini API");
    } catch (error) {
      console.error('Project analysis failed:', error);
      // Fallback to returning original tasks if AI fails
      return tasks;
    }
  }


  async updateProject(id: string, project: any): Promise<any> {
    return this.request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Task endpoints
  async getTasks(): Promise<any[]> {
    return this.request<any[]>('/tasks');
  }

  async getTask(id: string): Promise<any> {
    return this.request<any>(`/tasks/id/${id}`);
  }

  async getTasksByStatus(status: string): Promise<any[]> {
    return this.request<any[]>(`/tasks/status/${status}`);
  }
  async getTasksByProjectId(id: string): Promise<any[]> {
    return this.request<any[]>(`/tasks/projects/${id}`);
  }
  async createTask(task: any): Promise<any> {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, task: any): Promise<any> {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // User endpoints
  async getUsers(): Promise<any[]> {
    return this.request<any[]>('/users');
  }

  async getUser(id: string): Promise<any> {
    return this.request<any>(`/users/${id}`);
  }

  async getUserProfile(): Promise<any> {
    return this.request<any>(`/users/profile`);
  }


  async createUser(user: any): Promise<any> {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: any): Promise<any> {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }
  async getNotifications(): Promise<any[]> {
    return this.request<any[]>('/users/notifications');
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }


  // Comment endpoints
  async getComments(): Promise<any[]> {
    return this.request<any[]>('/comments');
  }

  async getComment(id: string): Promise<any> {
    return this.request<any>(`/comments/${id}`);
  }

  async getCommentsByTask(taskId: string): Promise<any[]> {
    return this.request<any[]>(`/comments/tasks/${taskId}`);
  }

  async createComment(comment: any): Promise<any> {
    return this.request<any>('/comments', {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async updateComment(id: string, comment: any): Promise<any> {
    return this.request<any>(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(comment),
    });
  }

  async deleteComment(id: string): Promise<void> {
    return this.request<void>(`/comments/${id}`, {
      method: 'DELETE',
    });
  }

  // Attachment endpoints
  async getAttachmentsByComment(commentId: string): Promise<any[]> {
    return this.request<any[]>(`/attachments/comments/${commentId}`);
  }

  async getAttachmentsByTask(taskId: string): Promise<any[]> {
    return this.request<any[]>(`/attachments/tasks/${taskId}`);
  }

  async uploadAttachment(file: File, taskId?: string, commentId?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    if (taskId) {
      formData.append('taskId', taskId);
    }
    if (commentId) {
      formData.append('commentId', commentId);
    }

    // Ensure token is up-to-date
    await keycloak.updateToken(30);
    const token = keycloak.token;
    if (!token) throw new Error("No valid token available");

    const url = `${API_BASE_URL}/attachments`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  async getAttachmentDownloadUrl(id: string): Promise<string> {
    const response = await this.request<{ downloadUrl: string }>(`/attachments/${id}/download-url`);
   console.log(response);
    return response.downloadUrl;
  }

  async deleteAttachment(id: string): Promise<void> {
    return this.request<void>(`/attachments/${id}`, {
      method: 'DELETE',
    });
  }


  async getProjectPulse(project: any): Promise<ProjectPulseResponse> {
    const prompt = `Based on the following project data, provide a "Project Pulse" analysis. This analysis should be a JSON object with three fields: 
      "sentiment": a single word representing the overall mood (e.g., "Positive", "Stagnant", "Stressed", "Stable"), 
      "summary": a brief, one-sentence summary of the project's health, and 
      "actions": a bulleted list of 2-3 actionable recommendations to improve the project's state.

      Project Name: ${project.name}
      Description: ${project.description}
      Status: ${project.status}
      Tasks: ${JSON.stringify(project.tasks, null, 2)}
      Members: ${project.members.map((member: any) => member.name).join(', ')}
      Comments: ${JSON.stringify(project.comments, null, 2)}
      
      Response format must be a valid JSON object.`;

    const chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "sentiment": { "type": "STRING" },
            "summary": { "type": "STRING" },
            "actions": {
              "type": "ARRAY",
              "items": { "type": "STRING" }
            }
          }
        }
      }
    };
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const retryFetch = async (url: string, options: RequestInit, retries: number): Promise<Response> => {
      try {
        const response = await fetch(url, options);
        if (response.status === 429 && retries > 0) {
          const delay = Math.pow(2, 3 - retries) * 1000;
          console.warn(`Rate limit hit, retrying in ${delay / 1000}s...`);
          await new Promise(res => setTimeout(res, delay));
          return retryFetch(url, options, retries - 1);
        }
        return response;
      } catch (error) {
        if (retries > 0) {
          const delay = Math.pow(2, 3 - retries) * 1000;
          console.warn(`Fetch failed, retrying in ${delay / 1000}s...`);
          await new Promise(res => setTimeout(res, delay));
          return retryFetch(url, options, retries - 1);
        }
        throw error;
      }
    };

    try {
      const response = await retryFetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, 3);

      const result = await response.json();
      const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (jsonText) {
        return JSON.parse(jsonText);
      }
      throw new Error("Invalid response from Gemini API");

    } catch (error) {
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }


}

export const apiService = new ApiService();
export default apiService;