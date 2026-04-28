import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ShieldCheck, User, Star, Calendar, Lock, Users, MessageSquare, Mail, Award } from 'lucide-react';

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'feedback'

    const averageRating = feedbacks.length > 0 
        ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
        : 0;

    const handleLogin = (e) => {
        e.preventDefault();
        // Hardcoded admin check as per request
        if (username === 'admin' && password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid Admin Credentials');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    // Try to fetch both feedbacks and users
                    // We use /api/admin/ endpoints if available, otherwise fallback
                    const [fbRes, userRes] = await Promise.all([
                        api.get('/admin/feedback', { headers: { 'x-admin-key': password } }).catch(() => ({ data: [] })),
                        api.get('/admin/users', { headers: { 'x-admin-key': password } }).catch(() => ({ data: [] }))
                    ]);
                    setFeedbacks(fbRes.data);
                    setUsers(userRes.data);
                } catch (err) {
                    console.error("Admin data fetch error:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5rem' }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <img 
                            src="/logo.jpeg" 
                            alt="Cortexa Logo" 
                            style={{ 
                                width: '64px', 
                                height: '64px', 
                                objectFit: 'cover', 
                                borderRadius: '50%',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)' 
                            }} 
                        />
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h3>Admin Access</h3>
                        <p className="text-muted">Enter admin credentials to access oversight.</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Admin Username</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Admin Password</label>
                            <input 
                                type="password" 
                                className="form-input" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2 className="page-title">Admin Command Center</h2>
                    <p className="page-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>
                        Monitoring {users.length} users and {feedbacks.length} feedback submissions.
                        <br/>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: 'var(--accent)', fontWeight: '600', fontSize: '0.9rem' }}>
                            <Star size={16} fill="currentColor" />
                            Average Rating: {averageRating} / 5.0
                        </span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '0.4rem', borderRadius: '14px', border: '1.5px solid var(--border)' }}>
                        <button 
                            onClick={() => setActiveTab('users')}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.6rem 1.25rem', borderRadius: '10px', 
                                background: activeTab === 'users' ? 'var(--primary)' : 'transparent', 
                                color: activeTab === 'users' ? 'white' : 'var(--text-secondary)', 
                                fontWeight: '700', fontSize: '0.85rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                        >
                            <Users size={16} /> Users
                        </button>
                        <button 
                            onClick={() => setActiveTab('feedback')}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.6rem 1.25rem', borderRadius: '10px', 
                                background: activeTab === 'feedback' ? 'var(--primary)' : 'transparent', 
                                color: activeTab === 'feedback' ? 'white' : 'var(--text-secondary)', 
                                fontWeight: '700', fontSize: '0.85rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                        >
                            <MessageSquare size={16} /> Feedback
                        </button>
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} className="btn btn-outline" style={{ border: '1.5px solid var(--border)' }}>Logout</button>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="animate-pulse">Accessing secure database records...</div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    {activeTab === 'users' ? (
                        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Active Users</h3>
                            </div>
                            {users.length === 0 ? (
                                <div style={{ padding: '4rem', textAlign: 'center' }}>
                                    <Users size={48} className="text-muted" style={{ marginBottom: '1rem' }} />
                                    <p>No user records found in the database.</p>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                <th style={{ padding: '1.25rem 2rem' }}>User</th>
                                                <th style={{ padding: '1.25rem 1rem' }}>Role</th>
                                                <th style={{ padding: '1.25rem 1rem' }}>Achievements</th>
                                                <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Joined On</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                    <td style={{ padding: '1.25rem 2rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <div style={{ background: 'var(--primary)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                                <User size={18} />
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: '700' }}>{user.username}</div>
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                                    <Mail size={12} /> {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1rem' }}>
                                                        <span style={{ 
                                                            padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                                                            background: user.role === 'admin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                                            color: user.role === 'admin' ? 'var(--accent)' : 'var(--primary)',
                                                            textTransform: 'capitalize'
                                                        }}>
                                                            {user.role || 'user'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                            {user.badges?.length > 0 ? user.badges.map(b => (
                                                                <div key={b} title={b} style={{ color: '#fbbf24' }}><Award size={16} /></div>
                                                            )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No badges yet</span>}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {feedbacks.length === 0 ? (
                                <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
                                    <ShieldCheck size={48} className="text-muted" style={{ marginBottom: '1rem' }} />
                                    <h3>No feedback records found</h3>
                                </div>
                            ) : (
                                feedbacks.map((fb) => (
                                    <div key={fb._id} className="glass-panel" style={{ padding: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%', color: 'white' }}>
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{fb.username || 'Anonymous'}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                        <Calendar size={12} /> {new Date(fb.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.2rem', color: '#fbbf24' }}>
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={16} fill={s <= fb.rating ? 'currentColor' : 'none'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ lineHeight: '1.6', color: 'var(--text-main)', fontSize: '1.05rem', fontStyle: 'italic' }}>
                                            "{fb.message}"
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
