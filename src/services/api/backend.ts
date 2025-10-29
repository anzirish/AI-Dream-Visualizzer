/**
 * Backend API service for AI Dreams
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

interface User {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Dream {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  generatedStory: string;
  generatedImage?: string;
  isPublic: boolean;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

class BackendAPI {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem("authToken");
  }

  // Record<K, V> is a TypeScript utility type that creates an object type where:
  // K = the type of the keys
  // V = the type of the values

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // RequestInit is the built-in TypeScript type for the options object 
  // that you pass to the fetch() function. It defines all the possible 
  // configuration options for an HTTP request.
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Authentication methods
  async signup(name: string, email: string, password: string): Promise<User> {
    const response = await this.request<
      ApiResponse<{ user: User; token: string }>
    >("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    this.token = response.data!.token;
    localStorage.setItem("authToken", this.token);
    return response.data!.user;
  }

  async login(email: string, password: string): Promise<User> {
    const response = await this.request<
      ApiResponse<{ user: User; token: string }>
    >("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    this.token = response.data!.token;
    localStorage.setItem("authToken", this.token);
    return response.data!.user;
  }

  async logout(): Promise<void> {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } finally {
      this.token = null;
      localStorage.removeItem("authToken");
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;

    try {
      const response = await this.request<ApiResponse<{ user: User }>>(
        "/auth/me"
      );
      return response.data?.user || null;
    } catch {
      this.token = null;
      localStorage.removeItem("authToken");
      return null;
    }
  }

  // Dream methods
  async createDream(dreamData: {
    title: string;
    description: string;
    generatedStory: string;
    generatedImage?: string;
    isPublic?: boolean;
  }): Promise<Dream> {
    const response = await this.request<ApiResponse<{ dream: Dream }>>(
      "/dreams",
      { method: "POST", body: JSON.stringify(dreamData) }
    );
    return response.data!.dream;
  }

  async getMyDreams(): Promise<Dream[]> {
    const response = await this.request<ApiResponse<{ dreams: Dream[] }>>(
      "/dreams/my"
    );
    return response.data?.dreams || [];
  }

  async getPublicDreams(
    page = 1,
    limit = 20
  ): Promise<{ dreams: Dream[]; pagination: Pagination }> {
    const response = await this.request<
      ApiResponse<{ dreams: Dream[]; pagination: Pagination }>
    >(`/dreams/public?page=${page}&limit=${limit}`);

    return {
      dreams: response.data?.dreams || [],
      pagination: response.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  async getDreamById(id: string): Promise<Dream> {
    const response = await this.request<ApiResponse<{ dream: Dream }>>(
      `/dreams/${id}`
    );
    return response.data!.dream;
  }

  async updateDream(
    id: string,
    updates: { title?: string; description?: string; isPublic?: boolean }
  ): Promise<Dream> {
    const response = await this.request<ApiResponse<{ dream: Dream }>>(
      `/dreams/${id}`,
      { method: "PUT", body: JSON.stringify(updates) }
    );
    return response.data!.dream;
  }

  async deleteDream(id: string): Promise<void> {
    await this.request(`/dreams/${id}`, { method: "DELETE" });
  }

  // AI methods
  async generateCompleteDream(
    title: string,
    description: string
  ): Promise<{ story: string; image?: string }> {
    const response = await this.request<
      ApiResponse<{ story: string; image?: string }>
    >("/ai/generate-complete", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });

    return {
      story: response.data?.story || "",
      image: response.data?.image,
    };
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const backendAPI = new BackendAPI();
export type { User, Dream };
