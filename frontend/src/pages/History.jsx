import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FileText, Brain, Calendar, Clock, ChevronRight } from 'lucide-react';

const History = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [notesRes, quizRes] = await Promise.all([
                    api.get('/notes'),
                    api.get('/quiz')
                ]);
                
                const combined = [
                    ...notesRes.data.map(n => ({ ...n, itemType: 'note' })),
                    ...quizRes.data.map(q => ({ ...q, itemType: 'quiz' }))
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                setActivities(combined);
            } catch (err) {
                console.error("Error fetching history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;

    return (
        <div className="animate-fade-in">
            <h2 className="page-title">Overall History</h2>
            <p className="page-subtitle" style={{ marginBottom: '2.5rem', textAlign: 'left', marginLeft: 0 }}>
                A complete timeline of your learning activities, securely saved to your account.
            </p>

            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                {activities.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <Clock size={48} className="text-muted" style={{ marginBottom: '1rem' }} />
                        <h3>No activity yet</h3>
                        <p className="text-muted">Generate notes or take a quiz to see your history here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {activities.map((item, index) => (
                            <Link 
                                key={item._id} 
                                to={item.itemType === 'note' ? `/notes/${item._id}` : `/quiz/${item._id}`}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    padding: '1.25rem 2rem', 
                                    borderBottom: index === activities.length - 1 ? 'none' : '1px solid var(--glass-border)',
                                    transition: 'background 0.2s',
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ 
                                        padding: '0.75rem', 
                                        borderRadius: '12px', 
                                        background: item.itemType === 'note' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                        color: item.itemType === 'note' ? 'var(--primary)' : 'var(--accent)'
                                    }}>
                                        {item.itemType === 'note' ? <FileText size={20} /> : <Brain size={20} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                                            {item.itemType === 'note' ? item.title : item.topic}
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                            <span style={{ textTransform: 'capitalize' }}>
                                                {item.itemType} {item.itemType === 'note' ? `(${item.type})` : `(${item.difficulty})`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                                    {item.itemType === 'quiz' && item.score !== undefined && (
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{item.score}/{item.totalQuestions}</span>
                                    )}
                                    <ChevronRight size={20} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
