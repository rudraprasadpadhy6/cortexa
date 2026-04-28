import { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api/axios';
import { BookOpen, HelpCircle, FileText, Brain, Award, TrendingUp, CheckCircle, Clock, ArrowUpRight, Flame, Target, Zap, Upload, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const [quizzes, setQuizzes] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // State for Overview/Insights tabs

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [quizRes, notesRes] = await Promise.all([
                    api.get('/quiz'),
                    api.get('/notes')
                ]);
                setQuizzes(quizRes.data);
                setNotes(notesRes.data);
            } catch (err) {
                console.error("Dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const metrics = useMemo(() => {
        const totalQuizzes = quizzes.length;
        const totalNotes = notes.length;
        
        // Calculate average score
        const avgScore = totalQuizzes > 0 
            ? Math.round(quizzes.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) / totalQuizzes) 
            : 0;

        // Topic Wise Accuracy
        const topicMap = {};
        quizzes.forEach(q => {
            if (!topicMap[q.topic]) topicMap[q.topic] = { score: 0, total: 0 };
            topicMap[q.topic].score += q.score;
            topicMap[q.topic].total += q.totalQuestions;
        });

        const topicAccuracy = Object.keys(topicMap).map(topic => ({
            name: topic,
            value: Math.round((topicMap[topic].score / topicMap[topic].total) * 100)
        })).sort((a, b) => b.value - a.value);

        const weakTopics = [...topicAccuracy]
            .sort((a, b) => a.value - b.value)
            .slice(0, 3);

        // Performance Trend for sparklines (last 7 activities)
        const recentPerformance = [...quizzes].reverse().slice(0, 7).map((q, i) => ({
            value: Math.round((q.score / q.totalQuestions) * 100)
        }));

        const performanceData = [...quizzes]
            .reverse()
            .map((q, idx) => ({
                name: `Q${idx + 1}`,
                score: Math.round((q.score / q.totalQuestions) * 100),
                topic: q.topic
            }));

        const noteTrend = [...notes].reverse().slice(0, 7).map((n, i) => ({ value: i + 1 }));

        // Calculate Streak
        const activityDates = [...notes, ...quizzes]
            .map(a => new Date(new Date(a.createdAt).toDateString()).getTime());
        const uniqueDates = [...new Set(activityDates)].sort((a, b) => b - a);
        
        let streak = 0;
        if (uniqueDates.length > 0) {
            const today = new Date();
            today.setHours(0,0,0,0);
            const todayTime = today.getTime();
            const yesterdayTime = todayTime - 86400000;
            
            if (uniqueDates[0] === todayTime || uniqueDates[0] === yesterdayTime) {
                streak = 1;
                for (let i = 1; i < uniqueDates.length; i++) {
                    if (uniqueDates[i-1] - uniqueDates[i] === 86400000) streak++;
                    else break;
                }
            }
        }

        return {
            totalQuizzes,
            totalNotes,
            avgScore,
            topicAccuracy,
            weakTopics,
            recentPerformance,
            performanceData,
            noteTrend,
            streak
        };
    }, [quizzes, notes]);

    const COLORS = ['#6366F1', '#8B5CF6', '#34D399', '#FBBF24', '#F87171'];
    const chartColor = theme === 'dark' ? '#818CF8' : '#6366F1';

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
            <div className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>Syncing with your neural network...</div>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="page-title" style={{ marginBottom: '0.25rem' }}>Welcome back, {user?.username} 👋</h2>
                    <p className="page-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>
                        Here's how your learning journey is progressing.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.4rem', borderRadius: '14px', border: '1.5px solid var(--border)' }}>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        style={{ 
                            padding: '0.6rem 1.25rem', 
                            borderRadius: '10px', 
                            background: activeTab === 'overview' ? 'var(--primary)' : 'transparent', 
                            color: activeTab === 'overview' ? 'white' : 'var(--text-secondary)', 
                            fontWeight: '700', 
                            fontSize: '0.85rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >Overview</button>
                    <button 
                        onClick={() => setActiveTab('insights')}
                        style={{ 
                            padding: '0.6rem 1.25rem', 
                            borderRadius: '10px', 
                            background: activeTab === 'insights' ? 'var(--primary)' : 'transparent', 
                            color: activeTab === 'insights' ? 'white' : 'var(--text-secondary)', 
                            fontWeight: '700', 
                            fontSize: '0.85rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >Insights</button>
                </div>
            </header>
            
            {/* Account Profile Card - New section to confirm persistence */}
            <div className="glass-panel" style={{ 
                marginBottom: '2rem', 
                padding: '1.25rem 2rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}>
                        <User size={24} color="white" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Logged in with</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user?.email}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: '700', fontSize: '0.9rem', background: 'rgba(34, 197, 94, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                    <CheckCircle size={18} />
                    <span>Cloud Synced</span>
                </div>
            </div>

            {/* Welcome Box - Redesigned for visual excellence */}
            <div className="animate-fade-in" style={{ 
                background: 'var(--bg-card)', 
                borderRadius: '28px', 
                padding: '0', 
                marginBottom: '3rem', 
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{ flex: 1.2, padding: '3rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        background: 'rgba(99, 102, 241, 0.1)', 
                        padding: '0.4rem 1rem', 
                        borderRadius: '20px', 
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                        <Zap size={16} color="var(--primary)" fill="var(--primary)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Cortexa</span>
                    </div>
                    
                    <h3 style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        Accelerate your <span style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Academic Mastery</span>.
                    </h3>
                    
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '600px', marginBottom: '2rem' }}>
                        It is a smart learning space. Easily turn your study material into clear, structured notes and interactive quizzes. Practice with different difficulty levels to test your understanding. Track your progress and identify areas to improve. Learn smarter, stay consistent, and achieve better results.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/upload" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', borderRadius: '14px', fontWeight: '700' }}>
                            Start Generating
                        </Link>
                        <button 
                            onClick={() => setActiveTab('insights')}
                            className="btn btn-outline" 
                            style={{ padding: '0.8rem 1.8rem', borderRadius: '14px', fontWeight: '700' }}
                        >
                            View Insights
                        </button>
                    </div>
                </div>

                <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '2rem',
                    position: 'relative'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '2rem',
                        width: '100%',
                        maxWidth: '320px',
                        position: 'relative'
                    }}>
                        {/* Connecting Line */}
                        <div style={{ 
                            position: 'absolute', 
                            left: '27px', 
                            top: '40px', 
                            bottom: '40px', 
                            width: '2px', 
                            background: 'linear-gradient(to bottom, var(--primary), var(--secondary))',
                            opacity: 0.3
                        }}></div>

                        {[
                            { icon: <Upload size={24} />, title: 'Upload Material', desc: 'PDF, Images, or Text', color: 'var(--primary)' },
                            { icon: <Brain size={24} />, title: 'AI Generation', desc: 'Crafting Smart Notes', color: 'var(--secondary)' },
                            { icon: <Award size={24} />, title: 'Master Content', desc: 'Quizzes & Badges', color: '#fbbf24' }
                        ].map((step, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                                <div style={{ 
                                    width: '56px', 
                                    height: '56px', 
                                    borderRadius: '16px', 
                                    background: 'var(--bg-card)', 
                                    border: `2px solid ${step.color}`,
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    color: step.color,
                                    boxShadow: `0 0 20px ${step.color}20`
                                }}>
                                    {step.icon}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{step.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="animate-fade-in">
                {activeTab === 'overview' ? (
                    <>
                        {/* Metrics Row */}
                        <div className="metric-grid">
                            <div className="metric-card-enhanced">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Notes Completed</h4>
                                        <div style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem' }}>{metrics.totalNotes}</div>
                                        <div className="trend-indicator trend-up"><ArrowUpRight size={14} /> +{notes.slice(0,5).length} this week</div>
                                    </div>
                                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px', height: 'fit-content' }}>
                                        <FileText size={20} color="var(--primary)" />
                                    </div>
                                </div>
                                <div className="sparkline-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={metrics.noteTrend}>
                                            <Area type="monotone" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="metric-card-enhanced">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Quizzes Finished</h4>
                                        <div style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem' }}>{metrics.totalQuizzes}</div>
                                        <div className="trend-indicator trend-up"><ArrowUpRight size={14} /> +{quizzes.slice(0,3).length} this week</div>
                                    </div>
                                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem', borderRadius: '12px', height: 'fit-content' }}>
                                        <Brain size={20} color="var(--success)" />
                                    </div>
                                </div>
                                <div className="sparkline-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={metrics.recentPerformance}>
                                            <Area type="monotone" dataKey="value" stroke="var(--success)" fill="var(--success)" fillOpacity={0.1} strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="metric-card-enhanced">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Avg. Accuracy</h4>
                                        <div style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem' }}>{metrics.avgScore}%</div>
                                        <div className="trend-indicator trend-up"><ArrowUpRight size={14} /> +5.2% this week</div>
                                    </div>
                                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '12px', height: 'fit-content' }}>
                                        <Target size={20} color="var(--info)" />
                                    </div>
                                </div>
                                <div className="sparkline-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={metrics.recentPerformance}>
                                            <Area type="monotone" dataKey="value" stroke="var(--info)" fill="var(--info)" fillOpacity={0.1} strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="metric-card-enhanced">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Study Streak</h4>
                                        <div style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem' }}>{metrics.streak} Days</div>
                                        <div className="trend-indicator" style={{ color: 'var(--warning)' }}>{metrics.streak > 0 ? "Keep it up! 🔥" : "Start today! ⚡"}</div>
                                    </div>
                                    <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '0.75rem', borderRadius: '12px', height: 'fit-content' }}>
                                        <Flame size={20} color="var(--warning)" />
                                    </div>
                                </div>
                                <div className="sparkline-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[{v:1},{v:3},{v:2},{v:5},{v:4},{v:6},{v:metrics.streak || 1}]}>
                                            <Area type="monotone" dataKey="v" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.1} strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Learning Progress & Activity Row */}
                        <div className="dashboard-grid" style={{ marginTop: '2.5rem' }}>
                            <div className="chart-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <TrendingUp size={20} color="var(--primary)" /> Learning Progress
                                    </h3>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                        Performance over time
                                    </div>
                                </div>
                                
                                <div style={{ height: '300px', width: '100%' }}>
                                    {quizzes.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={metrics.performanceData}>
                                                <defs>
                                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                                                <Area type="monotone" dataKey="score" stroke={chartColor} strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '2px dashed var(--border)', borderRadius: '16px' }}>Take a quiz to see your progress!</div>
                                    )}
                                </div>
                            </div>

                            <div className="chart-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <BookOpen size={20} color="var(--primary)" /> Activity
                                    </h3>
                                    <Link to="/history" style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)' }}>See all</Link>
                                </div>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {notes.slice(0, 3).map(note => (
                                        <Link to={`/notes/${note._id}`} key={note._id} className="activity-link">
                                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem', borderRadius: '10px' }}>
                                                <FileText size={18} color="var(--primary)" />
                                            </div>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{note.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Generated Notes</div>
                                            </div>
                                        </Link>
                                    ))}
                                    {quizzes.slice(0, 2).map(quiz => (
                                        <Link to={`/quiz/${quiz._id}`} key={quiz._id} className="activity-link">
                                            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '0.5rem', borderRadius: '10px' }}>
                                                <CheckCircle size={18} color="var(--success)" />
                                            </div>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{quiz.topic}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Quiz • {quiz.score}/{quiz.totalQuestions}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}

                {/* Performance Analytics Grid (Only visible in Insights tab as per latest request) */}
                {activeTab === 'insights' && (
                    <div className="performance-grid animate-fade-in" style={{ marginTop: '2.5rem' }}>
                        <div className="performance-card">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Target size={18} color="var(--primary)" /> Topic Wise Accuracy
                            </h3>
                            <div style={{ height: '220px', position: 'relative' }}>
                                {metrics.topicAccuracy.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={metrics.topicAccuracy}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {metrics.topicAccuracy.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No data available</div>
                                )}
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{metrics.avgScore}%</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Overall</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                                {metrics.topicAccuracy.slice(0, 4).map((topic, i) => (
                                    <div key={topic.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '600' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                                        {topic.name}: {topic.value}%
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="performance-card">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Zap size={18} color="var(--warning)" /> Weak Topics
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Focus more on these topics to improve.</p>
                            <div className="topic-list">
                                {metrics.weakTopics.length > 0 ? metrics.weakTopics.map(topic => (
                                    <div key={topic.name} className="topic-item">
                                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{topic.name}</span>
                                        <span className={`accuracy-badge ${topic.value < 50 ? 'accuracy-low' : 'accuracy-mid'}`}>{topic.value}%</span>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Complete more quizzes to identify weak areas.</div>
                                )}
                            </div>
                            <Link to="/upload" className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                                <Brain size={18} /> Practice Now
                            </Link>
                        </div>

                        <div className="performance-card recommendation-card">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={18} color="var(--primary)" /> Recommended for You
                            </h3>
                            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <Brain size={24} color="var(--primary)" />
                                </div>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem' }}>{metrics.weakTopics[0]?.name || "Advanced Data Structures"}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                                    {metrics.weakTopics[0] 
                                        ? `You've struggled with ${metrics.weakTopics[0].name} recently. Let's strengthen your foundation with targeted practice.`
                                        : "Based on your recent performance in Algorithms, we suggest mastering Tries and Heaps."}
                                </p>
                                <Link 
                                    to="/upload" 
                                    state={{ type: 'quiz', topic: metrics.weakTopics[0]?.name || "Advanced Data Structures" }} 
                                    className="btn btn-outline" 
                                    style={{ marginTop: 'auto', width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    Start Learning
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
