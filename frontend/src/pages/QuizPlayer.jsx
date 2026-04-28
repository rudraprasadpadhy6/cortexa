import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

const QuizPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateUser } = useContext(AuthContext);
    
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quiz/${id}`);
                setQuiz(res.data);
            } catch (err) {
                console.error("Error fetching quiz", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
            <div className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>Loading your education quest...</div>
        </div>
    );
    
    if (!quiz) return <div style={{ textAlign: 'center', padding: '5rem' }}>Quiz not found.</div>;

    const question = quiz.questions[currentIdx];
    const isFirst = currentIdx === 0;
    const isLast = currentIdx === quiz.questions.length - 1;
    const letters = ['A', 'B', 'C', 'D'];

    const handleSelect = (option) => {
        setSelectedAnswers({ ...selectedAnswers, [currentIdx]: option });
    };

    const handleNext = () => {
        if (!isLast) setCurrentIdx(currentIdx + 1);
    };

    const handlePrev = () => {
        if (!isFirst) setCurrentIdx(currentIdx - 1);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        let score = 0;
        quiz.questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correctAnswer) score += 1;
        });

        try {
            const res = await api.post(`/quiz/${id}/submit`, { score });
            if (res.data.user) {
                updateUser(res.data.user);
            }
            navigate('/quiz-results', { state: { quiz, selectedAnswers, score, newBadges: res.data.newBadges } });
        } catch (err) {
            console.error("Error submitting quiz", err);
            setSubmitting(false);
        }
    };

    const progress = ((currentIdx + 1) / quiz.totalQuestions) * 100;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                    <h2 className="page-title" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{quiz.topic}</h2>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> Est. 5 mins</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><HelpCircle size={16} /> {quiz.totalQuestions} Questions</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                        Quest {currentIdx + 1} <span style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem' }}>/ {quiz.totalQuestions}</span>
                    </div>
                    <div style={{ width: '120px', height: '6px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.4s ease' }}></div>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '3rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '2.5rem', lineHeight: 1.4, color: 'var(--text-primary)' }}>
                    {question.questionText}
                </h3>

                <div className="quiz-options-container">
                    {question.options.map((opt, i) => (
                        <button
                            key={i}
                            className={`quiz-option ${selectedAnswers[currentIdx] === opt ? 'selected' : ''}`}
                            onClick={() => handleSelect(opt)}
                        >
                            <span className="option-prefix">{letters[i]}</span>
                            <span>{opt}</span>
                            {selectedAnswers[currentIdx] === opt && (
                                <CheckCircle2 size={18} style={{ marginLeft: 'auto' }} />
                            )}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3.5rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                    <button className="btn btn-outline" onClick={handlePrev} disabled={isFirst} style={{ minWidth: '120px', visibility: isFirst ? 'hidden' : 'visible' }}>
                        <ChevronLeft size={20} /> Previous
                    </button>
                    
                    {isLast ? (
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !selectedAnswers[currentIdx]} style={{ minWidth: '160px', padding: '0.875rem 2rem' }}>
                            {submitting ? 'Calculating...' : 'Complete Quiz'}
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleNext} disabled={!selectedAnswers[currentIdx]} style={{ minWidth: '160px', padding: '0.875rem 2rem' }}>
                            Next Question <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPlayer;
