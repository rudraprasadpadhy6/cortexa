import { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, XCircle, PlusCircle, Award, Bookmark } from 'lucide-react';

const Results = () => {
    const location = useLocation();
    const [isBookmarked, setIsBookmarked] = useState(location.state?.quiz?.isBookmarked || false);
    
    if (!location.state) return <Navigate to="/dashboard" />;
    
    const { quiz, selectedAnswers, score, newBadges } = location.state;
    const percentage = Math.round((score / quiz.totalQuestions) * 100);

    const handleBookmark = async () => {
        try {
            const res = await api.patch(`/quiz/${quiz._id}/bookmark`);
            setIsBookmarked(res.data.isBookmarked);
        } catch (err) {
            console.error("Error toggling bookmark:", err);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
                <button 
                    onClick={handleBookmark} 
                    style={{ 
                        position: 'absolute', 
                        top: '1rem', 
                        right: '1rem', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        color: isBookmarked ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                >
                    <Bookmark size={24} fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
                <h1 className="page-title" style={{ fontSize: '3rem', color: percentage >= 70 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444' }}>
                    {percentage}%
                </h1>
                <p className="page-subtitle">You scored {score} out of {quiz.totalQuestions}</p>
                
                {newBadges?.length > 0 && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed var(--primary)', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Award color="#fbbf24" size={24} />
                        <span style={{ fontWeight: '600', color: 'var(--primary)' }}>
                            New Achievement Earned: {newBadges.join(', ')}!
                        </span>
                    </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
                    <Link to="/upload" className="btn btn-primary" state={{ type: 'notes' }}>
                        <PlusCircle size={18} className="inline-block mr-2" /> Create More
                    </Link>
                </div>
            </div>

            <h3 style={{ marginBottom: '1.5rem' }}>Detailed Review</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {quiz.questions.map((q, idx) => {
                    const userAns = selectedAnswers[idx];
                    const isCorrect = userAns === q.correctAnswer;
                    
                    return (
                        <div key={idx} className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ marginTop: '0.25rem' }}>
                                    {isCorrect ? <CheckCircle color="#10b981" /> : <XCircle color="#ef4444" />}
                                </div>
                                <h4 style={{ fontSize: '1.125rem', lineHeight: 1.5 }}>{q.questionText}</h4>
                            </div>
                            
                            <div style={{ marginLeft: '2.5rem' }}>
                                <div style={{ marginBottom: '0.5rem', color: isCorrect ? '#10b981' : '#ef4444' }}>
                                    <strong>Your Answer:</strong> {userAns || "Skipped"}
                                </div>
                                {!isCorrect && (
                                    <div style={{ color: '#10b981' }}>
                                        <strong>Correct Answer:</strong> {q.correctAnswer}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Results;
