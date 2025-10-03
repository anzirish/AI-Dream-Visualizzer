# AI Dream Visualizer

## Introduction

AI Dream Visualizer is a full-stack web application that transforms users' dreams into meaningful experiences through AI-powered analysis, storytelling, and visual generation. The platform allows users to record their dreams, receive intelligent interpretations, generate accompanying narratives, and create stunning AI-generated images that bring their dreams to life. With built-in social features, users can share their dreams with the community and explore others' nocturnal adventures in a secure, authenticated environment.

## Project Type

Full-Stack

## Deployed App

Frontend: https://your-deployed-frontend.vercel.app

Backend: Firebase (Serverless)

Database: Firestore (Cloud Database)

## Directory Structure

```
ai-dream-visualizer/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ Auth/
│  │  ├─ DreamForm/
│  │  ├─ DreamCard/
│  │  ├─ CommunityFeed/
│  │  └─ ...
│  ├─ services/
│  │  ├─ firebase.js
│  │  ├─ openRouterAPI.js
│  │  └─ stableDiffusionAPI.js
│  ├─ context/
│  │  └─ AuthContext.js
│  ├─ pages/
│  │  ├─ Home.js
│  │  ├─ Dashboard.js
│  │  └─ Community.js
│  ├─ App.js
│  └─ index.js
├─ .env
├─ package.json
└─ README.md
```

## Video Walkthrough of the project

Attach a very short video walkthrough of all of the features [ 1 - 3 minutes ]

## Video Walkthrough of the codebase

Attach a very short video walkthrough of codebase [ 1 - 5 minutes ]

## Features

- User authentication with email/password using Firebase Auth
- Dream recording and storage in the Firestore database
- AI-powered dream analysis using OpenRouter.ai API
- Automatic story generation based on dream descriptions
- AI image generation using Stable Diffusion
- Personal dream journal with all saved dreams
- Public/private dream visibility toggle
- Community feed to explore other users' public dreams
- Responsive design for mobile and desktop
- Real-time data synchronization with Firestore

## Design Decisions or Assumptions

- Selected Firebase for serverless architecture, eliminating the need for custom backend development while providing robust authentication and real-time database capabilities
- Used OpenRouter.ai for flexible access to multiple LLM models and Stable Diffusion for high-quality image generation
- Dreams are stored with user references, allowing efficient querying of both personal dreams and public community content
- Implemented a simple boolean flag for public/private dream visibility
- Leveraged Firebase's client SDK to directly communicate with cloud services, reducing infrastructure complexity
- Built as a single-page application for a smooth user experience

## Installation & Getting started

```bash
git clone https://github.com/yourusername/ai-dream-visualizer.git
cd ai-dream-visualizer
npm install
npm start
```

## Usage

```bash
npm start
```

Include screenshots as necessary.

## Credentials

```
Email: demo@dreamvisualizer.com
Password: Demo@123
```

## APIs Used

- OpenRouter.ai API - AI text generation for dream analysis and storytelling
- Stable Diffusion API - AI image generation based on dream descriptions
- Firebase Authentication API - User management and authentication
- Firestore API - Real-time NoSQL database

## Technology Stack

- React
- Firebase Authentication
- Firestore
- OpenRouter.ai API
- Stable Diffusion
- Tailwind CSS
- React Router
