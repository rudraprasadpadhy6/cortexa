import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Brain, ClipboardCheck, History, Bookmark, MessageSquare, Award } from 'lucide-react';

const SidebarLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="dashboard-layout animate-fade-in">
            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/upload" state={{ type: 'notes' }} className={`sidebar-link ${location.pathname === '/upload' && location.state?.type === 'notes' ? 'active' : ''}`}>
                        <FileText size={20} /> Generate Notes
                    </Link>
                    <Link to="/upload" state={{ type: 'quiz' }} className={`sidebar-link ${location.pathname === '/upload' && (location.state?.type === 'quiz' || location.pathname === '/upload' && !location.state?.type) ? 'active' : ''}`}>
                        <Brain size={20} /> Generate Quiz
                    </Link>
                    <Link to="/my-notes" className={`sidebar-link ${location.pathname === '/my-notes' || location.pathname.startsWith('/notes/') ? 'active' : ''}`}>
                        <FileText size={20} /> My Notes
                    </Link>
                    <Link to="/my-quizzes" className={`sidebar-link ${location.pathname === '/my-quizzes' || location.pathname.startsWith('/quiz/') ? 'active' : ''}`}>
                        <ClipboardCheck size={20} /> My Quizzes
                    </Link>
                    <Link to="/history" className={`sidebar-link ${location.pathname === '/history' ? 'active' : ''}`}>
                        <History size={20} /> History
                    </Link>
                    <Link to="/bookmarks" className={`sidebar-link ${location.pathname === '/bookmarks' ? 'active' : ''}`}>
                        <Bookmark size={20} /> Bookmarks
                    </Link>
                    <Link to="/badges" className={`sidebar-link ${location.pathname === '/badges' ? 'active' : ''}`}>
                        <Award size={20} /> Badges & Achievements
                    </Link>
                    <Link to="/feedback" className={`sidebar-link ${location.pathname === '/feedback' ? 'active' : ''}`}>
                        <MessageSquare size={20} /> Feedback
                    </Link>
                </nav>
            </aside>

            <main className="main-dashboard">
                {children}
            </main>
        </div>
    );
};

export default SidebarLayout;
