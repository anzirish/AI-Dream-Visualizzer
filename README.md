# 🌙 AI Dreams - Transform Your Dreams into Stories

[![Deploy Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com/anzirish/AI-Dream-Visualizzer)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-blue)](https://ai-dream-visualizzer.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20TypeScript-green)](https://ai-dream-visualizzer.onrender.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-green)](https://cloud.mongodb.com/)
[![AI](https://img.shields.io/badge/AI-OpenRouter%20%2B%20Stable%20Diffusion-purple)](https://openrouter.ai/)
[![Build Tool](https://img.shields.io/badge/Build-Vite%207-646CFF)](https://vitejs.dev/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%204-38B2AC)](https://tailwindcss.com/)

## 🚀 Introduction

**AI Dreams** is a cutting-edge full-stack web application that transforms users' dreams into captivating experiences through advanced AI technology. Built with modern technologies including React 19, TypeScript, Vite 7, and Tailwind CSS 4, the platform combines dream journaling with AI-powered storytelling and image generation, creating an immersive community where users can share their nocturnal adventures and explore the dreams of others.

## 🆕 Recent Updates & Current Status

### **Latest Improvements (2025)**

- **🔧 Modern Tech Stack Upgrade**

  - Upgraded to React 19.1.1 with latest concurrent features
  - Migrated to Vite 7.1.7 for faster development and optimized builds
  - Updated to Tailwind CSS 4.1.13 with enhanced performance
  - Implemented TypeScript 5.8+ across frontend and backend

- **🏗️ Architecture Enhancements**

  - Implemented feature-based frontend architecture for better maintainability
  - Added comprehensive TypeScript interfaces and type safety
  - Restructured components with Radix UI primitives for accessibility
  - Enhanced API structure with proper error handling and validation

- **🔐 Security & Performance**

  - Upgraded Express to 5.1.0 with enhanced security features
  - Implemented comprehensive JWT authentication with refresh tokens
  - Added rate limiting and advanced security middleware
  - Optimized MongoDB queries and database indexing

- **📱 User Experience**
  - Redesigned UI with modern Tailwind CSS 4 components
  - Improved responsive design for all device sizes
  - Enhanced loading states and error handling
  - Added comprehensive form validation and user feedback

### ✨ What Makes AI Dreams Special

- **🤖 AI-Powered Storytelling**: Transform raw dream descriptions into engaging, immersive narratives using OpenRouter.ai
- **🎨 Dream Visualization**: Generate stunning AI images with intelligent fallback system using Stable Diffusion
- **👥 Community Features**: Share dreams publicly or keep them private with user attribution
- **🔐 Secure Authentication**: JWT-based authentication with comprehensive user management
- **📱 Modern UI/UX**: Fully responsive design built with React 19, TypeScript, and Tailwind CSS 4
- **⚡ High Performance**: Vite 7 build system with optimized bundle size and fast development
- **🛡️ Production Security**: Comprehensive security middleware, rate limiting, and environment-based configuration
- **🏗️ Clean Architecture**: Feature-based frontend structure with separation of concerns
- **🧪 Developer Experience**: Full TypeScript support, ESLint configuration, and comprehensive API documentation

## 📁 Project Architecture

```
ai-dreams/
├── 🎨 Frontend (React 19 + TypeScript + Vite 7)
│   ├── src/
│   │   ├── features/           # Feature-based architecture
│   │   │   ├── auth/          # Authentication module
│   │   │   │   ├── components/ # LoginForm, SignUpForm, ProtectedRoute
│   │   │   │   ├── contexts/   # AuthContext for state management
│   │   │   │   ├── hooks/      # useAuth custom hook
│   │   │   │   └── types/      # Auth-related TypeScript types
│   │   │   └── dreams/        # Dream management module
│   │   │       ├── components/ # DreamCard, DreamForm, PublicDreamFeed, StoryDisplay
│   │   │       ├── services/   # Dream API integration
│   │   │       └── types/      # Dream-related TypeScript types
│   │   ├── shared/            # Shared components & utilities
│   │   │   ├── components/    # Reusable UI components
│   │   │   │   ├── layout/    # Header, Footer, Navigation
│   │   │   │   └── ui/        # Button, Alert, Input components
│   │   │   └── utils/         # Utility functions & validation
│   │   ├── services/          # API communication layer
│   │   │   └── api/          # Centralized API client
│   │   ├── pages/             # Route components
│   │   │   ├── auth/         # Login, Signup pages
│   │   │   ├── dreams/       # Dream-related pages
│   │   │   ├── Home.tsx      # Landing page
│   │   │   └── ApiKeySettings.tsx # API key management (disabled)
│   │   ├── App.tsx           # Main application component with routing
│   │   ├── main.tsx          # Application entry point
│   │   └── index.css         # Global styles with Tailwind imports
│   ├── public/               # Static assets
│   ├── dist/                 # Production build output
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.ts        # Vite configuration with path aliases
│   ├── tailwind.config.js    # Tailwind CSS 4 configuration
│   ├── tsconfig.json         # TypeScript configuration
│   └── eslint.config.js      # ESLint configuration
│
├── 🔧 Backend (Node.js + Express 5 + TypeScript)
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.ts    # User authentication logic
│   │   │   ├── dreamController.ts   # Dream CRUD operations
│   │   │   └── aiController.ts      # AI generation endpoints
│   │   ├── models/            # MongoDB schemas with Mongoose
│   │   │   ├── User.ts        # User model with bcrypt hashing
│   │   │   ├── Dream.ts       # Dream model with relationships
│   │   │   └── ApiKey.ts      # API key management model
│   │   ├── routes/            # API route definitions
│   │   │   ├── v1/           # Versioned API routes
│   │   │   │   ├── auth.ts    # Authentication routes
│   │   │   │   ├── dreams.ts  # Dream management routes
│   │   │   │   ├── ai.ts      # AI generation routes
│   │   │   │   ├── apiKeys.ts # API key routes
│   │   │   │   └── index.ts   # Route aggregation
│   │   │   └── analytics.ts   # Analytics and metrics
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.ts       # JWT authentication & authorization
│   │   │   ├── errorHandler.ts # Global error handling
│   │   │   └── rateLimiter.ts  # Rate limiting protection
│   │   ├── services/          # Business logic layer
│   │   │   └── aiService.ts   # OpenRouter & Stable Diffusion integration
│   │   ├── utils/             # Utility functions
│   │   │   └── jwt.ts         # JWT token operations
│   │   └── config/            # Configuration modules
│   │       ├── database.ts    # MongoDB connection setup
│   │       └── apiDocs.ts     # API documentation config
│   ├── tests.postman/         # Postman API testing suite
│   │   ├── AI_Dreams_API.postman_collection.json
│   │   ├── AI_Dreams_Environment.postman_environment.json
│   │   └── POSTMAN_TESTING_GUIDE.md
│   ├── dist/                  # Compiled JavaScript output
│   ├── index.ts              # Server entry point with middleware setup
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript configuration
│
└── 🔧 Configuration & Deployment
    ├── .env                  # Environment variables (local development)
    ├── .env.example          # Environment variables template
    ├── .gitignore           # Git ignore rules
    ├── .vercelignore        # Vercel deployment ignore
    ├── components.json      # Radix UI components configuration
    └── README.md            # Project documentation
```

## ✨ Features

### 🔐 **Authentication & User Management**

- Secure JWT-based authentication system
- User registration and login with email/password
- Protected routes and session management
- User profile management

### 🌙 **Dream Management**

- Create and store personal dream entries
- Rich text descriptions with title and content
- Public/private visibility controls
- Edit and delete dream entries
- Personal dream collection dashboard

### 🤖 **AI-Powered Content Generation**

- **Story Generation**: Transform dreams into immersive narratives using OpenRouter.ai
- **Image Generation**: Create visual representations using Stable Diffusion
- **Complete Dream Processing**: Generate both story and image in one request
- **Community API Keys**: Shared pool of API keys for sustainable AI usage

### 👥 **Community Features**

- Public dream feed with pagination
- Explore other users' shared dreams
- Search and filter community content
- User attribution and dream statistics

### 📊 **Analytics & Insights**

- Platform usage statistics
- User engagement metrics
- Dream creation trends
- API key usage monitoring

### 🛡️ **Security & Performance**

- Rate limiting to prevent abuse
- Input validation and sanitization
- Error handling with proper HTTP codes
- CORS protection and security headers
- Optimized database queries with indexing

### 📱 **User Experience**

- Fully responsive design (mobile, tablet, desktop)
- Modern UI with Tailwind CSS and Radix UI
- Loading states and error handling
- Intuitive navigation and user flows
- Accessibility-compliant components

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### **1. Clone the Repository**

```bash
git clone https://github.com/anzirish/AI-Dream-Visualizzer.git
cd ai-dreams
```

### **2. Backend Setup**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secure_jwt_secret
# CLIENT_URL=http://localhost:5173

# Start development server
npm run dev
```

### **3. Frontend Setup**

```bash
# Navigate to root directory (from server/)
cd ..

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with backend URL:
# VITE_API_BASE_URL=http://localhost:5000/api/v1

# Start development server
npm run dev
```

### **4. Access the Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

## 🔧 Development

### **Available Scripts**

#### Frontend (Root Directory)

```bash
npm run dev          # Start Vite development server (http://localhost:5173)
npm run build        # Build for production (TypeScript compilation + Vite build)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint with TypeScript support
```

#### Backend (Server Directory)

```bash
npm run dev          # Start development server with nodemon and ts-node
npm run build        # Compile TypeScript to JavaScript (dist/ folder)
npm start            # Start production server from compiled JavaScript
npm test             # Run Jest test suite
npm run render-build # Build script for Render deployment
```

## 🌐 Deployment

Both frontend and backend are **production-ready** and can be immediately.

### **Frontend Deployment (Vercel - Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
vercel --prod

# Set environment variable in Vercel dashboard:
# VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

### **Backend Deployment (Railway/Render/Heroku)**

```bash
# Build the application
cd server
npm run build

# Deploy to your preferred platform
# Set environment variables:
# NODE_ENV=production
# MONGODB_URI=your_production_mongodb_uri
# JWT_SECRET=your_production_jwt_secret
# CLIENT_URL=https://your-frontend-domain.com
```

### **Environment Variables**

#### Frontend (.env)

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1  # Development
# VITE_API_BASE_URL=https://your-api-domain.com/api/v1  # Production
```

#### Backend (server/.env)

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aidreams

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRE=7d

# Client Configuration
CLIENT_URL=http://localhost:5173

# AI API Keys (Optional - for fallback)
OPENROUTER_API_KEY=your_openrouter_api_key
STABLE_DIFFUSION_API_KEY=your_stable_diffusion_api_key
```

## 🔌 API Endpoints

### **Authentication Endpoints**

- `POST /api/v1/auth/signup` - User registration with email/password
- `POST /api/v1/auth/login` - User authentication and JWT token generation
- `GET /api/v1/auth/me` - Get current authenticated user profile
- `POST /api/v1/auth/logout` - User logout and token invalidation

### **Dream Management**

- `POST /api/v1/dreams` - Create new dream entry (authenticated)
- `GET /api/v1/dreams/my` - Get user's personal dreams with pagination
- `GET /api/v1/dreams/public` - Get public dreams feed with user attribution
- `GET /api/v1/dreams/:id` - Get specific dream by ID
- `PUT /api/v1/dreams/:id` - Update existing dream (owner only)
- `DELETE /api/v1/dreams/:id` - Delete dream (owner only)

### **AI Generation Services**

- `POST /api/v1/ai/generate-story` - Generate AI story from dream description
- `POST /api/v1/ai/generate-image` - Generate AI image from dream content
- `POST /api/v1/ai/generate-complete` - Generate both story and image in one request

### **API Key Management** _(Currently Disabled)_

- `POST /api/v1/api-keys` - Add community API key for shared usage
- `GET /api/v1/api-keys/my` - Get user's contributed API keys
- `GET /api/v1/api-keys/stats` - Get API key usage statistics

### **Analytics & Metrics**

- `GET /api/analytics/overview` - Platform usage statistics
- `GET /api/analytics/user/stats` - Individual user statistics
- `GET /api/analytics/trends` - Platform growth and usage trends

## 🧪 API Testing

### **Postman Collection**

The project includes a comprehensive Postman testing suite located in `server/tests.postman/`:

- **Collection**: `AI_Dreams_API.postman_collection.json` - Complete API endpoint tests
- **Environment**: `AI_Dreams_Environment.postman_environment.json` - Environment variables
- **Documentation**: `POSTMAN_TESTING_GUIDE.md` - Testing instructions and workflows

### **Testing Features**

- **Automated Workflows** - Sequential test execution with dependency management
- **Environment Variables** - Dynamic token management and base URL configuration
- **Response Validation** - Comprehensive assertion testing for all endpoints
- **Error Scenarios** - Testing for edge cases and error conditions
- **Authentication Flow** - Complete user registration, login, and protected route testing

## 🛠️ Technology Stack

### **Frontend Technologies**

- **React 19.1.1** - Latest React with concurrent features and improved performance
- **TypeScript 5.8.3** - Full type safety across the application
- **Vite 7.1.7** - Ultra-fast build tool and development server
- **Tailwind CSS 4.1.13** - Modern utility-first CSS framework with latest features
- **Radix UI** - Accessible, unstyled component primitives
- **React Router DOM 7.9.3** - Declarative client-side routing
- **Lucide React** - Beautiful, customizable SVG icons
- **Class Variance Authority** - Type-safe component variants
- **clsx & tailwind-merge** - Conditional CSS class utilities

### **Backend Technologies**

- **Node.js 18+** - JavaScript runtime with ES modules support
- **Express.js 5.1.0** - Fast, minimalist web framework
- **TypeScript 5.9.3** - Type-safe server development
- **MongoDB 8.19.2** - NoSQL document database
- **Mongoose 8.19.2** - Elegant MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)** - Secure authentication tokens
- **bcryptjs 3.0.2** - Password hashing and salting
- **Helmet 8.1.0** - Security middleware for Express
- **Morgan 1.10.1** - HTTP request logging
- **Express Rate Limit 8.1.0** - Rate limiting middleware
- **CORS 2.8.5** - Cross-origin resource sharing

### **Development & Build Tools**

- **Nodemon 3.1.10** - Auto-restart development server
- **ts-node 10.9.2** - TypeScript execution for Node.js
- **ESLint 9.36.0** - Code linting and formatting
- **PostCSS 8.4.0** - CSS processing and optimization
- **Autoprefixer 10.4.0** - Automatic CSS vendor prefixing

### **AI & External Services**

- **OpenRouter.ai** - Access to multiple LLM models for story generation
- **Stability AI** - Stable Diffusion for AI image generation
- **MongoDB Atlas** - Cloud-hosted database service

### **Deployment & Infrastructure**

- **Vercel** - Frontend deployment and hosting
- **Render/Railway** - Backend API deployment
- **Environment-based Configuration** - Secure API key management

## 🔒 Security

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS Protection** with proper origin configuration
- **Security Headers** via Helmet middleware
- **Environment Variables** for sensitive configuration

## 🚀 Production Readiness

### **✅ Backend Production Features**

- **Complete TypeScript Implementation** - Full type safety with comprehensive JSDoc documentation
- **Advanced Security** - Helmet middleware, CORS protection, rate limiting, and JWT authentication
- **Error Handling** - Centralized error handling with custom ApiError classes and proper HTTP status codes
- **Database Optimization** - MongoDB indexes, connection pooling, and optimized queries
- **API Testing Suite** - Complete Postman collection with environment configurations
- **Production Build** - TypeScript compilation with source maps and optimized output
- **Environment Configuration** - Secure environment-based API key management
- **Logging & Monitoring** - Morgan HTTP logging and comprehensive request tracking

### **✅ Frontend Production Features**

- **Modern React 19** - Latest React features with concurrent rendering and improved performance
- **TypeScript Excellence** - Full type coverage with strict TypeScript configuration
- **Optimized Build** - Vite 7 with tree-shaking, code splitting, and minimal bundle size
- **Responsive Design** - Mobile-first design with Tailwind CSS 4 and modern CSS features
- **Accessibility** - WCAG-compliant components using Radix UI primitives
- **Performance** - Lazy loading, optimized images, and efficient state management
- **Developer Experience** - Hot module replacement, fast refresh, and comprehensive linting

### **🧪 Testing & Quality Assurance**

- **API Testing** - Complete Postman test suite with automated workflows
- **Code Quality** - ESLint with TypeScript rules and consistent code formatting
- **Type Safety** - Strict TypeScript configuration preventing runtime errors
- **Security Testing** - Comprehensive security middleware and input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- **TypeScript First** - Use strict TypeScript configuration and comprehensive type definitions
- **Component Architecture** - Follow feature-based architecture with clear separation of concerns
- **Code Documentation** - Write comprehensive JSDoc comments for all functions and interfaces
- **Testing Strategy** - Add Postman tests for API endpoints and component tests for UI
- **Code Quality** - Use ESLint rules and maintain consistent code formatting
- **Security Practices** - Follow secure coding practices and validate all inputs
- **Performance** - Optimize bundle size and implement efficient state management
- **Accessibility** - Ensure WCAG compliance using Radix UI and semantic HTML

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**[anzirish](https://github.com/anzirish/)**

- **Project**: AI Dreams Visualizer - Transform Your Dreams into Stories
- **Version**: 2.0.0 (2025 Modern Stack Update)
- **Frontend**: React 19 + TypeScript + Vite 7 + Tailwind CSS 4
- **Backend**: Node.js + Express 5 + TypeScript + MongoDB
- **Status**: ✅ Production Ready with Modern Architecture
---

**🌟 Star this repository if you found it helpful!**
