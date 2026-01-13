/**
 * Simplified Backend API service for AI Dreams - Function-based
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

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

// Token management
const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

const setToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

const clearToken = (): void => {
  localStorage.removeItem("authToken");
};

// HTTP request helper
const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Authentication functions
export const signup = async (name: string, email: string, password: string): Promise<User> => {
  const response = await request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (response.data.token) {
    setToken(response.data.token);
  }
  return response.data.user;
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.data.token) {
    setToken(response.data.token);
  }
  return response.data.user;
};

export const logout = async (): Promise<void> => {
  try {
    await request("/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await request("/auth/me");
    return response.data?.user || null;
  } catch {
    clearToken();
    return null;
  }
};

// Dream functions
export const createDream = async (dreamData: {
  title: string;
  description: string;
  generatedStory: string;
  generatedImage?: string;
  isPublic?: boolean;
}): Promise<Dream> => {
  const response = await request("/dreams", {
    method: "POST",
    body: JSON.stringify(dreamData),
  });
  return response.data.dream;
};

export const getMyDreams = async (): Promise<Dream[]> => {
  const response = await request("/dreams/my");
  return response.data?.dreams || [];
};

export const getPublicDreams = async (page = 1, limit = 20): Promise<{ dreams: Dream[] }> => {
  const response = await request(`/dreams/public?page=${page}&limit=${limit}`);
  return { dreams: response.data?.dreams || [] };
};

export const getDreamById = async (id: string): Promise<Dream> => {
  const response = await request(`/dreams/${id}`);
  return response.data.dream;
};

export const updateDream = async (
  id: string,
  updates: { title?: string; description?: string; isPublic?: boolean }
): Promise<Dream> => {
  const response = await request(`/dreams/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return response.data.dream;
};

export const deleteDream = async (id: string): Promise<void> => {
  await request(`/dreams/${id}`, { method: "DELETE" });
};

// AI functions
export const generateCompleteDream = async (
  title: string,
  description: string
): Promise<{ story: string; image?: string }> => {
  const response = await request("/ai/generate-complete", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });

  return {
    story: response.data?.story || "",
    image: response.data?.image,
  };
};

// Utility functions
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getAuthToken = (): string | null => {
  return getToken();
};


export type { User, Dream };
