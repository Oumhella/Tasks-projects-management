// API Service for backend integration
const API_BASE_URL = 'http://localhost:8081/api/v1';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add authentication headers when Keycloak is integrated
        // 'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      return JSON.parse(text);
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Project endpoints
  async getProjects(): Promise<any[]> {
    return this.request<any[]>('/projects');
  }

  async getProject(id: string): Promise<any> {
    return this.request<any>(`/projects/${id}`);
  }

  async createProject(project: any): Promise<any> {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
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

    const url = `${API_BASE_URL}/attachments`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        // Don't set Content-Type header - let browser set it for FormData
        headers: {
          // TODO: Add authentication headers when Keycloak is integrated
          // 'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  async getAttachmentDownloadUrl(id: string): Promise<string> {
    const response = await this.request<{ downloadUrl: string }>(`/attachments/${id}/download-url`);
    return response.downloadUrl;
  }

  async deleteAttachment(id: string): Promise<void> {
    return this.request<void>(`/attachments/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;