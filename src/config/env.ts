/**
 * Simple environment configuration for BASE URL
 */

interface EnvConfig {
  API_BASE_URL: string;
}

// Environment configuration object
export const env: EnvConfig = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
};

// Export individual values for convenience
export const { API_BASE_URL } = env;
