/**
 * Backend API service for AI Dreams
 * Handles authentication and dream operations with local backend
 */

import { env } from "@/config/env";

const API_BASE_URL = env.API_BASE_URL;

interface ApiResponse<T = any> {
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

interface AuthResponse {
  user: User;
  token: string;
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

class BackendAPI {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem("authToken");
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Add timeout to requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout - please check your connection");
      }

      throw error;
    }
  }

  // Authentication methods
  async signup(name: string, email: string, password: string): Promise<User> {
    const response = await this.request<ApiResponse<AuthResponse>>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem("authToken", this.token);
      return response.data.user;
    }

    throw new Error("Signup failed");
  }

  async login(email: string, password: string): Promise<User> {
    const response = await this.request<ApiResponse<AuthResponse>>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem("authToken", this.token);
      return response.data.user;
    }

    throw new Error("Login failed");
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
      const response = await this.request<ApiResponse<{ user: User }>>("/auth/me");
      return response.data?.user || null;
    } catch (error) {
      // Token might be invalid, clear it
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
    const response = await this.request<ApiResponse<{ dream: Dream }>>("/dreams", {
      method: "POST",
      body: JSON.stringify(dreamData),
    });

    if (response.data) {
      return response.data.dream;
    }

    throw new Error("Failed to create dream");
  }

  async getMyDreams(): Promise<Dream[]> {
    const response = await this.request<ApiResponse<{ dreams: Dream[] }>>("/dreams/my");
    return response.data?.dreams || [];
  }

  async getPublicDreams(
    page = 1,
    limit = 20
  ): Promise<{
    dreams: Dream[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const response = await this.request<
      ApiResponse<{
        dreams: Dream[];
        pagination: any;
      }>
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
    const response = await this.request<ApiResponse<{ dream: Dream }>>(`/dreams/${id}`);

    if (response.data) {
      return response.data.dream;
    }

    throw new Error("Dream not found");
  }

  async updateDream(
    id: string,
    updates: {
      title?: string;
      description?: string;
      isPublic?: boolean;
    }
  ): Promise<Dream> {
    const response = await this.request<ApiResponse<{ dream: Dream }>>(`/dreams/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });

    if (response.data) {
      return response.data.dream;
    }

    throw new Error("Failed to update dream");
  }

  async deleteDream(id: string): Promise<void> {
    await this.request(`/dreams/${id}`, { method: "DELETE" });
  }

  // AI methods
  async generateStory(title: string, description: string): Promise<string> {
    const response = await this.request<ApiResponse<{ story: string }>>("/ai/generate-story", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });

    return response.data?.story || "";
  }

  async generateImage(description: string): Promise<string> {
    const response = await this.request<ApiResponse<{ image: string }>>("/ai/generate-image", {
      method: "POST",
      body: JSON.stringify({ description }),
    });

    return response.data?.image || "";
  }

  async generateCompleteDream(
    title: string,
    description: string,
    includeImage = false
  ): Promise<{ story: string; image?: string }> {
    const response = await this.request<
      ApiResponse<{
        story: string;
        image?: string;
      }>
    >("/ai/generate-complete", {
      method: "POST",
      body: JSON.stringify({ title, description, includeImage }),
    });

    return {
      story: response.data?.story || "",
      image: response.data?.image || undefined,
    };
  }

  // API Key methods
  async addApiKey(keyType: "openrouter" | "stable_diffusion", apiKey: string): Promise<void> {
    await this.request("/api-keys", {
      method: "POST",
      body: JSON.stringify({ keyType, apiKey }),
    });
  }

  async getMyApiKeys(): Promise<any[]> {
    const response = await this.request<ApiResponse<{ apiKeys: any[] }>>("/api-keys/my");
    return response.data?.apiKeys || [];
  }

  async getApiKeyStats(): Promise<any> {
    const response = await this.request<ApiResponse<{ stats: any }>>("/api-keys/stats");
    return response.data?.stats || [];
  }

  async deleteApiKey(id: string): Promise<void> {
    await this.request(`/api-keys/${id}`, { method: "DELETE" });
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
