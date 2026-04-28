import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import NotesDisplay from './pages/NotesDisplay';
import QuizPlayer from './pages/QuizPlayer';
import Results from './pages/Results';
import MyQuizzes from './pages/MyQuizzes';
import History from './pages/History';
import MyNotes from './pages/MyNotes';
import Bookmarks from './pages/Bookmarks';
import Badges from './pages/Badges';
import Feedback from './pages/Feedback';
import AdminPanel from './pages/AdminPanel';

import SidebarLayout from './components/SidebarLayout';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><SidebarLayout><Dashboard /></SidebarLayout></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><SidebarLayout><Upload /></SidebarLayout></ProtectedRoute>} />
          <Route path="/notes/:id" element={<ProtectedRoute><SidebarLayout><NotesDisplay /></SidebarLayout></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><SidebarLayout><QuizPlayer /></SidebarLayout></ProtectedRoute>} />
          <Route path="/quiz-results" element={<ProtectedRoute><SidebarLayout><Results /></SidebarLayout></ProtectedRoute>} />
          <Route path="/my-quizzes" element={<ProtectedRoute><SidebarLayout><MyQuizzes /></SidebarLayout></ProtectedRoute>} />
          <Route path="/my-notes" element={<ProtectedRoute><SidebarLayout><MyNotes /></SidebarLayout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><SidebarLayout><History /></SidebarLayout></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><SidebarLayout><Bookmarks /></SidebarLayout></ProtectedRoute>} />
          <Route path="/badges" element={<ProtectedRoute><SidebarLayout><Badges /></SidebarLayout></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><SidebarLayout><Feedback /></SidebarLayout></ProtectedRoute>} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
