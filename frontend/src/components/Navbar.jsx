import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { BrainCircuit, LogOut, User, Sun, Moon, Search, FileText, HelpCircle } from 'lucide-react';
import api from '../api/axios';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    if (location.pathname === '/admin') {
        return null;
    }

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ notes: [], quizzes: [] });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery.trim() || !user) {
                setSearchResults({ notes: [], quizzes: [] });
                return;
            }
            try {
                const [notesRes, quizzesRes] = await Promise.all([
                    api.get('/notes'),
                    api.get('/quiz')
                ]);
                
                const query = searchQuery.toLowerCase();
                const filteredNotes = notesRes.data.filter(note => 
                    note.title?.toLowerCase().includes(query) || 
                    note.content?.toLowerCase().includes(query)
                ).slice(0, 5);

                const filteredQuizzes = quizzesRes.data.filter(quiz => 
                    quiz.topic?.toLowerCase().includes(query)
                ).slice(0, 5);

                setSearchResults({ notes: filteredNotes, quizzes: filteredQuizzes });
            } catch (error) {
                console.error("Error fetching search results", error);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleResultClick = (path) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        navigate(path);
    };

    return (
        <nav className="glass-nav">
            <Link to="/" className="nav-brand" style={{ gap: '10px' }}>
                <img 
                    src="/logo.jpeg" 
                    alt="Cortexa Logo" 
                    style={{ 
                        width: '42px', 
                        height: '42px', 
                        objectFit: 'cover', 
                        borderRadius: '50%',
                        border: theme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }} 
                />
                Cortexa
            </Link>
            <div className="nav-links">
                {user && location.pathname !== '/' ? (
                    <>
                        <button 
                            onClick={toggleTheme} 
                            className="btn btn-outline btn-icon"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <div className="search-container hide-mobile" ref={searchRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '0.4rem 1rem' }}>
                                <Search size={16} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
                                <input 
                                    type="text" 
                                    placeholder="Search notes & quizzes..." 
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setIsSearchOpen(true);
                                    }}
                                    onFocus={() => setIsSearchOpen(true)}
                                    style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', width: '200px', fontSize: '0.9rem' }}
                                />
                            </div>

                            {isSearchOpen && searchQuery.trim() && (searchResults.notes.length > 0 || searchResults.quizzes.length > 0) && (
                                <div style={{ 
                                    position: 'absolute', top: '120%', left: 0, right: 0, 
                                    background: 'var(--bg-card)', border: '1px solid var(--border)', 
                                    borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
                                    zIndex: 50, maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' 
                                }}>
                                    {searchResults.notes.length > 0 && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Notes</div>
                                            {searchResults.notes.map(note => (
                                                <div 
                                                    key={note._id} 
                                                    onClick={() => handleResultClick(`/notes/${note._id}`)}
                                                    style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <FileText size={16} style={{ marginRight: '8px', color: 'var(--primary)', flexShrink: 0 }} />
                                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {searchResults.quizzes.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Quizzes</div>
                                            {searchResults.quizzes.map(quiz => (
                                                <div 
                                                    key={quiz._id} 
                                                    onClick={() => handleResultClick(`/quiz/${quiz._id}`)}
                                                    style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <HelpCircle size={16} style={{ marginRight: '8px', color: 'var(--accent)', flexShrink: 0 }} />
                                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quiz.topic}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {isSearchOpen && searchQuery.trim() && searchResults.notes.length === 0 && searchResults.quizzes.length === 0 && (
                                <div style={{ 
                                    position: 'absolute', top: '120%', left: 0, right: 0, 
                                    background: 'var(--bg-card)', border: '1px solid var(--border)', 
                                    borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
                                    zIndex: 50, padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' 
                                }}>
                                    No results found.
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-main)]" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={18} color="white" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.2' }}>{user.username}</span>
                                <span style={{ fontWeight: '500', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{user.email}</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline">
                            <LogOut size={18} /> <span className="hide-mobile">Logout</span>
                        </button>
                    </>
                ) : user ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                         <button 
                            onClick={toggleTheme} 
                            className="btn btn-outline btn-icon"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                        <button onClick={handleLogout} className="btn btn-outline">
                            <LogOut size={18} /> <span className="hide-mobile">Logout</span>
                        </button>
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={toggleTheme} 
                            className="btn btn-outline btn-icon"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <Link to="/login" className="btn btn-outline">Login</Link>
                        <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
