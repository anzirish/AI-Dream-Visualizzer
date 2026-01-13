import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/features/auth";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CreateDream from "./pages/dreams/CreateDream";
import MyDreams from "./pages/dreams/MyDreams";
import DreamDetail from "./pages/dreams/DreamDetail";
import ApiKeySettings from "./pages/ApiKeySettings";
import { NavBar } from "@/shared/components/layout";
// Environment variables are automatically loaded from env.ts

/**
 * App Component - Root Application Component
 */
function App() {
  return (
    // Authentication context provider - manages global auth state
    <AuthProvider>
      {/* React Router for client-side navigation */}
      <Router>
        <div className="min-h-screen bg-white">
          {/* Persistent navigation bar across all pages */}
          <NavBar />

          {/* Application routes configuration */}
          <Routes>
            {/* Public Routes - Accessible without authentication */}
            <Route path="/" element={<Home />} />
            <Route path="/dream/:dreamId" element={<DreamDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes - Require user authentication */}
            <Route
              path="/create-dream"
              element={
                <ProtectedRoute>
                  <CreateDream />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-dreams"
              element={
                <ProtectedRoute>
                  <MyDreams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/api-settings"
              element={
                <ProtectedRoute>
                  <ApiKeySettings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
