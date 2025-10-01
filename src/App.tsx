import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateDream from './pages/CreateDream';
import MyDreams from './pages/MyDreams';
import DreamDetail from './pages/DreamDetail';
import Navbar from './components/layout/NavBar.tsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 transition-colors duration-300">
          <Navbar />
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