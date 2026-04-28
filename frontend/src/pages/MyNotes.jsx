import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FileText, Calendar, BookOpen, ChevronRight, Clock } from 'lucide-react';

const MyNotes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get('/notes');
                setNotes(res.data);
            } catch (err) {
                console.error("Error fetching notes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;

    return (
        <div className="animate-fade-in">
            <h2 className="page-title">My Notes</h2>
            <p className="page-subtitle" style={{ marginBottom: '2.5rem', textAlign: 'left', marginLeft: 0 }}>
                Access all your AI-generated study materials and summaries.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {notes.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', gridColumn: '1 / -1' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <BookOpen size={40} className="text-muted" />
                        </div>
                        <h3>No notes generated yet</h3>
                        <p className="text-muted">Start by uploading content or pasting text to get your study notes.</p>
                        <Link to="/upload" state={{ type: 'notes' }} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                            Generate Notes
                        </Link>
                    </div>
                ) : (
                    notes.map((note) => (
                        <Link 
                            to={`/notes/${note._id}`} 
                            key={note._id} 
                            className="glass-panel" 
                            style={{ 
                                padding: '1.5rem', 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '1rem',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'all 0.3s ease',
                                borderLeft: '4px solid transparent'
                            }} 
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
                            }} 
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'transparent';
                                e.currentTarget.style.background = 'var(--glass-bg)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ 
                                    background: note.type === 'short' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                                    padding: '0.75rem', 
                                    borderRadius: '10px', 
                                    color: note.type === 'short' ? 'var(--accent)' : 'var(--primary)' 
                                }}>
                                    <FileText size={20} />
                                </div>
                                <span style={{ 
                                    fontSize: '0.7rem', 
                                    textTransform: 'uppercase', 
                                    fontWeight: 'bold', 
                                    background: 'rgba(255,255,255,0.05)', 
                                    padding: '0.25rem 0.6rem', 
                                    borderRadius: '20px',
                                    color: 'var(--text-muted)'
                                }}>
                                    {note.type}
                                </span>
                            </div>
                            
                            <div>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {note.title}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <Clock size={12} />
                                    {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                                Read Notes <ChevronRight size={16} />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyNotes;
