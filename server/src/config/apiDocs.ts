/**
 * API Documentation Object
 *
 * Complete documentation structure for the AI Dreams API including:
 * - All available endpoints organized by category
 * - HTTP methods and URL patterns
 * - Version information and metadata
 *
 * This documentation is served at GET /api and provides a comprehensive
 * overview of the API capabilities for developers and integrators.
 *
 * @constant {Object} apiDocumentation
 */
export const apiDocumentation = {
  success: true,
  message: "AI Dreams API",
  version: "1.0.0",
  endpoints: {
    v1: {
      auth: ["POST /api/v1/auth/signup", "POST /api/v1/auth/login", "GET /api/v1/auth/me", "POST /api/v1/auth/logout"],
      dreams: [
        "POST /api/v1/dreams",
        "GET /api/v1/dreams/my",
        "GET /api/v1/dreams/public",
        "GET /api/v1/dreams/:id",
        "PUT /api/v1/dreams/:id",
        "DELETE /api/v1/dreams/:id",
      ],
      ai: ["POST /api/v1/ai/generate-story", "POST /api/v1/ai/generate-image", "POST /api/v1/ai/generate-complete"],
    },
    health: ["GET /health", "GET /api/v1/health"],
  },
  documentation: "Visit /api for endpoint documentation",
};
