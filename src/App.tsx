import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/features/auth";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CreateDream from "./pages/dreams/CreateDream";
import MyDreams from "./pages/dreams/MyDreams";
import DreamDetail from "./pages/dreams/DreamDetail";
import { NavBar } from "@/shared/components/layout";

/**
 * App Component - Root Application Component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dream/:dreamId" element={<DreamDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/create-dream"
              element={<CreateDream />}
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
