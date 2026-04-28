import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { ClipboardCheck, Calendar, Award, ChevronRight } from 'lucide-react';

const MyQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get('/quiz');
                setQuizzes(res.data);
            } catch (err) {
                console.error("Error fetching quizzes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;

    return (
        <div className="animate-fade-in">
            <h2 className="page-title">My Quizzes</h2>
            <p className="page-subtitle" style={{ marginBottom: '2.5rem', textAlign: 'left', marginLeft: 0 }}>
                Review your past performance and keep track of your learning progress.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {quizzes.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <ClipboardCheck size={40} className="text-muted" />
                        </div>
                        <h3>No quizzes yet</h3>
                        <p className="text-muted">Generate your first quiz to start testing your knowledge!</p>
                        <Link to="/upload" state={{ type: 'quiz' }} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                            Generate Quiz
                        </Link>
                    </div>
                ) : (
                    quizzes.map((quiz) => (
                        <div key={quiz._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(8px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--primary)' }}>
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem' }}>{quiz.topic}</h3>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={14} /> {new Date(quiz.createdAt).toLocaleDateString()}
                                        </span>
                                        <span style={{ textTransform: 'capitalize' }}>Difficulty: {quiz.difficulty}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        {quiz.score !== undefined ? `${quiz.score}/${quiz.totalQuestions}` : 'Not Taken'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</div>
                                </div>
                                <Link to={`/quiz/${quiz._id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                                   {quiz.score !== undefined ? 'Retake' : 'Start'} <ChevronRight size={18} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyQuizzes;
