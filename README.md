# 🌙 AI Dreams - Transform Your Dreams into Stories

[![Deploy Status](https://img.shields.io/badge/Status-Production%20-brightgreen)](https://github.com/anzirish/AI-Dream-Visualizzer)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019-blue)](https://ai-dream-visualizzer.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)](https://ai-dream-visualizzer.onrender.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB-green)](https://cloud.mongodb.com/)
[![AI](https://img.shields.io/badge/AI-OpenRouter%20%2B%20Stable%20Diffusion-purple)](https://openrouter.ai/)

## 🚀 Introduction

**AI Dreams** is a cutting-edge full-stack web application that transforms users' dreams into captivating experiences through advanced AI technology. The platform combines dream journaling with AI-powered storytelling and image generation, creating an immersive community where users can share their nocturnal adventures and explore the dreams of others.

### ✨ What Makes AI Dreams Special

- **🤖 AI-Powered Storytelling**: Transform raw dream descriptions into engaging, immersive narratives
- **🎨 Dream Visualization**: Generate stunning AI images that bring dreams to life
- **👥 Community Features**: Share dreams publicly or keep them private
- **🔐 Secure Authentication**: JWT-based authentication with user management
- **📱 Responsive Design**: Seamless experience across all devices
- **⚡ Real-time Updates**: Live data synchronization and updates
- **🔑 Community API Keys**: Shared resource pool for AI services

## 📁 Project Architecture

```
ai-dreams/
├── 🎨 Frontend (React + TypeScript)
│   ├── src/
│   │   ├── features/           # Feature-based architecture
│   │   │   ├── auth/          # Authentication (components, contexts, hooks, types)
│   │   │   │   ├── components/
│   │   │   │   ├── contexts/
│   │   │   │   ├── hooks/
│   │   │   │   └── types/
│   │   │   └── dreams/        # Dream management (components, services, types)
│   │   │       ├── components/
│   │   │       ├── services/
│   │   │       └── types/
│   │   ├── shared/            # Shared components & utilities
│   │   │   ├── components/    # Reusable UI components (layout, ui)
│   │   │   │   ├── layout/
│   │   │   │   └── ui/
│   │   │   ├── styles/        # Global styles
│   │   │   └── utils/         # Utility functions & validation
│   │   ├── services/          # API communication layer
│   │   │   └── api/          # Backend API integration
│   │   ├── pages/             # Route components
│   │   │   ├── auth/         # Login, Signup pages
│   │   │   └── dreams/       # Dream-related pages
│   │   ├── config/           # Configuration files
│   │   ├── assets/           # Static assets (images, icons)
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Application entry point
│   ├── public/               # Public static assets
│   ├── dist/                 # Production build output
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite build configuration
│
├── 🔧 Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── dreamController.ts
│   │   │   └── aiController.ts
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── User.ts
│   │   │   ├── Dream.ts
│   │   │   └── ApiKey.ts
│   │   ├── routes/            # API route definitions
│   │   │   ├── v1/           # API version 1 routes
│   │   │   │   ├── auth.ts
│   │   │   │   ├── dreams.ts
│   │   │   │   ├── ai.ts
│   │   │   │   ├── apiKeys.ts
│   │   │   │   └── index.ts
│   │   │   └── analytics.ts   # Analytics endpoints
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.ts       # JWT authentication
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── services/          # Business logic
│   │   │   └── aiService.ts   # AI integration
│   │   ├── utils/             # Utility functions
│   │   │   └── jwt.ts         # JWT operations
│   │   └── config/            # Configuration files
│   │       ├── database.ts
│   │       └── apiDocs.ts
│   ├── index.ts              # Server entry point
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript configuration
│
└── 🔧 Configuration
    ├── .env                  # Environment variables (local)
    ├── .env.example          # Environment variables template
    ├── .gitignore           # Git ignore rules
    ├── components.json      # UI components configuration
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── tsconfig.json        # TypeScript configuration
    ├── vite.config.ts       # Vite build configuration
    └── README.md            # This file
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

#### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm test             # Run tests (Jest)
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

### **Authentication**

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout

### **Dreams**

- `POST /api/v1/dreams` - Create new dream
- `GET /api/v1/dreams/my` - Get user's dreams
- `GET /api/v1/dreams/public` - Get public dreams feed
- `GET /api/v1/dreams/:id` - Get specific dream
- `PUT /api/v1/dreams/:id` - Update dream
- `DELETE /api/v1/dreams/:id` - Delete dream

### **AI Generation**

- `POST /api/v1/ai/generate-story` - Generate dream story
- `POST /api/v1/ai/generate-image` - Generate dream image
- `POST /api/v1/ai/generate-complete` - Generate both story and image

### **API Keys**

- `POST /api/v1/api-keys` - Add community API key
- `GET /api/v1/api-keys/my` - Get user's contributed keys
- `GET /api/v1/api-keys/stats` - Get API key statistics

### **Analytics**

- `GET /api/analytics/overview` - Platform statistics
- `GET /api/analytics/user/stats` - User statistics
- `GET /api/analytics/trends` - Platform trends

## 🛠️ Technology Stack

### **Frontend**

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icons

### **Backend**

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **MongoDB** - Document database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Express Rate Limit** - Rate limiting middleware

### **AI & External Services**

- **OpenRouter.ai** - Access to multiple LLM models
- **Stability AI** - Stable Diffusion image generation
- **MongoDB Atlas** - Cloud database hosting

## 🔒 Security

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS Protection** with proper origin configuration
- **Security Headers** via Helmet middleware
- **Environment Variables** for sensitive configuration

## 🚀 Production Readiness

### **✅ Backend Ready**

- Complete TypeScript documentation
- Comprehensive error handling
- Security middleware implemented
- Database optimization with indexes
- API testing suite with Postman
- Production build configuration

### **✅ Frontend Ready**

- Modern React 19 with TypeScript
- Optimized Vite build (304KB bundle)
- Responsive design for all devices
- Accessibility-compliant components
- Production environment configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow TypeScript best practices
- Write comprehensive JSDoc comments
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**[anzirish](https://github.com/anzirish/)**

- **Project**: AI Dreams Visualizer - Transform Your Dreams into Stories
- **Version**: 1.0.0
- **Associated Id : Mongo/Vercel/Render**: oknoktrial@gmail.com
- **Status**: ✅ In prdouction

---

**🌟 Star this repository if you found it helpful!**
