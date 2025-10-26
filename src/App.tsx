import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/features/auth";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CreateDream from "./pages/dreams/CreateDream";
import MyDreams from "./pages/dreams/MyDreams";
import DreamDetail from "./pages/dreams/DreamDetail";
import { NavBar } from "@/shared/components/layout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <NavBar />
          <Routes>
            {/* Public routes - no auth required */}
            <Route path="/" element={<Home />} />
            <Route path="/dream/:dreamId" element={<DreamDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes - auth required */}
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
