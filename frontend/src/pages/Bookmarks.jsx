import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Bookmark, FileText, Brain, ChevronRight, Clock } from 'lucide-react';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const [notesRes, quizRes] = await Promise.all([
                    api.get('/notes'),
                    api.get('/quiz')
                ]);
                
                const notes = notesRes.data.filter(n => n.isBookmarked).map(n => ({ ...n, itemType: 'note' }));
                const quizzes = quizRes.data.filter(q => q.isBookmarked).map(q => ({ ...q, itemType: 'quiz' }));
                
                const combined = [...notes, ...quizzes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                
                setBookmarks(combined);
            } catch (err) {
                console.error("Error fetching bookmarks:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarks();
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;

    return (
        <div className="animate-fade-in">
            <h2 className="page-title">My Bookmarks</h2>
            <p className="page-subtitle" style={{ marginBottom: '2.5rem', textAlign: 'left', marginLeft: 0 }}>
                Quick access to your most important notes and quizzes.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {bookmarks.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', gridColumn: '1 / -1' }}>
                        <Bookmark size={48} className="text-muted" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3>No bookmarks yet</h3>
                        <p className="text-muted">Click the bookmark icon on any note or quiz result to save it here.</p>
                    </div>
                ) : (
                    bookmarks.map((item) => (
                        <Link 
                            to={item.itemType === 'note' ? `/notes/${item._id}` : `/quiz/${item._id}`} 
                            key={item._id} 
                            className="glass-panel" 
                            style={{ 
                                padding: '1.5rem', 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '1rem',
                                transition: 'transform 0.3s ease',
                                textDecoration: 'none',
                                color: 'inherit'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ 
                                    padding: '0.6rem', 
                                    borderRadius: '10px', 
                                    background: item.itemType === 'note' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                    color: item.itemType === 'note' ? 'var(--primary)' : 'var(--accent)'
                                }}>
                                    {item.itemType === 'note' ? <FileText size={20} /> : <Brain size={20} />}
                                </div>
                                <Bookmark size={18} fill="currentColor" className="text-primary" />
                            </div>
                            
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', height: '2.8rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    {item.itemType === 'note' ? item.title : item.topic}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <Clock size={12} />
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                                View {item.itemType === 'note' ? 'Notes' : 'Quiz'} <ChevronRight size={16} />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Bookmarks;
